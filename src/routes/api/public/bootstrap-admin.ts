import { createFileRoute } from "@tanstack/react-router";

// One-shot admin seed. Idempotent — creates both the standard admin and super_admin.
export const Route = createFileRoute("/api/public/bootstrap-admin")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const seeds: Array<{ email: string; password: string }> = [
          { email: "kaslyn@admin.com", password: "root" },
          { email: "root@admin.com", password: "root" },
        ];
        const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
        const results: Array<{ email: string; status: string; user_id?: string; error?: string }> = [];
        for (const s of seeds) {
          const existing = list?.users.find((u) => (u.email ?? "").toLowerCase() === s.email);
          if (existing) { results.push({ email: s.email, status: "already_exists", user_id: existing.id }); continue; }
          const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email: s.email, password: s.password, email_confirm: true,
          });
          if (error) results.push({ email: s.email, status: "error", error: error.message });
          else results.push({ email: s.email, status: "created", user_id: data.user?.id });
        }
        return Response.json({ ok: true, results });
      },
    },
  },
});