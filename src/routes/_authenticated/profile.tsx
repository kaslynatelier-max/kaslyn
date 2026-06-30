import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { supabase } from "@/integrations/supabase/client";
import { getMyProfile, updateMyProfile } from "@/lib/profiles.functions";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

type Profile = {
  full_name?: string | null; age?: number | null; phone?: string | null;
  height_cm?: number | null; skin_tone?: string | null; hair?: string | null;
  eyes?: string | null; city?: string | null; bio?: string | null;
  instagram?: string | null; avatar_url?: string | null; cover_url?: string | null;
  preferences?: Record<string, unknown> | null; is_public?: boolean;
  email?: string | null;
};

function ProfilePage() {
  const navigate = useNavigate();
  const fetchProfile = useServerFn(getMyProfile);
  const saveProfile = useServerFn(updateMyProfile);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile().then((res) => { setProfile(res.profile as Profile); setRoles(res.roles); });
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, [fetchProfile]);

  async function upload(file: File, bucket: "avatars" | "covers") {
    if (!userId) return null;
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${userId}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (error) { setMsg(error.message); return null; }
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  async function onAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    const url = await upload(file, "avatars");
    if (url) setProfile({ ...(profile ?? {}), avatar_url: url });
  }
  async function onCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    const url = await upload(file, "covers");
    if (url) setProfile({ ...(profile ?? {}), cover_url: url });
  }

  async function save() {
    if (!profile) return;
    setSaving(true); setMsg(null);
    try {
      await saveProfile({ data: {
        full_name: profile.full_name ?? null,
        age: profile.age ?? null,
        phone: profile.phone ?? null,
        height_cm: profile.height_cm ?? null,
        skin_tone: profile.skin_tone ?? null,
        hair: profile.hair ?? null,
        eyes: profile.eyes ?? null,
        city: profile.city ?? null,
        bio: profile.bio ?? null,
        instagram: profile.instagram ?? null,
        avatar_url: profile.avatar_url ?? null,
        cover_url: profile.cover_url ?? null,
        preferences: profile.preferences ?? {},
        is_public: !!profile.is_public,
      }});
      setMsg("Saved. Public roster updates after admin approval.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  if (!profile) return <div className="min-h-screen flex items-center justify-center bg-cream text-midnight"><p className="font-serif italic">Loading profile…</p></div>;

  const isAdmin = roles.includes("admin");

  return (
    <div className="min-h-screen bg-cream text-midnight">
      <SiteNav />

      <div className="relative h-64 md:h-80 bg-midnight overflow-hidden">
        {profile.cover_url && <img src={profile.cover_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-70" />}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cream" />
        <label className="absolute top-4 right-4 cursor-pointer px-4 py-2 bg-cream/90 text-midnight text-[10px] uppercase tracking-[0.25em] font-bold">
          <input type="file" accept="image/*" className="hidden" onChange={onCover} />
          Change cover
        </label>
      </div>

      <section className="px-6 md:px-12 -mt-20 relative z-10 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-cream bg-terra-light">
              {profile.avatar_url && <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />}
            </div>
            <label className="block mt-3 text-center cursor-pointer text-[10px] uppercase tracking-[0.25em] font-bold text-terra-bronze underline">
              <input type="file" accept="image/*" className="hidden" onChange={onAvatar} />
              Upload photo
            </label>
          </div>

          <div className="flex-1 pt-4">
            <h1 className="font-serif text-4xl md:text-5xl italic">{profile.full_name || "Your name"}</h1>
            <p className="text-foreground/60 text-sm mt-2">{profile.email}</p>
            <div className="flex flex-wrap gap-2 mt-3 text-[10px] uppercase tracking-[0.25em] font-bold">
              {roles.map((r) => <span key={r} className="px-3 py-1 bg-terra-light text-midnight">{r}</span>)}
              {profile.is_public && <span className="px-3 py-1 bg-terra-bronze text-cream">Public roster</span>}
            </div>
            {isAdmin && (
              <a href="/admin" className="inline-block mt-4 px-4 py-2 bg-burgundy text-cream text-[10px] uppercase tracking-[0.25em] font-bold">Open Admin →</a>
            )}
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Field label="Full name" value={profile.full_name} onChange={(v) => setProfile({ ...profile, full_name: v })} />
          <Field label="City" value={profile.city} onChange={(v) => setProfile({ ...profile, city: v })} />
          <Field label="Phone" value={profile.phone} onChange={(v) => setProfile({ ...profile, phone: v })} />
          <Field label="Instagram" value={profile.instagram} onChange={(v) => setProfile({ ...profile, instagram: v })} />
          <NumField label="Age" value={profile.age} onChange={(v) => setProfile({ ...profile, age: v })} />
          <NumField label="Height (cm)" value={profile.height_cm} onChange={(v) => setProfile({ ...profile, height_cm: v })} />
          <Field label="Skin tone" value={profile.skin_tone} onChange={(v) => setProfile({ ...profile, skin_tone: v })} />
          <Field label="Hair" value={profile.hair} onChange={(v) => setProfile({ ...profile, hair: v })} />
          <Field label="Eyes" value={profile.eyes} onChange={(v) => setProfile({ ...profile, eyes: v })} />
        </div>

        <div className="mt-6">
          <label className="text-[10px] uppercase tracking-[0.25em] font-bold text-terra-bronze block mb-2">Bio</label>
          <textarea value={profile.bio ?? ""} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} rows={4} className="w-full bg-cream border border-midnight/15 p-3 focus:outline-none focus:border-terra-bronze" />
        </div>

        <label className="flex items-center gap-3 mt-6 cursor-pointer">
          <input type="checkbox" checked={!!profile.is_public} onChange={(e) => setProfile({ ...profile, is_public: e.target.checked })} />
          <span className="text-sm">Display me on the public roster (pending admin approval)</span>
        </label>

        <div className="mt-10 flex flex-wrap gap-3 items-center pb-20">
          <button onClick={save} disabled={saving} className="px-8 py-4 bg-midnight text-cream text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-terra-bronze transition-colors disabled:opacity-50">
            {saving ? "Saving…" : "Save profile"}
          </button>
          <button onClick={logout} className="px-8 py-4 border border-midnight/30 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-midnight hover:text-cream">
            Sign out
          </button>
          {msg && <p className="text-sm text-terra-bronze">{msg}</p>}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value?: string | null; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.25em] font-bold text-terra-bronze block mb-2">{label}</label>
      <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="w-full bg-cream border border-midnight/15 p-3 focus:outline-none focus:border-terra-bronze" />
    </div>
  );
}
function NumField({ label, value, onChange }: { label: string; value?: number | null; onChange: (v: number | null) => void }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.25em] font-bold text-terra-bronze block mb-2">{label}</label>
      <input type="number" value={value ?? ""} onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))} className="w-full bg-cream border border-midnight/15 p-3 focus:outline-none focus:border-terra-bronze" />
    </div>
  );
}