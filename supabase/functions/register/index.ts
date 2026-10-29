// ==============================================================================
// NOIR CHD — Secure Registration Supabase Edge Function (Deno)
// Route: /functions/v1/register
// ==============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// In-memory rate limiting map for basic abuse prevention (IP -> count)
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.expiresAt) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + 60 * 1000 }); // 1 minute window
    return false;
  }
  if (entry.count >= 5) {
    return true; // Max 5 submissions per minute per IP
  }
  entry.count += 1;
  return false;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // 1. IP rate limiting
    const clientIp = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown";
    if (isRateLimited(clientIp)) {
      return new Response(
        JSON.stringify({ error: "Too many registration attempts. Please wait a moment before trying again." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Parse body
    const body = await req.json();
    const { full_name, email, phone, instagram_handle, registration_category, privacy_acknowledged } = body;

    // 3. Strict validation
    if (!privacy_acknowledged) {
      return new Response(
        JSON.stringify({ error: "You must acknowledge the privacy notice to complete registration." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!full_name || typeof full_name !== "string" || full_name.trim().length < 2) {
      return new Response(
        JSON.stringify({ error: "Full name is required (minimum 2 characters)." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      return new Response(
        JSON.stringify({ error: "A valid email address is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Clean inputs
    const sanitizedName = full_name.trim();
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedPhone = phone && typeof phone === "string" ? phone.trim() : null;
    const sanitizedInstagram = instagram_handle && typeof instagram_handle === "string"
      ? (instagram_handle.startsWith("@") ? instagram_handle.trim() : `@${instagram_handle.trim()}`)
      : null;
    const allowedCategories = ["VIP Guest List", "General Access", "Table Inquiry", "Media & Press", "Guest"];
    const sanitizedCategory = allowedCategories.includes(registration_category) ? registration_category : "Guest";

    // 4. Generate unique luxury reference ID: NOIR-XXXXXX
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    const reference_id = `NOIR-${randomHex}`;

    // 5. Connect to Supabase using service role to bypass anon restrictions internally
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 6. Check for duplicate active registration with the same email
    const { data: existing } = await supabase
      .from("registrations")
      .select("reference_id, created_at")
      .eq("email", sanitizedEmail)
      .neq("registration_status", "cancelled")
      .maybeSingle();

    if (existing) {
      return new Response(
        JSON.stringify({
          error: "A registration with this email already exists.",
          reference_id: existing.reference_id,
        }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 7. Insert the approved registration record
    const { data, error } = await supabase
      .from("registrations")
      .insert({
        reference_id,
        full_name: sanitizedName,
        email: sanitizedEmail,
        phone: sanitizedPhone,
        instagram_handle: sanitizedInstagram,
        registration_category: sanitizedCategory,
        registration_status: "registered", // Strict default, cannot be overridden
      })
      .select("id, reference_id, full_name, email, phone, instagram_handle, registration_category, created_at")
      .single();

    if (error) {
      console.error("Database insert error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to process registration. Please try again later." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Registration completed successfully.",
        registration: data,
      }),
      { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
