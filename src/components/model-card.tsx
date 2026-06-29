import type { Model } from "@/lib/models";

export function ModelCard({ model, offset = false }: { model: Model; offset?: boolean }) {
  return (
    <div className={`group cursor-pointer ${offset ? "md:mt-16" : ""}`}>
      <div className="aspect-[3/4] overflow-hidden bg-midnight mb-5 relative">
        <img
          src={model.image}
          alt={model.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <p className="text-[10px] uppercase tracking-[0.25em] text-cream/80">{model.placement}</p>
        </div>
      </div>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-serif text-2xl italic text-terra-bronze group-hover:text-terra-mid transition-colors">
            {model.name}
          </h3>
          <p className="text-[10px] uppercase tracking-[0.25em] text-foreground/50 mt-1">{model.city}</p>
        </div>
        <div className="text-right text-[10px] uppercase tracking-[0.18em] text-foreground/60 leading-relaxed font-light">
          HT {model.height}<br />
          B {model.bust} · W {model.waist} · H {model.hips}
        </div>
      </div>
    </div>
  );
}