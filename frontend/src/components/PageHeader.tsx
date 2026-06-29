import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Aurora, GridBackground } from "@/components/ui/Backgrounds";
import { WordsReveal } from "@/components/ui/Reveal";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  crumbs = [],
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  crumbs?: { label: string; href?: string }[];
}) {
  return (
    <section className="relative overflow-hidden pb-12 pt-36">
      <GridBackground className="opacity-50" />
      <Aurora />
      <div className="container-px relative z-10">
        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1.5 text-sm text-steel-400"
        >
          <Link to="/" className="transition hover:text-white">
            Home
          </Link>
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 text-steel-600" />
              {c.href ? (
                <Link to={c.href} className="transition hover:text-white">
                  {c.label}
                </Link>
              ) : (
                <span className="text-white">{c.label}</span>
              )}
            </span>
          ))}
        </motion.nav>

        {eyebrow && (
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="eyebrow mt-6"
          >
            <span className="h-1 w-1 rounded-full bg-neo-500" />
            {eyebrow}
          </motion.span>
        )}

        <h1 className="mt-5 max-w-4xl font-display text-[clamp(2.2rem,5.5vw,4rem)] font-bold leading-[1.02] tracking-tight text-gradient">
          <WordsReveal text={title} />
        </h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-5 max-w-2xl text-base leading-relaxed text-steel-400 sm:text-lg"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
