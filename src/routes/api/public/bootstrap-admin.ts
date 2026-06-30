import { createFileRoute } from "@tanstack/react-router";

// One-shot admin seed. Idempotent — does nothing if the user already exists.
export const Route = createFileRoute("/api/public/bootstrap-admin")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const email = "kaslyn@admin.com";
        const password = "root";

        // Check if user already exists by listing
        const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
        const existing = list?.users.find((u) => (u.email ?? "").toLowerCase() === email);
        if (existing) {
          return Response.json({ ok: true, status: "already_exists", user_id: existing.id });
        }

        const { data, error } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        });
        if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });
        return Response.json({ ok: true, status: "created", user_id: data.user?.id });
      },
    },
  },
});