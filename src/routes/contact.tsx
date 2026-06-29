import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Kaslyn Atelier" },
      { name: "description", content: "Book Kaslyn Atelier talent. Mumbai · Milan · Paris. Casting, brand campaigns, runway, editorial." },
      { property: "og:title", content: "Contact — Kaslyn Atelier" },
      { property: "og:description", content: "Book Kaslyn Atelier talent. Casting, brand campaigns, runway, editorial." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="min-h-screen bg-cream text-midnight">
      <SiteNav />
      <section className="px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
          <div>
            <span className="text-terra-bronze text-[10px] uppercase tracking-[0.3em] font-bold">Bookings</span>
            <h1 className="font-serif text-5xl md:text-7xl mt-4 leading-[0.95] italic">Begin the conversation.</h1>
            <p className="mt-6 text-foreground/60 leading-relaxed max-w-md">
              Tell us about the campaign, the timeline, and the kind of presence you're looking for. A casting director will respond within 48 hours.
            </p>
            <div className="mt-12 space-y-8 text-sm">
              <div>
                <h5 className="text-[10px] uppercase tracking-[0.3em] font-bold text-terra-bronze">Mumbai · Headquarters</h5>
                <p className="mt-2 text-foreground/70">Atelier 14, Kala Ghoda<br />Mumbai 400001, India</p>
              </div>
              <div>
                <h5 className="text-[10px] uppercase tracking-[0.3em] font-bold text-terra-bronze">Bookings</h5>
                <p className="mt-2 text-foreground/70">booking@kaslynatelier.co.in<br />+91 22 4000 7700</p>
              </div>
              <div>
                <h5 className="text-[10px] uppercase tracking-[0.3em] font-bold text-terra-bronze">Press</h5>
                <p className="mt-2 text-foreground/70">press@kaslynatelier.co.in</p>
              </div>
            </div>
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            className="bg-midnight text-cream p-8 md:p-12 space-y-6"
          >
            {sent ? (
              <div className="py-20 text-center space-y-4">
                <h3 className="font-serif text-3xl italic">Thank you.</h3>
                <p className="text-cream/60 text-sm">A casting director will be in touch within 48 hours.</p>
              </div>
            ) : (
              <>
                {[
                  { id: "name", label: "Name", type: "text" },
                  { id: "brand", label: "Brand / Company", type: "text" },
                  { id: "email", label: "Email", type: "email" },
                ].map((f) => (
                  <div key={f.id}>
                    <label className="text-[10px] uppercase tracking-[0.25em] text-terra-light block mb-2">{f.label}</label>
                    <input
                      required
                      type={f.type}
                      className="w-full bg-transparent border-b border-cream/20 py-3 text-cream focus:outline-none focus:border-terra-mid"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-[10px] uppercase tracking-[0.25em] text-terra-light block mb-2">Project Type</label>
                  <select className="w-full bg-transparent border-b border-cream/20 py-3 text-cream focus:outline-none focus:border-terra-mid">
                    {["Editorial", "Brand Campaign", "Runway", "Film / Video", "Social Content", "Other"].map((o) => (
                      <option key={o} className="bg-midnight">{o}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.25em] text-terra-light block mb-2">Brief</label>
                  <textarea rows={5} required className="w-full bg-transparent border-b border-cream/20 py-3 text-cream focus:outline-none focus:border-terra-mid resize-none" />
                </div>
                <button type="submit" className="w-full mt-4 py-4 bg-terra-bronze text-cream text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-cream hover:text-midnight transition-colors">
                  Submit Casting Brief
                </button>
              </>
            )}
          </form>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}