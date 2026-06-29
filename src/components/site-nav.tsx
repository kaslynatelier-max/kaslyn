import { Link } from "@tanstack/react-router";
import logo from "@/assets/kaslyn-logo.png.asset.json";

const links = [
  { to: "/talent", label: "Talent" },
  { to: "/services", label: "Services" },
  { to: "/ai-discovery", label: "AI Discovery" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteNav({ variant = "light" }: { variant?: "light" | "dark" }) {
  const isDark = variant === "dark";
  return (
    <nav
      className={
        isDark
          ? "absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6 text-cream"
          : "sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 bg-cream/85 backdrop-blur-md border-b border-midnight/5"
      }
    >
      <Link to="/" className="flex items-center gap-3 group">
        <img src={logo.url} alt="Kaslyn Atelier" className="h-9 w-9 object-contain" />
        <span className="font-serif text-xl tracking-tight font-bold">
          KASLYN <span className="text-terra-mid">ATELIER</span>
        </span>
      </Link>
      <div className="hidden md:flex items-center gap-10 text-[10px] uppercase tracking-[0.25em] font-semibold">
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
      <Link
        to="/contact"
        className={
          isDark
            ? "hidden sm:inline-flex px-5 py-2.5 bg-cream text-midnight text-[10px] uppercase tracking-[0.25em] font-bold hover:bg-terra-mid hover:text-cream transition-colors"
            : "hidden sm:inline-flex px-5 py-2.5 bg-midnight text-cream text-[10px] uppercase tracking-[0.25em] font-bold hover:bg-terra-mid transition-colors"
        }
      >
        Book Talent
      </Link>
    </nav>
  );
}