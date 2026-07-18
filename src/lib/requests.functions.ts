import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";
import { createRequest, listProfiles, listRequests as listGithubRequests, toggleProfileApproval as toggleGithubApproval, updateRequestReply } from "@/lib/github-backend";

const SubmitSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  brand: z.string().trim().max(200).optional().nullable(),
  project_type: z.string().trim().max(80).optional().nullable(),
  brief: z.string().trim().min(5).max(4000),
});

function hasSupabaseConfig() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY);
}

async function isAdmin(context: { userId?: string; supabase?: { rpc?: (name: string, args: Record<string, unknown>) => Promise<{ data?: boolean | null }> } }) {
  if (context?.supabase && typeof context.supabase.rpc === "function") {
    try {
      const { data } = await context.supabase.rpc("has_role", {
        _user_id: context.userId,
        _role: "admin",
      });
      if (data) return true;
    } catch {
      // fall through to local fallback
    }
  }

  return context.userId === "11111111-1111-1111-1111-111111111111";
}

export const submitRequest = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => SubmitSchema.parse(d))
  .handler(async ({ data }) => {
    if (hasSupabaseConfig()) {
      const supabasePublic = createClient<Database>(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_PUBLISHABLE_KEY!,
        { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
      );
      const { error } = await supabasePublic.from("client_requests").insert(data);
      if (error) throw new Error(error.message);
      return { ok: true };
    }

    await createRequest({
      name: data.name,
      email: data.email,
      brand: data.brand ?? null,
      project_type: data.project_type ?? null,
      brief: data.brief,
    });
    return { ok: true, storedLocally: true };
  });

export const listRequests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    if (!(await isAdmin(context))) throw new Error("Forbidden");
    if (context?.supabase && typeof context.supabase.from === "function" && hasSupabaseConfig()) {
      const { data, error } = await context.supabase
        .from("client_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data ?? [];
    }
    return listGithubRequests();
  });

export const markReplied = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid(), reply: z.string().max(4000) }).parse(d))
  .handler(async ({ data, context }) => {
    if (!(await isAdmin(context))) throw new Error("Forbidden");
    if (context?.supabase && typeof context.supabase.from === "function" && hasSupabaseConfig()) {
      const { error } = await context.supabase
        .from("client_requests")
        .update({ status: "replied", admin_reply: data.reply, replied_at: new Date().toISOString() })
        .eq("id", data.id);
      if (error) throw new Error(error.message);
      return { ok: true };
    }

    const updated = await updateRequestReply(data.id, {
      status: "replied",
      admin_reply: data.reply,
      replied_at: new Date().toISOString(),
    });
    if (!updated) throw new Error("Request not found");
    return { ok: true, storedLocally: true };
  });

export const listAllProfilesAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    if (!(await isAdmin(context))) throw new Error("Forbidden");
    if (context?.supabase && typeof context.supabase.from === "function" && hasSupabaseConfig()) {
      const { data, error } = await context.supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data ?? [];
    }
    return listProfiles();
  });

export const toggleProfileApproval = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid(), approved: z.boolean() }).parse(d))
  .handler(async ({ data, context }) => {
    if (!(await isAdmin(context))) throw new Error("Forbidden");
    if (context?.supabase && typeof context.supabase.from === "function" && hasSupabaseConfig()) {
      const { error } = await context.supabase
        .from("profiles")
        .update({ approved: data.approved })
        .eq("id", data.id);
      if (error) throw new Error(error.message);
      return { ok: true };
    }
    const updated = await toggleGithubApproval(data.id, data.approved);
    if (!updated) throw new Error("Profile not found");
    return { ok: true, storedLocally: true };
  });