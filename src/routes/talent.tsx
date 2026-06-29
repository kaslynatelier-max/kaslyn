import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { ModelCard } from "@/components/model-card";
import { MODELS } from "@/lib/models";

export const Route = createFileRoute("/talent")({
  head: () => ({
    meta: [
      { title: "Talent — Kaslyn Atelier" },
      { name: "description", content: "Browse the Kaslyn Atelier roster — editorial, runway, beauty, and commercial models curated for the world's luxury houses." },
      { property: "og:title", content: "Talent — Kaslyn Atelier" },
      { property: "og:description", content: "Browse the Kaslyn Atelier roster of editorial, runway, beauty, and commercial models." },
    ],
  }),
  component: TalentPage,
});

function TalentPage() {
  return (
    <div className="min-h-screen bg-cream text-midnight">
      <SiteNav />
      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-midnight/5">
        <div className="max-w-7xl mx-auto">
          <span className="text-terra-bronze text-[10px] uppercase tracking-[0.3em] font-bold">The Archive · No. 042</span>
          <h1 className="font-serif text-5xl md:text-8xl mt-4 leading-[0.95] italic">The Roster.</h1>
          <p className="mt-6 max-w-xl text-foreground/60 leading-relaxed">
            Every face here was chosen for a specific kind of campaign — measured, deliberate, never auditioned in volume. Tap a card to begin a casting conversation.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 py-20">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-x-8 md:gap-y-16">
          {MODELS.map((m, i) => (
            <ModelCard key={m.slug} model={m} offset={i % 3 === 1} />
          ))}
        </div>
      </section>

      <section className="px-6 md:px-12 py-24 bg-midnight text-cream">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-6xl italic leading-tight">Looking for someone we haven't shown?</h2>
          <p className="mt-6 text-cream/60 max-w-xl mx-auto">Our extended roster spans 80+ exclusive faces. Use the AI Discovery brief to surface a private shortlist.</p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-3">
            <Link to="/ai-discovery" className="px-8 py-4 bg-terra-bronze text-cream text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-cream hover:text-midnight transition-colors">Open AI Discovery</Link>
            <Link to="/contact" className="px-8 py-4 border border-cream/30 text-cream text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-cream hover:text-midnight transition-colors">Direct Casting</Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}