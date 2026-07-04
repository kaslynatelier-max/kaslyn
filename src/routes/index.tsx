import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { AiMatcher } from "@/components/ai-matcher";
import { MODELS } from "@/lib/models";
import heroVideo from "@/assets/kaslyn-hero.mp4.asset.json";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kaslyn — Luxury Modeling Agency, Mumbai" },
      { name: "description", content: "Kaslyn curates women for editorial, runway, and luxury brand campaigns. Talent placement, brand marketing, and AI-driven discovery." },
      { property: "og:title", content: "Kaslyn — Luxury Modeling Agency" },
      { property: "og:description", content: "Editorial casting, brand campaigns and AI-driven talent discovery." },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

export function HomePage() {
  const featured = MODELS.slice(0, 3);
  const heroImages = [hero1, hero2, hero3];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % heroImages.length), 6000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="bg-cream text-midnight">
      <div className="relative">
        <SiteNav variant="dark" />
        <section className="relative h-screen min-h-[700px] w-full bg-midnight overflow-hidden">
          {heroImages.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              fetchPriority={i === 0 ? "high" : "low"}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out ${
                idx === i ? "opacity-80 animate-kenburns" : "opacity-0"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-midnight/75 via-midnight/35 to-midnight" />
          <div className="absolute inset-0 bg-gradient-to-r from-midnight/80 via-midnight/20 to-transparent" />
          <div className="relative z-10 h-full flex items-center px-6 md:px-20">
            <div className="max-w-4xl animate-fade-up">
              <p className="text-cream/85 text-[10px] uppercase tracking-[0.4em] mb-6">An Atelier of Presence — Hyderabad</p>
              <h1 className="font-serif text-cream text-5xl md:text-8xl lg:text-9xl leading-[0.95] italic drop-shadow-2xl">
                Refining the<br />
                <span className="not-italic text-terra-light">Art of Influence.</span>
              </h1>
              <div className="mt-12 flex flex-col md:flex-row md:items-end gap-8 max-w-2xl">
                <p className="text-cream text-sm md:text-base leading-relaxed tracking-wide max-w-md drop-shadow">
                  Kaslyn bridges exceptional talent with visionary brands. From editorial to runway, we craft campaigns that leave a lasting impression.
                <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                  <Link to="/Casting" className="px-8 py-4 bg-terra-bronze text-cream text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-cream hover:text-midnight transition-colors text-center">
                    Start Casting
                  </Link>
                  <Link to="/talent" className="px-8 py-4 border border-cream/60 text-cream text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-cream hover:text-midnight transition-colors text-center">
                    View Portfolio
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cream/60 text-[10px] uppercase tracking-[0.4em] flex flex-col items-center gap-2">
            <span>Scroll</span>
            <div className="w-px h-10 bg-cream/40" />
          </div>
        </section>
      </div>

      {/* Section 2: Atelier reel video + Data-Driven copy */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-cream">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="aspect-[4/5] w-full overflow-hidden bg-midnight">
            <video src={heroVideo.url} autoPlay muted loop playsInline className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="text-terra-mid font-bold uppercase tracking-[0.3em] text-[10px]">Modern Innovation</span>
            <h2 className="font-serif text-4xl md:text-6xl mt-4 mb-6 leading-[1.05]">
              Timeless Faces,<br />Endless possibilities.
            </h2>
            <p className="text-midnight/60 leading-loose max-w-md">
             We represent exceptional models and creative talent, connecting them with leading brands, fashion houses, and global campaigns. Every collaboration is built on elegance, professionalism, and lasting impact.</p>
            <Link to="/Casting" className="inline-block mt-10 text-[10px] uppercase tracking-[0.3em] font-bold text-terra-bronze border-b border-terra-bronze pb-1 hover:text-burgundy hover:border-burgundy transition-colors">
              Start Casting →
            </Link>
          </div>
        </div>
      </section>

      {/* Talent Matcher — clean white bg for maximum legibility */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-terra-bronze font-bold uppercase tracking-[0.3em] text-[10px]">Curated In Seconds</span>
            <h2 className="font-sans text-4xl md:text-6xl mt-4 text-midnight font-semibold tracking-tight">Find your face.</h2>
          </div>
          <AiMatcher variant="white" />
        </div>
      </section>

      {/* Philosophy / What we do — orange bg, BEFORE roster */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-cream">
        <div className="max-w-5xl mx-auto p-10 md:p-20 bg-terra-bronze text-cream">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-terra-light text-[10px] uppercase tracking-[0.3em] font-bold">Philosophy</span>
              <h2 className="font-serif text-4xl md:text-5xl mt-4 mb-6 italic leading-tight">
                The Premium Royal Standard.
              </h2>
              <p className="leading-relaxed opacity-90 max-w-md">
                We don't just provide talent; we craft the visual identity of luxury. From placement to social media management, Kaslyn is the bridge between vision and iconic reality.
              </p>
            </div>
            <div className="space-y-4 text-[10px] uppercase tracking-[0.25em] font-bold">
              {["Model Placement","Brand Marketing","Social Management","Video Production","Editorial Direction","Talent Discovery"].map((s) => (
                <div key={s} className="flex items-center gap-4">
                  <div className="w-10 h-px bg-cream/40" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-midnight py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16 border-b border-cream/10 pb-6">
            <div>
              <span className="text-terra-mid text-[10px] uppercase tracking-[0.3em] font-bold">The Roster</span>
              <h2 className="font-serif text-cream text-5xl md:text-6xl mt-3">The Faces.</h2>
            </div>
            <Link to="/talent" className="text-terra-light text-[10px] uppercase tracking-[0.25em] font-bold border-b border-terra-mid pb-1 hover:text-cream transition-colors">
              View All Models →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-10 md:gap-8">
            {featured.map((m, i) => (
              <div key={m.slug} className={`group cursor-pointer ${i === 1 ? "md:mt-24" : ""}`}>
                <div className="aspect-[3/4] overflow-hidden bg-cream/5 mb-5 relative">
                  <img src={m.image} alt={m.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]" />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif text-2xl italic text-terra-mid group-hover:text-terra-light transition-colors">{m.name}</h3>
                    <p className="text-cream/40 text-[10px] uppercase tracking-[0.25em] mt-1">{m.placement}</p>
                  </div>
                  <div className="text-cream/60 text-[10px] uppercase tracking-[0.18em] leading-relaxed font-light text-right">
                    HT {m.height}<br />
                    B {m.bust} · W {m.waist} · H {m.hips}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}