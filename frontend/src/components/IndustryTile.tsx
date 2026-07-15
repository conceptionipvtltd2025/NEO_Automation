import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Industry } from "@/data/industries";
import { industryIcon } from "@/lib/industryIcons";
import { safeImg, imgSrcSet, onImgError } from "@/lib/image";

type Props = {
  industry: Industry;
  /** Position in the grid — drives the entrance stagger. */
  index?: number;
};

/**
 * Image-led industry tile: a fixed 4:3 photo so every card in a grid lines up
 * regardless of the source image's aspect, with the name always legible and the
 * capability list revealed on hover (pointer devices only — touch users get the
 * tagline, and the full list on the detail page).
 */
export function IndustryTile({ industry: ind, index = 0 }: Props) {
  const Icon = industryIcon(ind.icon);

  return (
    <motion.div
      initial={{ opacity: 0, y: 36, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        delay: (index % 3) * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link
        to={`/industries/${ind.id}`}
        aria-label={`${ind.name} — ${ind.tagline}`}
        className="force-dark group relative block overflow-hidden rounded-3xl border border-white/10 shadow-card transition-colors duration-500 hover:border-white/25"
      >
        {/* Photo — fixed ratio keeps the grid aligned */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={safeImg(ind.image)}
            srcSet={imgSrcSet(ind.image, [480, 720, 960, 1440])}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            onError={onImgError}
            alt={`${ind.name} — ${ind.short}`}
            loading={index < 3 ? "eager" : "lazy"}
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]"
          />

          {/* Legibility scrim — deepens on hover so the copy stays readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/45 to-ink-950/5 transition-opacity duration-500 group-hover:from-ink-950 group-hover:via-ink-950/70" />

          {/* Accent wash, keyed to the industry */}
          <div
            className="absolute inset-0 opacity-0 mix-blend-overlay transition-opacity duration-700 group-hover:opacity-60"
            style={{
              background: `radial-gradient(circle at 70% 15%, ${ind.accent}, transparent 65%)`,
            }}
          />

          {/* Stat chip */}
          <div className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[11px] backdrop-blur-md">
            <strong className="text-white">{ind.stat.value}</strong>{" "}
            <span className="text-steel-300">{ind.stat.label}</span>
          </div>
        </div>

        {/* Copy */}
        <div className="absolute inset-x-0 bottom-0 p-6">
          <div className="flex items-start justify-between gap-4">
            <span
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 backdrop-blur-md transition-transform duration-500 group-hover:-translate-y-1"
              style={{ background: `${ind.accent}26`, color: ind.accent }}
            >
              <Icon className="h-5 w-5" />
            </span>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 text-steel-200 transition-all duration-500 group-hover:border-neo-600 group-hover:bg-neo-600 group-hover:text-pure">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>

          <h3 className="mt-4 font-display text-xl font-bold leading-tight text-white">
            {ind.name}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-steel-300">
            {ind.tagline}
          </p>

          {/* Capabilities — expand on hover where a pointer exists */}
          <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:grid-rows-[1fr]">
            <div className="overflow-hidden">
              <div className="flex flex-wrap gap-1.5 pt-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {ind.capabilities.slice(0, 3).map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[11px] text-steel-200 backdrop-blur-sm"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
