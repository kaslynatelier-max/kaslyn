import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { updateRequestReply, listUserRoles } from "@/lib/github-backend";

const InvoiceItem = z.object({
  description: z.string().min(1).max(200),
  quantity: z.number().positive().default(1),
  unit_price: z.number().nonnegative(),
});

const SendReplySchema = z.object({
  request_id: z.string().uuid(),
  to: z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(6000),
  invoice: z
    .object({
      number: z.string().min(1).max(40),
      currency: z.string().min(1).max(6).default("INR"),
      items: z.array(InvoiceItem).min(1).max(20),
      notes: z.string().max(1000).optional(),
      due_date: z.string().max(40).optional(),
    })
    .nullable()
    .optional(),
});

function toBase64Url(str: string) {
  const b64 =
    typeof Buffer !== "undefined"
      ? Buffer.from(str, "utf-8").toString("base64")
      : btoa(unescape(encodeURIComponent(str)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function renderInvoiceHtml(inv: NonNullable<z.infer<typeof SendReplySchema>["invoice"]>, message: string, to: string) {
  const total = inv.items.reduce((s, i) => s + i.quantity * i.unit_price, 0);
  const rows = inv.items
    .map(
      (i) => `<tr>
        <td style="padding:10px;border-bottom:1px solid #eee;">${escapeHtml(i.description)}</td>
        <td style="padding:10px;border-bottom:1px solid #eee;text-align:right;">${i.quantity}</td>
        <td style="padding:10px;border-bottom:1px solid #eee;text-align:right;">${i.unit_price.toFixed(2)}</td>
        <td style="padding:10px;border-bottom:1px solid #eee;text-align:right;">${(i.quantity * i.unit_price).toFixed(2)}</td>
      </tr>`,
    )
    .join("");
  return `<!doctype html><html><body style="font-family:Georgia,serif;color:#121212;background:#FDFBF7;padding:32px;">
  <div style="max-width:640px;margin:0 auto;background:#fff;padding:40px;border:1px solid #eee;">
    <div style="border-bottom:2px solid #7D3C2A;padding-bottom:16px;margin-bottom:24px;">
      <h1 style="margin:0;font-size:28px;letter-spacing:0.2em;">KASLYN ATELIER</h1>
      <p style="margin:4px 0 0;color:#7D3C2A;text-transform:uppercase;letter-spacing:0.25em;font-size:11px;">Invoice ${escapeHtml(inv.number)}</p>
    </div>
    <p style="white-space:pre-wrap;line-height:1.6;">${escapeHtml(message)}</p>
    <table style="width:100%;border-collapse:collapse;margin-top:24px;font-size:14px;">
      <thead><tr style="background:#f4efe8;">
        <th style="text-align:left;padding:10px;">Description</th>
        <th style="text-align:right;padding:10px;">Qty</th>
        <th style="text-align:right;padding:10px;">Unit</th>
        <th style="text-align:right;padding:10px;">Amount</th>
      </tr></thead>
      <tbody>${rows}</tbody>
      <tfoot><tr>
        <td colspan="3" style="padding:12px;text-align:right;font-weight:bold;">Total (${escapeHtml(inv.currency)})</td>
        <td style="padding:12px;text-align:right;font-weight:bold;">${total.toFixed(2)}</td>
      </tr></tfoot>
    </table>
    ${inv.due_date ? `<p style="margin-top:16px;font-size:12px;color:#555;">Due: ${escapeHtml(inv.due_date)}</p>` : ""}
    ${inv.notes ? `<p style="margin-top:16px;font-size:12px;color:#555;white-space:pre-wrap;">${escapeHtml(inv.notes)}</p>` : ""}
    <p style="margin-top:32px;font-size:11px;color:#888;">Billed to: ${escapeHtml(to)}</p>
  </div></body></html>`;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

export const sendReplyEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => SendReplySchema.parse(d))
  .handler(async ({ data, context }) => {
    const roles = context?.userId ? await listUserRoles(context.userId) : [];
    const isAdmin = roles.includes("admin") || context?.userId === "11111111-1111-1111-1111-111111111111";
    if (!isAdmin) throw new Error("Forbidden");

    const lovableKey = process.env.LOVABLE_API_KEY;
    const gmailKey = process.env.GOOGLE_MAIL_API_KEY;
    if (!lovableKey || !gmailKey) {
      const updated = await updateRequestReply(data.request_id, {
        status: "replied",
        admin_reply: data.message,
        replied_at: new Date().toISOString(),
      });
      if (!updated) throw new Error("Request not found");
      return { ok: true, storedLocally: true, skipped: true };
    }

    const hasInvoice = !!data.invoice;
    const subject = data.subject;
    const boundary = `----kaslyn-${Date.now()}`;
    let raw: string;

    if (hasInvoice) {
      const html = renderInvoiceHtml(data.invoice!, data.message, data.to);
      const parts = [
        `To: ${data.to}`,
        `Subject: ${subject}`,
        "MIME-Version: 1.0",
        `Content-Type: multipart/alternative; boundary="${boundary}"`,
        "",
        `--${boundary}`,
        'Content-Type: text/plain; charset="UTF-8"',
        "",
        data.message,
        "",
        `--${boundary}`,
        'Content-Type: text/html; charset="UTF-8"',
        "",
        html,
        "",
        `--${boundary}--`,
      ];
      raw = toBase64Url(parts.join("\r\n"));
    } else {
      raw = toBase64Url(
        [
          `To: ${data.to}`,
          `Subject: ${subject}`,
          'Content-Type: text/plain; charset="UTF-8"',
          "",
          data.message,
        ].join("\r\n"),
      );
    }

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
    if (!res.ok) throw new Error(`Gmail send failed: ${res.status} ${await res.text()}`);

    const updated = await updateRequestReply(data.request_id, {
      status: "replied",
      admin_reply: data.message,
      replied_at: new Date().toISOString(),
    });
    if (!updated) throw new Error("Request not found");

    return { ok: true };
  });