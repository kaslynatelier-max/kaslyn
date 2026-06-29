import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { MODELS } from "./models";

const MatchInput = z.object({
  brief: z.string().min(10).max(2000),
  mood: z.array(z.string()).max(8).default([]),
});

const MatchOutput = z.object({
  summary: z.string().describe("One luxurious editorial sentence describing the casting direction."),
  matches: z
    .array(
      z.object({
        slug: z.string().describe("Slug of one of the roster models."),
        score: z.number().min(0).max(100).describe("Match score 0-100."),
        reasoning: z.string().describe("One short sentence on why this model fits the brief."),
      }),
    )
    .min(1)
    .max(4),
});

export const matchModels = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => MatchInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(key);

    const roster = MODELS.map((m) => ({
      slug: m.slug,
      name: m.name,
      city: m.city,
      placement: m.placement,
      tags: m.tags,
      bio: m.bio,
    }));

    const system = `You are the Head of Casting at Kaslyn Atelier — a luxury, editorial modeling agency. Match the client's creative brief to the most fitting 3 models from the roster. Score honestly. Tone: confident, refined, editorial — never salesy. Use only slugs that appear in the roster.`;

    const prompt = `Brief:\n${data.brief}\n\nMood tags: ${data.mood.join(", ") || "(none)"}\n\nRoster (JSON):\n${JSON.stringify(roster, null, 2)}`;

    try {
      const { output } = await generateText({
        model: gateway("google/gemini-3-flash-preview"),
        system,
        prompt,
        output: Output.object({ schema: MatchOutput }),
      });

      const valid = output.matches
        .filter((m: { slug: string }) => MODELS.some((r) => r.slug === m.slug))
        .slice(0, 3);

      return {
        summary: output.summary,
        matches: valid.length > 0 ? valid : fallbackMatches(),
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "AI gateway error";
      const status = (err as { statusCode?: number })?.statusCode;
      if (status === 429) throw new Error("AI rate limit reached. Please try again in a moment.");
      if (status === 402) throw new Error("AI credits exhausted. Please add credits to continue using the matcher.");
      throw new Error(message);
    }
  });

function fallbackMatches() {
  return MODELS.slice(0, 3).map((m, i) => ({
    slug: m.slug,
    score: 90 - i * 5,
    reasoning: "Curator's pick from the house roster.",
  }));
}