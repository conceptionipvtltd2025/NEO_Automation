import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import type { NavItem, NavColumn, NavFeatured, NavTile } from "@/data/site";
import { cn } from "@/lib/utils";

// The animated Desoutter-style dropdown panel that drops beneath a nav item.
// Two layouts: text columns + a featured promo card (Products/Service/Company),
// or a grid of photo tiles (Industries). The panel is theme-aware — it inherits
// the active light/dark tokens rather than being pinned dark. Desktop only; the
// mobile drawer renders an accordion.

const panel: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.26,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.045,
      delayChildren: 0.04,
    },
  },
  exit: { opacity: 0, y: 8, scale: 0.985, transition: { duration: 0.16, ease: [0.4, 0, 1, 1] } },
};

const cell: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

function FeaturedCard({
  featured,
  onNavigate,
}: {
  featured: NavFeatured;
  onNavigate: () => void;
}) {
  const hasImage = !!featured.bgImage;
  return (
    <Link
      to={featured.href}
      onClick={onNavigate}
      className={cn(
        "group relative flex h-full min-h-[15rem] flex-col justify-between overflow-hidden rounded-2xl border border-white/10 p-6 shine-sweep",
        hasImage ? "force-dark" : "bg-ink-850/80"
      )}
    >
      {hasImage ? (
        <>
          <img
            src={featured.bgImage}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          {/* Dark at the top (eyebrow/title) and bottom (CTA), image visible mid. */}
          <div aria-hidden className="absolute inset-0 bg-ink-950/35" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-ink-950/60" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-neo-600/25 via-transparent to-transparent" />
        </>
      ) : (
        <>
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-aurora-soft opacity-60" />
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-neo-600/20 blur-3xl" />
        </>
      )}
      <div className="relative">
        {featured.eyebrow && <span className="eyebrow">{featured.eyebrow}</span>}
        <h4 className="mt-4 font-display text-lg font-bold leading-tight text-white">
          {featured.title}
        </h4>
        <p className="mt-2 text-[12.5px] leading-relaxed text-steel-300">{featured.blurb}</p>
      </div>
      <span className="relative mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-neo-400 transition group-hover:text-neo-300">
        {featured.cta}
        <ArrowRight className="h-4 w-4 transition duration-200 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

function ColumnsLayout({
  columns,
  featured,
  onNavigate,
}: {
  columns: NavColumn[];
  featured: NavFeatured;
  onNavigate: () => void;
}) {
  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <div className="grid flex-1 gap-x-8 gap-y-7 sm:grid-cols-3">
        {columns.map((col) => (
          <motion.div key={col.heading} variants={cell}>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-steel-500">
              {col.heading}
            </h3>
            <ul className="mt-4 space-y-0.5">
              {col.links.map((l) => (
                <li key={l.label + l.href}>
                  <Link
                    to={l.href}
                    onClick={onNavigate}
                    className="group/link -mx-3 block rounded-xl px-3 py-2 transition hover:bg-white/[0.05]"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="text-[13.5px] font-medium text-white transition-colors group-hover/link:text-neo-300">
                        {l.label}
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 -translate-x-1 text-steel-600 opacity-0 transition duration-200 group-hover/link:translate-x-0 group-hover/link:text-neo-400 group-hover/link:opacity-100" />
                    </span>
                    {l.desc && (
                      <span className="mt-0.5 block text-[11.5px] leading-snug text-steel-500">
                        {l.desc}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <motion.div variants={cell} className="shrink-0 lg:w-72">
        <FeaturedCard featured={featured} onNavigate={onNavigate} />
      </motion.div>
    </div>
  );
}

function TilesLayout({
  tiles,
  advice,
  onNavigate,
}: {
  tiles: NavTile[];
  advice: { label: string; href: string }[];
  onNavigate: () => void;
}) {
  // Cap at 8 tiles and pick a column count that keeps every row balanced, so the
  // panel stays tidy no matter how many industries the admin adds.
  const shown = tiles.slice(0, 8);
  const n = shown.length;
  const cols =
    n <= 2
      ? "sm:grid-cols-2"
      : n === 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : n > 6
      ? "sm:grid-cols-3 lg:grid-cols-4"
      : "sm:grid-cols-3";

  return (
    <div>
      <motion.div variants={cell} className="mb-5 flex items-center justify-between">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-steel-500">
          Industries we power
        </h3>
        <Link
          to="/industries"
          onClick={onNavigate}
          className="inline-flex items-center gap-1 text-xs font-medium text-neo-400 transition hover:text-neo-300"
        >
          View all industries
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </motion.div>

      <div className={cn("grid grid-cols-2 gap-3", cols)}>
        {shown.map((t) => (
          <motion.div key={t.href} variants={cell}>
            <Link
              to={t.href}
              onClick={onNavigate}
              className="force-dark group relative block aspect-[16/10] overflow-hidden rounded-2xl border border-white/10"
            >
              <img
                src={t.image}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3">
                <p className="text-sm font-semibold text-pure">{t.label}</p>
                {t.desc && <p className="mt-0.5 text-[11px] text-pure/70">{t.desc}</p>}
              </div>
              <span className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-ink-950/50 text-pure opacity-0 backdrop-blur transition group-hover:opacity-100">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      {advice.length > 0 && (
        <motion.div
          variants={cell}
          className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-4"
        >
          {advice.map((l) => (
            <Link
              key={l.href + l.label}
              to={l.href}
              onClick={onNavigate}
              className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-steel-300 transition hover:border-neo-600/40 hover:text-white"
            >
              {l.label}
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export function MegaMenu({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate: () => void;
}) {
  if (!item.mega) return null;
  const { columns, featured, tiles } = item.mega;
  // For the tile layout, surface the last column's links (e.g. "Get tailored
  // advice") as quick-link pills, minus the "all industries" duplicate.
  const advice = (columns[columns.length - 1]?.links ?? []).filter(
    (l) => l.href !== "/industries"
  );

  return (
    <motion.div
      variants={panel}
      initial="hidden"
      animate="show"
      exit="exit"
      className="absolute left-0 right-0 top-full z-40 pt-3"
    >
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-900/95 p-6 shadow-card backdrop-blur-2xl lg:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neo-600/70 to-transparent"
        />
        {tiles && tiles.length > 0 ? (
          <TilesLayout tiles={tiles} advice={advice} onNavigate={onNavigate} />
        ) : (
          <ColumnsLayout columns={columns} featured={featured} onNavigate={onNavigate} />
        )}
      </div>
    </motion.div>
  );
}
