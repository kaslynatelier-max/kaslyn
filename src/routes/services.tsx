import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

const SERVICES = [
  { n: "01", t: "Model Placement", d: "Exclusive representation and international placement for editorial, runway, and brand campaigns." },
  { n: "02", t: "Brand Marketing", d: "Aligning faces with houses — long-form brand strategy that treats casting as cultural authorship." },
  { n: "03", t: "Editorial Shoots", d: "Full creative production from mood-board to printed page, in-house at our Mumbai and Milan studios." },
  { n: "04", t: "Video Production", d: "Direction, cinematography, and post for fragrance films, runway recaps, and brand stories." },
  { n: "05", t: "Social Media Management", d: "Bespoke editorial calendars, content series, and creator-led storytelling for luxury labels." },
  { n: "06", t: "AI Talent Discovery", d: "Our proprietary engine matches your brief to the right talent in seconds — refined by a human curator." },
];

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Kaslyn Atelier" },
      { name: "description", content: "Model placement, brand marketing, editorial shoots, video production, social management, and AI-powered talent discovery." },
      { property: "og:title", content: "Services — Kaslyn Atelier" },
      { property: "og:description", content: "Model placement, brand marketing, editorial, video, social, and AI talent discovery." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <div className="min-h-screen bg-cream text-midnight">
      <SiteNav />
      <section className="px-6 md:px-12 py-20 md:py-32 border-b border-midnight/5">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-end">
          <div>
            <span className="text-terra-bronze text-[10px] uppercase tracking-[0.3em] font-bold">What We Do</span>
            <h1 className="font-serif text-5xl md:text-8xl mt-4 leading-[0.95] italic">Six disciplines,<br />one atelier.</h1>
          </div>
          <p className="text-foreground/60 leading-relaxed max-w-md">
            We don't bolt services together. Every engagement begins with a casting director, a creative producer, and a brand strategist — in the same room.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 py-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-midnight/10">
          {SERVICES.map((s) => (
            <article key={s.n} className="bg-cream p-10 group hover:bg-terra-light/50 transition-colors">
              <div className="flex items-baseline justify-between mb-8">
                <span className="text-terra-bronze text-[10px] uppercase tracking-[0.3em] font-bold">{s.n}</span>
                <span className="font-serif text-xl text-midnight/20 group-hover:text-midnight/40 transition-colors">↗</span>
              </div>
              <h3 className="font-serif text-3xl mb-4">{s.t}</h3>
              <p className="text-sm text-foreground/70 leading-relaxed">{s.d}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-12 py-24 bg-midnight text-cream">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-6xl italic leading-tight">Ready to begin?</h2>
          <p className="mt-6 text-cream/60 max-w-xl mx-auto">Tell us about your campaign — we'll respond with a curated shortlist and a creative call within 48 hours.</p>
          <Link to="/contact" className="mt-10 inline-block px-10 py-5 bg-terra-bronze text-cream text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-cream hover:text-midnight transition-colors">Start a Casting</Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}