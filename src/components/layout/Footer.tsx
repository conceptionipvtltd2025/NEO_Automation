import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Linkedin,
  Instagram,
  Youtube,
  ArrowUpRight,
  ArrowUp,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { site, navItems } from "@/data/site";
import { categories } from "@/data/categories";
import { getLenis } from "@/components/providers/SmoothScroll";

const social = [
  { icon: Linkedin, href: site.social.linkedin, label: "LinkedIn" },
  { icon: Instagram, href: site.social.instagram, label: "Instagram" },
  { icon: Youtube, href: site.social.youtube, label: "YouTube" },
];

export function Footer() {
  const toTop = () => {
    const l = getLenis();
    if (l) l.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-white/10 bg-ink-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neo-600/60 to-transparent" />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 left-1/2 -z-0 -translate-x-1/2 select-none text-center font-display text-[20vw] font-bold leading-none text-white/[0.02]"
      >
        NEO
      </div>

      <div className="container-px relative z-10 pt-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-steel-400">
              {site.description}
            </p>
            <div className="mt-6 flex gap-3">
              {social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-steel-300 transition hover:border-neo-600/50 hover:text-white"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-steel-500">
              Navigate
            </h4>
            <ul className="mt-5 space-y-3">
              {navItems.map((n) => (
                <li key={n.href}>
                  <Link
                    to={n.href}
                    className="group inline-flex items-center gap-1 text-sm text-steel-300 transition hover:text-white"
                  >
                    {n.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-steel-500">
              Solutions
            </h4>
            <ul className="mt-5 space-y-3">
              {categories.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/products?category=${c.id}`}
                    className="text-sm text-steel-300 transition hover:text-white"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-steel-500">
              Get in touch
            </h4>
            <ul className="mt-5 space-y-4 text-sm text-steel-300">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-neo-500" />
                <span>
                  {site.address.line1}
                  <br />
                  {site.address.line2}
                </span>
              </li>
              <li>
                <a href={`tel:${site.phone}`} className="flex items-center gap-3 transition hover:text-white">
                  <Phone className="h-4 w-4 shrink-0 text-neo-500" />
                  {site.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="flex items-center gap-3 transition hover:text-white">
                  <Mail className="h-4 w-4 shrink-0 text-neo-500" />
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 py-7 sm:flex-row">
          <p className="text-xs text-steel-500">
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-steel-500">
            <Link to="/terms" className="transition hover:text-white">
              Terms &amp; Conditions
            </Link>
            <Link to="/privacy" className="transition hover:text-white">
              Privacy Policy
            </Link>
            <button
              onClick={toTop}
              className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 transition hover:border-neo-600/50 hover:text-white"
            >
              Back to top <ArrowUp className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
