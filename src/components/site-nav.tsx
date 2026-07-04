import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, User } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { supabase } from "@/integrations/supabase/client";

const links = [
  { to: "/talent", label: "Talent" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/Casting", label: "CASTING" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteNav({ variant = "light" }: { variant?: "light" | "dark" }) {
  const isDark = variant === "dark";
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSignedIn(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const wordmark = (
    <Link to="/" className="font-serif text-xl md:text-2xl tracking-[0.25em] font-bold">
      KASLYN
    </Link>
  );

  return (
    <>
      <nav
        className={
          isDark
            ? "absolute top-0 left-0 right-0 z-50 grid grid-cols-[1fr_auto_1fr] md:flex md:items-center md:justify-between items-center px-6 md:px-12 py-5 md:py-6 text-cream"
            : "sticky top-0 z-50 grid grid-cols-[1fr_auto_1fr] md:flex md:items-center md:justify-between items-center px-6 md:px-12 py-4 md:py-5 bg-cream/90 backdrop-blur-md border-b border-midnight/5"
        }
      >
        {/* Mobile: hamburger left, wordmark center, account right */}
        <button
          className="md:hidden justify-self-start"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <div className="md:hidden justify-self-center">{wordmark}</div>
        <div className="md:hidden justify-self-end flex items-center gap-1">
          <ThemeToggle />
          <Link
            to={signedIn ? "/profile" : "/auth"}
            aria-label={signedIn ? "Profile" : "Sign in"}
          >
            <User size={20} />
          </Link>
        </div>

        {/* Desktop: wordmark left */}
        <div className="hidden md:flex items-center">{wordmark}</div>
        <div className="hidden md:flex items-center gap-8 text-[10px] uppercase tracking-[0.25em] font-semibold">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="hover:text-terra-mid transition-colors"
              activeProps={{ className: "text-terra-mid" }}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Link
            to={signedIn ? "/profile" : "/auth"}
            className="text-[10px] uppercase tracking-[0.25em] font-semibold hover:text-terra-mid"
          >
            {signedIn ? "Profile" : "Sign in"}
          </Link>
          <Link
            to="/contact"
            className={
              isDark
                ? "px-5 py-2.5 bg-cream text-midnight text-[10px] uppercase tracking-[0.25em] font-bold hover:bg-terra-mid hover:text-cream transition-colors"
                : "px-5 py-2.5 bg-midnight text-cream text-[10px] uppercase tracking-[0.25em] font-bold hover:bg-terra-mid transition-colors"
            }
          >
            Book Talent
          </Link>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-[100] bg-midnight text-cream flex flex-col p-8 animate-fade-up">
          <div className="flex justify-between items-center mb-16">
            <span className="font-serif text-2xl tracking-[0.25em] font-bold">KASLYN</span>
            <button onClick={() => setOpen(false)} aria-label="Close menu"><X size={24} /></button>
          </div>
          <div className="flex flex-col gap-7">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="font-serif text-4xl italic hover:text-terra-mid transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to={signedIn ? "/profile" : "/auth"}
              onClick={() => setOpen(false)}
              className="font-serif text-4xl italic hover:text-terra-mid transition-colors"
            >
              {signedIn ? "My Profile" : "Sign in"}
            </Link>
          </div>
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="mt-auto py-4 bg-terra-bronze text-cream text-[10px] uppercase tracking-[0.3em] font-bold text-center"
          >
            Book Talent
          </Link>
        </div>
      )}
    </>
  );
}