import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";
import { getProfileById, listPublicProfiles as listPublicProfilesGithub, listUserRoles, updateProfile } from "@/lib/github-backend";

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

function hasSupabaseConfig() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY);
}

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    if (context?.supabase && typeof context.supabase.from === "function" && hasSupabaseConfig()) {
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
    }

    const profile = await getProfileById(context.userId);
    const roles = await listUserRoles(context.userId);
    return { profile, roles };
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => ProfileSchema.parse(d))
  .handler(async ({ data, context }) => {
    if (context?.supabase && typeof context.supabase.from === "function" && hasSupabaseConfig()) {
      const { error } = await context.supabase
        .from("profiles")
        .update(data)
        .eq("id", context.userId);
      if (error) throw new Error(error.message);
      return { ok: true };
    }

    const updated = await updateProfile(context.userId, data);
    if (!updated) throw new Error("Profile not found");
    return { ok: true, storedLocally: true };
  });

export const listPublicProfiles = createServerFn({ method: "GET" }).handler(async () => {
  if (hasSupabaseConfig()) {
    const supabasePublic = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
    );
    const { data, error } = await supabasePublic
      .from("public_roster_profiles")
      .select("id, roster_code, city, avatar_url, cover_url")
      .limit(60);
    if (error) throw new Error(error.message);
    return (data ?? [])
      .filter((r): r is { id: string; roster_code: string | null; city: string | null; avatar_url: string | null; cover_url: string | null } => r.id != null);
  }

  const rows = await listPublicProfilesGithub();
  return rows
    .filter((row) => row.id != null)
    .map((row) => ({
      id: row.id,
      roster_code: row.roster_code ?? null,
      city: row.city ?? null,
      avatar_url: row.avatar_url ?? null,
      cover_url: row.cover_url ?? null,
    }));
});