// ==============================================================================
// NOIR EVENTS — Admin Manage Users Edge Function (Deno)
// Route: /functions/v1/admin-manage-users
// ==============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request) => {
  // CORS Preflight
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
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Server configuration missing: SUPABASE_SERVICE_ROLE_KEY" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Authenticate caller from Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing Authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Client to verify caller JWT
    const callerClient = createClient(supabaseUrl, supabaseAnonKey || supabaseServiceKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });

    const { data: { user: callerUser }, error: callerAuthError } = await callerClient.auth.getUser();
    if (callerAuthError || !callerUser) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid session or credentials" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Admin Client with Service Role
    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    // 2. Verify caller is in public.admin_users with role IN ('admin', 'superadmin')
    const { data: adminRecord, error: adminCheckError } = await adminClient
      .from("admin_users")
      .select("role")
      .eq("user_id", callerUser.id)
      .maybeSingle();

    if (adminCheckError || !adminRecord || !["admin", "superadmin"].includes(adminRecord.role)) {
      return new Response(
        JSON.stringify({ error: "Forbidden: Administrator privileges required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json().catch(() => ({}));
    const action = body.action;

    // ACTION A: LIST USERS
    if (action === "list") {
      const { data: listData, error: listError } = await adminClient.auth.admin.listUsers({
        page: 1,
        perPage: 100,
      });

      if (listError) {
        return new Response(
          JSON.stringify({ error: listError.message || "Failed to list users" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Query admin_users to tag roles
      const { data: allAdmins } = await adminClient.from("admin_users").select("user_id, role");
      const adminMap = new Map((allAdmins || []).map((a: { user_id: string; role: string }) => [a.user_id, a.role]));

      const sanitizedUsers = (listData?.users || []).map((u: any) => {
        const meta = u.user_metadata || {};
        return {
          id: u.id,
          email: u.email || "",
          full_name: meta.full_name || u.email?.split("@")[0] || "Member",
          phone: meta.phone || null,
          instagram_handle: meta.instagram_handle || null,
          gender: meta.gender || null,
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at || null,
          is_admin: adminMap.has(u.id),
          admin_role: adminMap.get(u.id) || null,
        };
      });

      return new Response(
        JSON.stringify({ success: true, users: sanitizedUsers }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ACTION B: DELETE USER
    if (action === "delete") {
      const targetUserId = body.targetUserId;
      if (!targetUserId || typeof targetUserId !== "string") {
        return new Response(
          JSON.stringify({ error: "Invalid target user ID" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check self-deletion
      if (targetUserId === callerUser.id) {
        return new Response(
          JSON.stringify({ error: "Action blocked: You cannot delete your own administrator account." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check protected admin account
      const { data: targetAdmin } = await adminClient
        .from("admin_users")
        .select("role")
        .eq("user_id", targetUserId)
        .maybeSingle();

      if (targetAdmin && ["admin", "superadmin"].includes(targetAdmin.role)) {
        return new Response(
          JSON.stringify({ error: "Action blocked: Designated administrator accounts cannot be deleted." }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Fetch user details for audit log before deletion
      const { data: { user: targetUser } } = await adminClient.auth.admin.getUserById(targetUserId);

      // Safe data retention / detachment:
      // Detach user_id from any existing registrations so ticket history is preserved
      try {
        await adminClient
          .from("registrations")
          .update({ user_id: null })
          .eq("user_id", targetUserId);
      } catch (e) {
        console.warn("Notice updating registrations on user delete:", e);
      }

      // Delete from profiles if table exists
      try {
        await adminClient.from("profiles").delete().eq("id", targetUserId);
      } catch (e) {
        // Ignored if profiles table doesn't exist
      }

      // Delete user from Supabase Auth via Admin API
      const { error: deleteError } = await adminClient.auth.admin.deleteUser(targetUserId);
      if (deleteError) {
        return new Response(
          JSON.stringify({ error: deleteError.message || "Failed to delete user account." }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Record administrative audit log
      try {
        await adminClient.from("admin_audit_logs").insert([
          {
            actor_id: callerUser.id,
            actor_email: callerUser.email,
            action: "DELETE_USER",
            target_id: targetUserId,
            target_type: "auth.user",
            details: {
              target_email: targetUser?.email,
              target_metadata: targetUser?.user_metadata,
            },
          },
        ]);
      } catch (auditErr) {
        console.warn("Audit log insert notice:", auditErr);
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: `User account ${targetUser?.email || targetUserId} was permanently deleted.`,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: `Unknown action '${action}'` }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
