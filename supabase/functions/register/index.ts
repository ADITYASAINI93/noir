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

    // 2.1 Connect to Supabase using service role internally
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 2.2 Secure Authenticated Identity Verification from Authorization header
    let authenticatedUser: { id: string; email?: string } | null = null;
    const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
    if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
      const token = authHeader.substring(7).trim();
      if (token && token !== supabaseServiceKey) {
        try {
          const { data: userData, error: userError } = await supabase.auth.getUser(token);
          if (!userError && userData?.user?.id) {
            authenticatedUser = {
              id: userData.user.id,
              email: userData.user.email?.toLowerCase(),
            };
          }
        } catch (e) {
          console.warn("Could not verify auth token:", e);
        }
      }
    }

    // 2.3 Action: Securely Fetch Passes for Authenticated Caller
    if (body.action === "get_user_passes") {
      if (!authenticatedUser) {
        return new Response(
          JSON.stringify({ error: "Authentication required to retrieve passes." }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Query by user_id OR verified email from token
      let userPasses: unknown[] = [];
      try {
        let passQuery = supabase
          .from("registrations")
          .select("*")
          .order("created_at", { ascending: false });

        if (authenticatedUser.email) {
          passQuery = passQuery.or(`user_id.eq.${authenticatedUser.id},email.ilike.${authenticatedUser.email}`);
        } else {
          passQuery = passQuery.eq("user_id", authenticatedUser.id);
        }

        const { data, error } = await passQuery;
        if (!error && data) {
          userPasses = data;
        } else if (authenticatedUser.email) {
          // If user_id column doesn't exist yet, query by verified email
          const fallback = await supabase
            .from("registrations")
            .select("*")
            .ilike("email", authenticatedUser.email)
            .order("created_at", { ascending: false });
          userPasses = fallback.data || [];
        }
      } catch (err) {
        console.warn("Pass fetch query error:", err);
      }

      return new Response(
        JSON.stringify({
          success: true,
          registrations: userPasses,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // --- REGISTRATION SUBMISSION FLOW ---
    const {
      full_name,
      email,
      phone,
      instagram_handle,
      registration_category,
      gender,
      event_name,
      event_date,
      venue,
      privacy_acknowledged,
    } = body;

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

    const allowedGenders = ["Male", "Female", "Non-Binary", "Prefer not to say"];
    const sanitizedGender = gender && allowedGenders.includes(gender) ? gender : null;

    const sanitizedEventName = event_name && typeof event_name === "string" && event_name.trim().length > 0
      ? event_name.trim()
      : "NOIR — Chandigarh After Dark";
    const sanitizedEventDate = event_date && typeof event_date === "string" && event_date.trim().length > 0
      ? event_date.trim()
      : "December 2026";
    const sanitizedVenue = venue && typeof venue === "string" && venue.trim().length > 0
      ? venue.trim()
      : "Chandigarh, India";

    // 4. Generate unique luxury reference ID: NOIR-XXXXXX
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    const reference_id = `NOIR-${randomHex}`;

    // 5. Use verified authenticated user ID
    const sanitizedUserId = authenticatedUser ? authenticatedUser.id : null;

    // Retroactively link any past registrations that used this email while signed out
    if (sanitizedUserId && sanitizedEmail) {
      try {
        await supabase
          .from("registrations")
          .update({ user_id: sanitizedUserId })
          .is("user_id", null)
          .eq("email", sanitizedEmail);
      } catch (linkErr) {
        console.warn("Auto-link prior registrations notice:", linkErr);
      }
    }

    // 6. Check for duplicate active registration for the same event by user_id OR email
    let existingQuery = supabase
      .from("registrations")
      .select("id, reference_id, full_name, email, registration_category, registration_status, created_at")
      .neq("registration_status", "cancelled");

    if (sanitizedUserId) {
      try {
        existingQuery = existingQuery.or(`user_id.eq.${sanitizedUserId},email.eq.${sanitizedEmail}`);
      } catch {
        existingQuery = existingQuery.eq("email", sanitizedEmail);
      }
    } else {
      existingQuery = existingQuery.eq("email", sanitizedEmail);
    }

    const { data: existingList } = await existingQuery;
    
    // Check if user already has an active registration for this particular event
    const existingForEvent = (existingList || []).find((r: { event_name?: string | null }) => {
      const rowEvent = r.event_name || "NOIR — Chandigarh After Dark";
      return rowEvent.toLowerCase() === sanitizedEventName.toLowerCase();
    });

    if (existingForEvent) {
      return new Response(
        JSON.stringify({
          error: "You're already on the guest list.",
          reference_id: existingForEvent.reference_id,
          existing_registration: existingForEvent,
        }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 7. Insert registration record with graceful column fallback
    const insertPayload: Record<string, unknown> = {
      reference_id,
      full_name: sanitizedName,
      email: sanitizedEmail,
      phone: sanitizedPhone,
      instagram_handle: sanitizedInstagram,
      registration_category: sanitizedCategory,
      registration_status: "registered",
    };
    if (sanitizedUserId) insertPayload.user_id = sanitizedUserId;
    if (sanitizedGender) insertPayload.gender = sanitizedGender;
    if (sanitizedEventName) insertPayload.event_name = sanitizedEventName;
    if (sanitizedEventDate) insertPayload.event_date = sanitizedEventDate;
    if (sanitizedVenue) insertPayload.venue = sanitizedVenue;

    let insertRes = await supabase.from("registrations").insert(insertPayload).select("*").single();

    // If database table doesn't have newer columns yet, fallback to baseline insert
    if (insertRes.error && (insertRes.error.code === "42703" || insertRes.error.message?.includes("column"))) {
      const baselinePayload = {
        reference_id,
        full_name: sanitizedName,
        email: sanitizedEmail,
        phone: sanitizedPhone,
        instagram_handle: sanitizedInstagram,
        registration_category: sanitizedCategory,
        registration_status: "registered",
      };
      insertRes = await supabase.from("registrations").insert(baselinePayload).select("*").single();
    }

    if (insertRes.error) {
      console.error("Database insert error:", insertRes.error);
      return new Response(
        JSON.stringify({ error: "Failed to process registration. Please try again later." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Registration completed successfully.",
        registration: {
          ...insertRes.data,
          event_name: sanitizedEventName,
          event_date: sanitizedEventDate,
          venue: sanitizedVenue,
        },
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
