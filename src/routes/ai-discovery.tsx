import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { AiMatcher } from "@/components/ai-matcher";

export const Route = createFileRoute("/ai-discovery")({
  head: () => ({
    meta: [
      { title: "AI Discovery — Kaslyn Atelier" },
      { name: "description", content: "Describe your campaign. Our AI casting engine surfaces a curated shortlist of Kaslyn Atelier models within seconds." },
      { property: "og:title", content: "AI Discovery — Kaslyn Atelier" },
      { property: "og:description", content: "Describe your campaign. The AI casting engine returns a curated shortlist in seconds." },
    ],
  }),
  component: AiDiscoveryPage,
});

function AiDiscoveryPage() {
  return (
    <div className="min-h-screen bg-midnight text-cream relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,var(--terra-bronze)_0%,transparent_45%)] opacity-20 pointer-events-none" />
      <div className="relative">
        <SiteNav variant="dark" />
        <section className="px-6 md:px-12 pt-12 pb-20 md:pt-20 md:pb-28">
          <div className="max-w-6xl mx-auto">
            <span className="text-terra-mid text-[10px] uppercase tracking-[0.3em] font-bold">Atelier · Casting Engine v1.0</span>
            <h1 className="font-serif text-5xl md:text-8xl mt-4 leading-[0.95] italic">
              Describe the campaign.<br />
              <span className="text-terra-light not-italic">We curate the cast.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-cream/60 leading-relaxed">
              Our AI casting engine reads your brief — mood, market, energy, references — and returns three models from the Kaslyn roster, ranked by fit, with a sentence on why each one belongs in your campaign. Curated by a human director before contact.
            </p>
          </div>
        </section>

        <section className="px-6 md:px-12 pb-24">
          <div className="max-w-4xl mx-auto">
            <AiMatcher variant="dark" />
          </div>
        </section>

        <section className="px-6 md:px-12 py-20 border-t border-cream/10">
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10">
            {[
              { n: "01", t: "Describe", d: "Tell us about your campaign in plain language — mood, audience, deliverable." },
              { n: "02", t: "Match", d: "The engine scans the roster against your brief and ranks the strongest three." },
              { n: "03", t: "Refine", d: "A casting director reviews the shortlist within 24 hours and opens conversation." },
            ].map((step) => (
              <div key={step.n}>
                <span className="text-terra-mid text-[10px] uppercase tracking-[0.3em] font-bold">{step.n}</span>
                <h3 className="font-serif text-2xl mt-2">{step.t}</h3>
                <p className="text-cream/60 text-sm mt-3 leading-relaxed">{step.d}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <SiteFooter />
    </div>
  );
}