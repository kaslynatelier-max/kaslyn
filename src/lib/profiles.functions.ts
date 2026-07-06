import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

const ProfileSchema = z.object({
  full_name: z.string().max(120).optional().nullable(),
  age: z.number().int().min(13).max(99).optional().nullable(),
  phone: z.string().max(40).optional().nullable(),
  height_cm: z.number().int().min(120).max(220).optional().nullable(),
  skin_tone: z.string().max(40).optional().nullable(),
  hair: z.string().max(40).optional().nullable(),
  eyes: z.string().max(40).optional().nullable(),
  city: z.string().max(80).optional().nullable(),
  bio: z.string().max(1000).optional().nullable(),
  instagram: z.string().max(80).optional().nullable(),
  avatar_url: z.string().url().max(500).optional().nullable(),
  cover_url: z.string().url().max(500).optional().nullable(),
  preferences: z.record(z.string(), z.any()).optional().nullable(),
  is_public: z.boolean().optional(),
});

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("profiles")
      .select("*")
      .eq("id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    const { data: roles } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    return { profile: data, roles: (roles ?? []).map((r) => r.role) };
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => ProfileSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("profiles")
      .update(data)
      .eq("id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listPublicProfiles = createServerFn({ method: "GET" }).handler(async () => {
  const supabasePublic = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
  const { data, error } = await supabasePublic
    .from("public_roster_profiles")
    .select("id, roster_code, city, avatar_url, cover_url")
    .order("created_at", { ascending: false })
    .limit(60);
  if (error) throw new Error(error.message);
  return data ?? [];
});