import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { matchModels } from "@/lib/ai-match.functions";
import { MODELS, getModel } from "@/lib/models";

const MOODS = ["High Fashion", "Minimalist", "Streetwear", "Couture", "Beauty", "Bridal", "Editorial", "Commercial"];

interface MatchResult {
  summary: string;
  matches: { slug: string; score: number; reasoning: string }[];
}

export function AiMatcher({ variant = "light" }: { variant?: "light" | "dark" | "terra" | "white" }) {
  const fn = useServerFn(matchModels);
  const [brief, setBrief] = useState("");
  const [mood, setMood] = useState<string[]>(["High Fashion"]);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleMood = (m: string) =>
    setMood((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (brief.trim().length < 10) {
      setError("Tell us a little more about your campaign — 10 characters minimum.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const data = await fn({ data: { brief: brief.trim(), mood } });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const isDark = variant === "dark";
  const isTerra = variant === "terra";
  const isWhite = variant === "white";
  const panelBase = isDark
    ? "bg-midnight/60 border border-cream/10 text-cream"
    : isTerra
      ? "bg-terra-mid border border-terra-bronze/30 text-cream"
      : isWhite
        ? "bg-white border border-midnight/15 text-midnight shadow-[0_20px_60px_-30px_rgba(0,0,0,0.25)]"
        : "bg-terra-light/30 border border-terra-mid/15 text-midnight";
  const inputBase = isDark
    ? "bg-midnight border border-cream/15 text-cream placeholder:text-cream/40 focus:border-terra-mid"
    : isTerra
      ? "bg-cream border border-midnight/10 text-midnight placeholder:text-midnight/50 focus:border-midnight"
      : isWhite
        ? "bg-cream border border-midnight/20 text-midnight placeholder:text-midnight/50 focus:border-midnight"
        : "bg-cream border border-midnight/10 text-midnight placeholder:text-midnight/50 focus:border-terra-mid";

  return (
    <div className={`p-8 md:p-10 ${panelBase}`}>
      <div className="flex items-center gap-3 mb-8">
        <span className="w-2 h-2 rounded-full bg-burgundy animate-pulse" />
        <h3 className="font-sans text-lg md:text-xl font-semibold tracking-[0.2em] uppercase">Talent Matcher</h3>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label className="text-[10px] uppercase tracking-[0.25em] font-bold text-terra-bronze block mb-3">
            Campaign Brief
          </label>
          <textarea
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            placeholder="A 30-second silk-draped fragrance film, golden hour, Mumbai rooftop, one model — warm, romantic, untouchable."
            rows={4}
            className={`w-full p-4 text-sm font-sans focus:outline-none transition-colors resize-none ${inputBase}`}
          />
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-[0.25em] font-bold text-terra-bronze block mb-3">
            Mood
          </label>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => {
              const active = mood.includes(m);
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => toggleMood(m)}
                  className={`px-4 py-2 text-[10px] uppercase tracking-[0.2em] border transition-colors ${
                    active
                      ? "bg-terra-bronze text-cream border-terra-bronze"
                      : isDark
                        ? "border-cream/20 text-cream/70 hover:border-cream"
                        : "border-midnight/15 text-midnight/70 hover:border-midnight"
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-midnight text-cream text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-terra-bronze transition-colors disabled:opacity-50"
        >
          {loading ? "Curating your selection…" : "Generate Selection"}
        </button>

        {error && (
          <p className="text-[11px] uppercase tracking-[0.2em] text-burgundy">{error}</p>
        )}
      </form>

      {result && (
        <div className="mt-10 pt-8 border-t border-current/10 animate-fade-up">
          <p className="font-sans text-base md:text-lg mb-6 leading-relaxed font-medium">
            “{result.summary}”
          </p>
          <div className="grid sm:grid-cols-3 gap-5">
            {result.matches.map((m) => {
              const model = getModel(m.slug) ?? MODELS[0];
              return (
                <div key={m.slug} className="space-y-3">
                  <div className="aspect-[3/4] overflow-hidden bg-midnight relative">
                    <img src={model.image} alt={model.code} loading="lazy" className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-cream/95 text-midnight text-[10px] font-bold px-2 py-1 tracking-[0.2em]">
                      {model.code}
                    </div>
                    <div className="absolute top-3 right-3 bg-terra-bronze text-cream text-[10px] font-bold px-2 py-1 tracking-widest">
                      {Math.round(m.score)}%
                    </div>
                  </div>
                  <div>
                    <h4 className="font-sans text-base font-bold tracking-[0.2em] uppercase text-terra-bronze">{model.code}</h4>
                    <p className="text-[10px] uppercase tracking-[0.2em] mt-1 opacity-80">{model.city}</p>
                    <p className="text-xs leading-relaxed mt-2">{m.reasoning}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}