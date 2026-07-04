import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { listRequests, listAllProfilesAdmin, toggleProfileApproval } from "@/lib/requests.functions";
import { sendReplyEmail } from "@/lib/email.functions";
import { getMyProfile } from "@/lib/profiles.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
});

type Req = { id: string; name: string; email: string; brand?: string | null; project_type?: string | null; brief: string; status: string; admin_reply?: string | null; created_at: string };
type Prof = { id: string; full_name?: string | null; email?: string | null; city?: string | null; height_cm?: number | null; avatar_url?: string | null; is_public: boolean; approved: boolean };

function AdminPage() {
  const fetchProfile = useServerFn(getMyProfile);
  const fetchReqs = useServerFn(listRequests);
  const fetchProfs = useServerFn(listAllProfilesAdmin);
  const sendReply = useServerFn(sendReplyEmail);
  const toggle = useServerFn(toggleProfileApproval);

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<"requests" | "models">("requests");
  const [reqs, setReqs] = useState<Req[]>([]);
  const [profs, setProfs] = useState<Prof[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [invoiceOn, setInvoiceOn] = useState(false);
  const [invNumber, setInvNumber] = useState("");
  const [invCurrency, setInvCurrency] = useState("INR");
  const [invDueDate, setInvDueDate] = useState("");
  const [invItems, setInvItems] = useState<{ description: string; quantity: number; unit_price: number }[]>([
    { description: "", quantity: 1, unit_price: 0 },
  ]);
  const [sending, setSending] = useState(false);
  const [sendErr, setSendErr] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile().then((p) => setIsAdmin(p.roles.includes("admin")));
  }, [fetchProfile]);

  useEffect(() => {
    if (!isAdmin) return;
    fetchReqs().then((d) => setReqs(d as Req[])).catch(() => {});
    fetchProfs().then((d) => setProfs(d as Prof[])).catch(() => {});
  }, [isAdmin, fetchReqs, fetchProfs]);

  if (isAdmin === null) return <div className="min-h-screen flex items-center justify-center bg-cream"><p className="font-serif italic">Checking access…</p></div>;
  if (!isAdmin) return (
    <div className="min-h-screen bg-cream text-midnight">
      <SiteNav />
      <div className="px-6 py-32 text-center">
        <h1 className="font-serif text-5xl italic text-burgundy">Restricted.</h1>
        <p className="mt-4 text-foreground/60">Admin access only.</p>
      </div>
    </div>
  );

  function resetReply() {
    setOpenId(null); setReplyText(""); setInvoiceOn(false);
    setInvNumber(""); setInvDueDate(""); setInvCurrency("INR");
    setInvItems([{ description: "", quantity: 1, unit_price: 0 }]);
    setSendErr(null);
  }
  async function sendReplyNow(r: Req) {
    setSending(true); setSendErr(null);
    try {
      await sendReply({
        data: {
          request_id: r.id,
          to: r.email,
          subject: `Kaslyn Atelier — re: ${r.project_type ?? "your casting brief"}`,
          message: replyText,
          invoice: invoiceOn
            ? {
                number: invNumber || `KAS-${Date.now().toString().slice(-6)}`,
                currency: invCurrency,
                items: invItems.filter((i) => i.description.trim()),
                due_date: invDueDate || undefined,
              }
            : null,
        },
      });
      setReqs((rs) => rs.map((x) => x.id === r.id ? { ...x, status: "replied", admin_reply: replyText } : x));
      resetReply();
    } catch (err) {
      setSendErr(err instanceof Error ? err.message : "Failed to send");
    } finally { setSending(false); }
  }

  async function setApproval(p: Prof, approved: boolean) {
    try {
      await toggle({ data: { id: p.id, approved } });
      setProfs((ps) => ps.map((x) => x.id === p.id ? { ...x, approved } : x));
    } catch {}
  }

  return (
    <div className="min-h-screen bg-cream text-midnight">
      <SiteNav />
      <section className="px-6 md:px-12 py-16 md:py-20 border-b border-midnight/10">
        <div className="max-w-7xl mx-auto">
          <span className="text-terra-bronze text-[10px] uppercase tracking-[0.3em] font-bold">Atelier · Admin</span>
          <h1 className="font-serif text-5xl md:text-7xl mt-3 italic">Control Room.</h1>
          <div className="mt-10 flex gap-3">
            {(["requests", "models"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`px-5 py-3 text-[10px] uppercase tracking-[0.3em] font-bold border ${tab === t ? "bg-midnight text-cream border-midnight" : "border-midnight/20 hover:border-midnight"}`}>
                {t === "requests" ? `Client Requests (${reqs.length})` : `Models (${profs.length})`}
              </button>
            ))}
          </div>
        </div>
      </section>

      {tab === "requests" && (
        <section className="px-6 md:px-12 py-12">
          <div className="max-w-7xl mx-auto space-y-4">
            {reqs.length === 0 && <p className="text-foreground/50 italic">No requests yet.</p>}
            {reqs.map((r) => (
              <article key={r.id} className="border border-midnight/10 p-6 bg-cream">
                <header className="flex flex-wrap items-baseline justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-2xl">{r.name} <span className="text-foreground/40 text-sm">— {r.brand ?? "Independent"}</span></h3>
                    <a href={`mailto:${r.email}`} className="text-xs text-terra-bronze">{r.email}</a>
                  </div>
                  <span className={`text-[10px] uppercase tracking-[0.25em] font-bold px-3 py-1 ${r.status === "replied" ? "bg-terra-bronze text-cream" : "bg-burgundy text-cream"}`}>{r.status}</span>
                </header>
                <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-foreground/50">{r.project_type ?? "—"} · {new Date(r.created_at).toLocaleString()}</p>
                <p className="mt-4 text-sm leading-relaxed whitespace-pre-wrap">{r.brief}</p>
                {r.admin_reply && <p className="mt-4 text-sm text-foreground/60 border-l-2 border-terra-bronze pl-4 italic">{r.admin_reply}</p>}
                {openId === r.id ? (
                  <div className="mt-4 space-y-3">
                    <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={4} placeholder="Draft your reply…" className="w-full p-3 bg-cream border border-midnight/20 focus:outline-none focus:border-terra-bronze" />
                    <label className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-bold">
                      <input type="checkbox" checked={invoiceOn} onChange={(e) => setInvoiceOn(e.target.checked)} />
                      Attach invoice
                    </label>
                    {invoiceOn && (
                      <div className="p-4 border border-midnight/15 bg-cream/50 space-y-3">
                        <div className="grid sm:grid-cols-3 gap-2">
                          <input value={invNumber} onChange={(e) => setInvNumber(e.target.value)} placeholder="Invoice #" className="p-2 bg-cream border border-midnight/20 text-sm" />
                          <input value={invCurrency} onChange={(e) => setInvCurrency(e.target.value)} placeholder="INR" className="p-2 bg-cream border border-midnight/20 text-sm" />
                          <input value={invDueDate} onChange={(e) => setInvDueDate(e.target.value)} placeholder="Due date" className="p-2 bg-cream border border-midnight/20 text-sm" />
                        </div>
                        {invItems.map((it, idx) => (
                          <div key={idx} className="grid grid-cols-[1fr_70px_100px_30px] gap-2">
                            <input value={it.description} onChange={(e) => setInvItems((v) => v.map((x, i) => i === idx ? { ...x, description: e.target.value } : x))} placeholder="Line item" className="p-2 bg-cream border border-midnight/20 text-sm" />
                            <input type="number" min="1" value={it.quantity} onChange={(e) => setInvItems((v) => v.map((x, i) => i === idx ? { ...x, quantity: Number(e.target.value) } : x))} className="p-2 bg-cream border border-midnight/20 text-sm" />
                            <input type="number" min="0" step="0.01" value={it.unit_price} onChange={(e) => setInvItems((v) => v.map((x, i) => i === idx ? { ...x, unit_price: Number(e.target.value) } : x))} className="p-2 bg-cream border border-midnight/20 text-sm" />
                            <button type="button" onClick={() => setInvItems((v) => v.filter((_, i) => i !== idx))} className="text-burgundy">×</button>
                          </div>
                        ))}
                        <button type="button" onClick={() => setInvItems((v) => [...v, { description: "", quantity: 1, unit_price: 0 }])} className="text-[10px] uppercase tracking-[0.2em] font-bold text-terra-bronze">+ Add line</button>
                      </div>
                    )}
                    {sendErr && <p className="text-xs text-burgundy">{sendErr}</p>}
                    <div className="flex gap-2">
                      <button disabled={sending} onClick={() => sendReplyNow(r)} className="px-5 py-2 bg-midnight text-cream text-[10px] uppercase tracking-[0.3em] font-bold disabled:opacity-50">{sending ? "Sending…" : invoiceOn ? "Send reply + invoice" : "Send reply email"}</button>
                      <button onClick={resetReply} className="px-5 py-2 border border-midnight/20 text-[10px] uppercase tracking-[0.3em] font-bold">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => { setOpenId(r.id); setReplyText(r.admin_reply ?? ""); }} className="mt-4 text-[10px] uppercase tracking-[0.25em] font-bold text-terra-bronze underline">
                    Reply via Mail →
                  </button>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {tab === "models" && (
        <section className="px-6 md:px-12 py-12">
          <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {profs.length === 0 && <p className="text-foreground/50 italic">No model profiles yet.</p>}
            {profs.map((p) => (
              <article key={p.id} className="border border-midnight/10 bg-cream">
                <div className="aspect-[3/4] bg-terra-light overflow-hidden">
                  {p.avatar_url ? <img src={p.avatar_url} alt={p.full_name ?? ""} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-midnight/30 font-serif text-4xl italic">{(p.full_name ?? "?").charAt(0)}</div>}
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-serif text-xl italic">{p.full_name ?? "—"}</h3>
                  <p className="text-xs text-foreground/60">{p.email}</p>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-foreground/50">{p.city ?? "—"} · {p.height_cm ? `${p.height_cm} cm` : "—"}</p>
                  <div className="flex gap-2 text-[10px] uppercase tracking-[0.25em] font-bold">
                    <span className={`px-2 py-1 ${p.is_public ? "bg-terra-bronze text-cream" : "bg-midnight/10"}`}>{p.is_public ? "Public req" : "Private"}</span>
                    <span className={`px-2 py-1 ${p.approved ? "bg-midnight text-cream" : "bg-burgundy/20 text-burgundy"}`}>{p.approved ? "Approved" : "Pending"}</span>
                  </div>
                  {p.is_public && (
                    <button onClick={() => setApproval(p, !p.approved)} className="mt-2 w-full py-2 text-[10px] uppercase tracking-[0.3em] font-bold bg-midnight text-cream hover:bg-terra-bronze">
                      {p.approved ? "Revoke approval" : "Approve for roster"}
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <SiteFooter />
    </div>
  );
}