import { createFileRoute } from "@tanstack/react-router";

// Sends any pending admin notifications via Gmail (kaslynatelier@gmail.com).
// Public URL so a scheduler / manual trigger can call it. Idempotent per row.
export const Route = createFileRoute("/api/public/process-notifications")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { data: settings } = await supabaseAdmin
          .from("site_settings")
          .select("admin_notify_email")
          .eq("id", true)
          .maybeSingle();
        const to = settings?.admin_notify_email ?? "kaslynatelier@gmail.com";

        const { data: pending, error } = await supabaseAdmin
          .from("admin_notifications")
          .select("id, subject, body")
          .eq("sent", false)
          .order("created_at", { ascending: true })
          .limit(20);
        if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });
        if (!pending || pending.length === 0) return Response.json({ ok: true, processed: 0 });

        const lovableKey = process.env.LOVABLE_API_KEY;
        const gmailKey = process.env.GOOGLE_MAIL_API_KEY;
        if (!lovableKey || !gmailKey) {
          return Response.json({ ok: false, error: "Gmail credentials missing" }, { status: 500 });
        }

        function toBase64Url(str: string) {
          const b64 = typeof Buffer !== "undefined"
            ? Buffer.from(str, "utf-8").toString("base64")
            : btoa(unescape(encodeURIComponent(str)));
          return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
        }

        let sent = 0;
        for (const n of pending) {
          const raw = toBase64Url(
            [
              `To: ${to}`,
              `Subject: ${n.subject}`,
              'Content-Type: text/plain; charset="UTF-8"',
              '',
              n.body,
            ].join("\r\n"),
          );
          const res = await fetch(
            "https://connector-gateway.lovable.dev/google_mail/gmail/v1/users/me/messages/send",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${lovableKey}`,
                "X-Connection-Api-Key": gmailKey,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ raw }),
            },
          );
          if (res.ok) {
            await supabaseAdmin
              .from("admin_notifications")
              .update({ sent: true, sent_at: new Date().toISOString(), error: null })
              .eq("id", n.id);
            sent++;
          } else {
            const text = await res.text();
            await supabaseAdmin
              .from("admin_notifications")
              .update({ error: `${res.status}: ${text.slice(0, 500)}` })
              .eq("id", n.id);
          }
        }

        return Response.json({ ok: true, processed: sent, total: pending.length });
      },
    },
  },
});
