import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="bg-midnight text-cream pt-20 pb-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-16">
        <div className="md:col-span-2 space-y-6">
          <div className="font-serif text-3xl tracking-[0.25em] font-bold">KASLYN</div>
          <p className="text-sm text-cream/60 max-w-sm leading-relaxed">
            A luxury modeling atelier. Editorial casting, brand campaigns, runway, and AI-driven talent discovery — for houses that demand presence.
          </p>
        </div>
        <div className="space-y-4">
          <h5 className="text-[10px] uppercase tracking-[0.25em] font-bold text-terra-light">Atelier</h5>
          <ul className="space-y-2 text-sm text-cream/60">
            <li><Link to="/talent" className="hover:text-cream">Talent</Link></li>
            <li><Link to="/services" className="hover:text-cream">Services</Link></li>
            <li><Link to="/portfolio" className="hover:text-cream">Portfolio</Link></li>
            <li><Link to="/ai-discovery" className="hover:text-cream">Discovery</Link></li>
            <li><Link to="/contact" className="hover:text-cream">Bookings</Link></li>
            <li><Link to="/auth" className="hover:text-cream">Sign In</Link></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h5 className="text-[10px] uppercase tracking-[0.25em] font-bold text-terra-light">Studios</h5>
          <p className="text-sm text-cream/60 leading-relaxed">
            Mumbai · Milan · Paris<br />
            booking@kaslynatelier.co.in<br />
            +91 (0) 22 4000 7700
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-8 border-t border-cream/10 flex flex-col md:flex-row justify-between gap-4 text-[10px] uppercase tracking-[0.25em] text-cream/40">
        <p>© {new Date().getFullYear()} Kaslyn Atelier. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="https://instagram.com" className="hover:text-cream">Instagram</a>
          <a href="#" className="hover:text-cream">Vimeo</a>
          <a href="#" className="hover:text-cream">Privacy</a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-6 text-center text-[10px] uppercase tracking-[0.3em] text-cream/50">
        Developed by{" "}
        <a
          href="https://www.FranckMbogne.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-terra-mid hover:text-cream underline underline-offset-4"
        >
          Engineer Franck MBOGNE
        </a>
      </div>
    </footer>
  );
}