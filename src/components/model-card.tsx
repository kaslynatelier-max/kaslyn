import type { Model } from "@/lib/models";

export function ModelCard({ model, offset = false }: { model: Model; offset?: boolean }) {
  return (
    <div className={`group cursor-pointer ${offset ? "md:mt-16" : ""}`}>
      <div className="aspect-[3/4] overflow-hidden bg-midnight mb-5 relative">
        <img
          src={model.image}
          alt={model.code}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute top-3 left-3 bg-cream/95 text-midnight px-2.5 py-1 text-[10px] font-bold tracking-[0.2em]">
          {model.code}
        </div>
      </div>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-serif text-2xl italic text-terra-bronze group-hover:text-terra-mid transition-colors">
            {model.code}
          </h3>
          <p className="text-[10px] uppercase tracking-[0.25em] text-foreground/50 mt-1">{model.city}</p>
        </div>
      </div>
    </div>
  );
}