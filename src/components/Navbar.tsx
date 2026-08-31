import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const links = [
  { label: "Destinations", href: "#destinations" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Intelligence", href: "#intelligence" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-colors duration-300 ${scrolled ? "border-b border-line bg-canvas/90 backdrop-blur" : "border-b border-transparent bg-transparent"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <Link to="/" className="group font-display text-lg tracking-wide text-ink transition-opacity duration-300 hover:opacity-80">
          SAVEI<span className="text-accent-green">TRIP</span>
        </Link>
        <nav className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="group relative text-sm text-ink-soft transition-colors duration-300 hover:text-ink">
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent-green transition-all duration-500 group-hover:w-full" />
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-5 md:flex">
          <Link to="/login" className="text-sm text-ink-soft transition-colors duration-300 hover:text-ink">Log in</Link>
          <Link to="/login" className="rounded-sm bg-ink px-5 py-2.5 text-sm text-canvas transition-all duration-500 hover:-translate-y-0.5 hover:opacity-90 active:scale-[0.97]">Get Started</Link>
        </div>
        <button aria-label="Toggle menu" className="flex h-9 w-9 items-center justify-center transition-transform duration-300 active:scale-90 md:hidden" onClick={() => setOpen((v) => !v)}>
          <span className="relative block h-4 w-5">
            <span className={`absolute left-0 top-0 h-px w-5 bg-ink transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`absolute left-0 top-2 h-px w-5 bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`absolute left-0 top-4 h-px w-5 bg-ink transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </span>
        </button>
      </div>
      {open && (
        <div className="border-t border-line bg-canvas px-6 pb-6 md:hidden">
          <nav className="flex flex-col gap-4 pt-4">
            {links.map((l) => <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm text-ink-soft transition-colors duration-300 hover:text-ink">{l.label}</a>)}
            <Link to="/login" onClick={() => setOpen(false)} className="text-sm text-ink-soft hover:text-ink">Log in</Link>
            <Link to="/login" onClick={() => setOpen(false)} className="rounded-sm bg-ink px-5 py-2.5 text-center text-sm text-canvas transition-all duration-500 active:scale-[0.97]">Get Started</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
