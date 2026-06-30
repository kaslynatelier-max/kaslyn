import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — Kaslyn" },
      { name: "description", content: "Sign in or create your Kaslyn account — manage your model profile, portfolio, and bookings." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/profile" });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/profile`,
            data: { full_name: name || email.split("@")[0] },
          },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: email.toLowerCase() === "kaslyn@admin.com" ? "/admin" : "/profile" });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  async function google() {
    setErr(null);
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (res.error) setErr(res.error.message || "Google sign-in failed");
    else if (!res.redirected) navigate({ to: "/profile" });
  }

  return (
    <div className="min-h-screen bg-cream text-midnight flex flex-col">
      <SiteNav />
      <section className="flex-1 px-6 md:px-12 py-20">
        <div className="max-w-md mx-auto">
          <span className="text-terra-bronze text-[10px] uppercase tracking-[0.3em] font-bold">Atelier · Members</span>
          <h1 className="font-serif text-5xl md:text-6xl mt-3 italic leading-[0.95]">
            {mode === "signup" ? "Create account." : "Welcome back."}
          </h1>
          <p className="mt-4 text-foreground/60 text-sm leading-relaxed">
            {mode === "signup"
              ? "Build your model profile, upload your portfolio, and apply for the public roster."
              : "Sign in to manage your profile and roster status."}
          </p>

          <button
            onClick={google}
            className="mt-10 w-full py-4 border border-midnight text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-midnight hover:text-cream transition-colors"
          >
            Continue with Google
          </button>
          <div className="my-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-foreground/40">
            <div className="flex-1 h-px bg-midnight/15" /> or <div className="flex-1 h-px bg-midnight/15" />
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full bg-transparent border-b border-midnight/20 py-3 focus:outline-none focus:border-terra-bronze" />
            )}
            <input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full bg-transparent border-b border-midnight/20 py-3 focus:outline-none focus:border-terra-bronze" />
            <input required type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full bg-transparent border-b border-midnight/20 py-3 focus:outline-none focus:border-terra-bronze" />
            {err && <p className="text-burgundy text-xs">{err}</p>}
            <button disabled={loading} type="submit" className="w-full py-4 mt-4 bg-midnight text-cream text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-terra-bronze transition-colors disabled:opacity-50">
              {loading ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
            </button>
          </form>

          <p className="mt-8 text-xs text-foreground/60 text-center">
            {mode === "signup" ? "Already a member?" : "New to Kaslyn?"}{" "}
            <button onClick={() => setMode(mode === "signup" ? "signin" : "signup")} className="underline text-terra-bronze">
              {mode === "signup" ? "Sign in" : "Create an account"}
            </button>
          </p>
          <p className="mt-4 text-xs text-foreground/40 text-center">
            <Link to="/" className="hover:text-midnight">← Back to home</Link>
          </p>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}