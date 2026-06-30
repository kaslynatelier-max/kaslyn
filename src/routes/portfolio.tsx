import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { MODELS } from "@/lib/models";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Kaslyn" },
      { name: "description", content: "Selected works, collaborations and campaigns by Kaslyn — luxury modeling agency in Mumbai." },
      { property: "og:title", content: "Portfolio — Kaslyn" },
      { property: "og:description", content: "Selected works, collaborations, and campaigns." },
    ],
  }),
  component: PortfolioPage,
});

const WORKS = [
  { title: "Sabyasachi — Royal Heritage", year: "2025", category: "Campaign", image: MODELS[1].image },
  { title: "Tata CLiQ Luxury — Editorial", year: "2025", category: "Editorial", image: MODELS[0].image },
  { title: "Vogue India — Couture", year: "2024", category: "Print", image: MODELS[3].image },
  { title: "Forest Essentials — Beauty Film", year: "2024", category: "Film", image: MODELS[2].image },
  { title: "Hermès — Maison Mumbai", year: "2024", category: "Brand Campaign", image: MODELS[5].image },
  { title: "i-D Magazine — Street Couture", year: "2023", category: "Editorial", image: MODELS[4].image },
];

const COLLABS = ["Sabyasachi", "Vogue India", "Tata CLiQ", "Hermès", "Forest Essentials", "Dior", "Cartier", "Saint Laurent", "Tod's", "Bottega"];

const SERVICES = [
  { t: "Model Placement", d: "International casting & long-term representation." },
  { t: "Brand Marketing", d: "Strategy, brand voice, and campaign architecture." },
  { t: "Video Production", d: "Direction, cinematography, post-production." },
  { t: "Social Management", d: "Editorial calendars and creator-led storytelling." },
  { t: "Editorial Shoots", d: "Mood-board to printed page in-house." },
  { t: "Talent Discovery", d: "AI-powered, human-curated shortlists." },
];

function PortfolioPage() {
  return (
    <div className="min-h-screen bg-cream text-midnight">
      <SiteNav />
      <section className="px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-7xl mx-auto">
          <span className="text-terra-bronze text-[10px] uppercase tracking-[0.3em] font-bold">Selected Works · 2023 — 2025</span>
          <h1 className="font-serif text-5xl md:text-8xl mt-3 italic leading-[0.95]">Portfolio.</h1>
          <p className="mt-6 max-w-xl text-foreground/60 leading-relaxed">A measured archive of campaigns, editorials, and collaborations Kaslyn has authored across India and Europe.</p>
        </div>
      </section>

      <section className="px-6 md:px-12 pb-20">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {WORKS.map((w) => (
            <figure key={w.title} className="group">
              <div className="aspect-[3/4] overflow-hidden bg-midnight">
                <img src={w.image} alt={w.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]" />
              </div>
              <figcaption className="mt-4">
                <p className="text-[10px] uppercase tracking-[0.25em] text-terra-bronze">{w.category} · {w.year}</p>
                <h3 className="font-serif text-xl mt-1">{w.title}</h3>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-12 py-20 bg-midnight text-cream">
        <div className="max-w-7xl mx-auto">
          <span className="text-terra-mid text-[10px] uppercase tracking-[0.3em] font-bold">Collaborations</span>
          <h2 className="font-serif text-4xl md:text-6xl mt-3 italic">Houses we've dressed.</h2>
          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 text-2xl md:text-3xl font-serif">
            {COLLABS.map((c) => <span key={c} className="text-cream/70 hover:text-cream cursor-default">{c}</span>)}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-20 bg-terra-bronze text-cream">
        <div className="max-w-7xl mx-auto">
          <span className="text-terra-light text-[10px] uppercase tracking-[0.3em] font-bold">Services</span>
          <h2 className="font-serif text-4xl md:text-6xl mt-3 italic">What we do.</h2>
          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((s) => (
              <div key={s.t} className="border-t border-cream/30 pt-5">
                <h3 className="font-serif text-2xl">{s.t}</h3>
                <p className="text-sm opacity-90 mt-2">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-20">
        <div className="max-w-7xl mx-auto">
          <span className="text-terra-bronze text-[10px] uppercase tracking-[0.3em] font-bold">Social</span>
          <h2 className="font-serif text-4xl md:text-6xl mt-3 italic">Follow the atelier.</h2>
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              { name: "Instagram", url: "https://instagram.com" },
              { name: "Vimeo", url: "#" },
              { name: "Behance", url: "#" },
              { name: "Pinterest", url: "#" },
            ].map((s) => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="px-5 py-3 border border-midnight/30 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-midnight hover:text-cream transition-colors">{s.name} →</a>
            ))}
          </div>
          <Link to="/contact" className="mt-12 inline-block px-8 py-4 bg-midnight text-cream text-[10px] uppercase tracking-[0.3em] font-bold">Book the atelier →</Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}