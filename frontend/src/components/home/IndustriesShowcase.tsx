import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { safeImg, imgSrcSet, onImgError } from "@/lib/image";
import { ArrowUpRight, Plus } from "lucide-react";
import { industryIcon } from "@/lib/industryIcons";
import { useCatalog } from "@/store/useCatalog";
import { SectionHeading } from "@/components/SectionHeading";
import { cn } from "@/lib/utils";

// Every enabled industry is listed — nothing is truncated. The column used to be
// capped at six because it outgrew the photo beside it; the visual panel is now
// a fixed height that STICKS while the list scrolls past, so the two columns stay
// aligned no matter how many sectors the admin adds.

// Left → right entrance: the selector rows cascade in from the left while the
// visual panel slides in from the right. Re-fires on every scroll (once:false).
const listWrap: Variants = {
  hidden: {},
  // A tighter stagger than before: with eleven-plus rows a 0.08s step made the
  // last card arrive almost a second after the first.
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.05 } },
};
const listItem: Variants = {
  hidden: { opacity: 0, x: -44, filter: "blur(6px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export function IndustriesShowcase() {
  const allIndustries = useCatalog((s) => s.industries);
  const [active, setActive] = useState(0);

  // Mirror the /industries page: hide what the admin disabled, newest first.
  const industries = useMemo(
    () =>
      allIndustries
        .filter((i) => i.visible !== false)
        .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0)),
    [allIndustries]
  );

  // The list is admin-driven, so it can shrink under a stale `active` index.
  const current = industries[active] ?? industries[0];
  if (!current) return null;

  return (
    <section id="industries" className="relative py-10 sm:py-16">
      <div className="container-px">
        <SectionHeading
          eyebrow="Industries We Power"
          title="Built for the floors that build the world"
          subtitle={`From zero-defect automotive and EV lines to aerospace, energy and semiconductor fabs, our solutions are engineered for the most demanding environments on earth — all ${industries.length} sectors, right here.`}
          action={
            <Link to="/industries" className="btn-ghost text-sm">
              All Industries <ArrowUpRight className="h-4 w-4" />
            </Link>
          }
        />

        {/* items-start (not the default stretch) is what lets the visual panel
            position:sticky — a stretched grid item is already as tall as the
            row, so it has nothing to stick within. */}
        <div className="mt-8 grid gap-6 sm:mt-14 sm:gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          {/* Selector list */}
          <motion.div
            className="flex flex-col gap-2"
            variants={listWrap}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, margin: "-80px" }}
          >
            {industries.map((ind, i) => {
              const Icon = industryIcon(ind.icon);
              const isActive = ind.id === current.id;
              return (
                <motion.button
                  key={ind.id}
                  variants={listItem}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 sm:p-5",
                    isActive
                      ? "border-white/15 bg-white/[0.05]"
                      : "border-white/[0.06] bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.03]"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="ind-active"
                      className="absolute left-0 top-0 h-full w-1"
                      style={{ background: ind.accent }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-4">
                      {/* Thumbnail + icon badge: the row now carries the same
                          photo as the panel, so scanning the list reads as a
                          set of industries rather than a list of labels — and
                          every thumb is the same fixed box, so they line up. */}
                      <span className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-white/10">
                        <img
                          src={safeImg(ind.image)}
                          srcSet={imgSrcSet(ind.image, [96, 160])}
                          sizes="48px"
                          onError={onImgError}
                          alt=""
                          aria-hidden
                          loading="lazy"
                          decoding="async"
                          className={cn(
                            "absolute inset-0 h-full w-full object-cover transition duration-500",
                            isActive
                              ? "scale-105 opacity-70"
                              : "opacity-35 grayscale group-hover:opacity-55 group-hover:grayscale-0"
                          )}
                        />
                        <span
                          aria-hidden
                          className="absolute inset-0 bg-ink-950/45"
                          style={isActive ? { background: `${ind.accent}40` } : {}}
                        />
                        <Icon
                          className={cn(
                            "relative h-5 w-5 transition-colors",
                            isActive ? "text-white" : "text-steel-200"
                          )}
                          style={isActive ? { color: ind.accent } : {}}
                        />
                      </span>
                      <div className="min-w-0">
                        <h3 className="truncate font-display text-lg font-semibold text-white">
                          {ind.name}
                        </h3>
                        <p className="truncate text-sm text-steel-400">{ind.short}</p>
                      </div>
                    </div>
                    <Plus
                      className={cn(
                        "h-4 w-4 shrink-0 transition-transform duration-300",
                        isActive ? "rotate-45 text-white" : "text-steel-500"
                      )}
                    />
                  </div>

                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="mt-4 text-sm leading-relaxed text-steel-300">
                          {ind.tagline}
                        </p>
                        <Link
                          to={`/industries/${ind.id}`}
                          className="mt-3 inline-flex items-center gap-1 text-sm font-semibold"
                          style={{ color: ind.accent }}
                        >
                          Explore solutions <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Visual — hidden on mobile: the accordion already carries the info,
              and text-over-photo reads poorly on small screens.
              On desktop it is a FIXED height that sticks below the navbar, so a
              long list scrolls past a photo that stays perfectly framed instead
              of stretching a single image to a thousand pixels tall. */}
          <motion.div
            initial={{ opacity: 0, x: 64, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: false, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="force-dark relative hidden overflow-hidden rounded-3xl border border-white/10 shadow-card lg:sticky lg:top-28 lg:block lg:h-[min(34rem,calc(100vh-9rem))]"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <img
                  src={safeImg(current.image)}
                  srcSet={imgSrcSet(current.image, [720, 1080, 1440])}
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  onError={onImgError}
                  alt={`${current.name} — ${current.short}`}
                  decoding="async"
                  className="h-full w-full object-cover object-center"
                />
                {/* Two scrims, not one: the panel is a fixed height and the
                    copy block can run to three lines, so the old single fade
                    ran out before the text did and the chips landed on a bright
                    part of the photo. */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/75 to-ink-950/10" />
                <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-ink-950 to-transparent" />
                <div
                  className="absolute inset-0 opacity-40 mix-blend-overlay"
                  style={{
                    background: `radial-gradient(circle at 70% 20%, ${current.accent}, transparent 60%)`,
                  }}
                />
              </motion.div>
            </AnimatePresence>

            {/* Position counter — makes a long list feel navigable. */}
            <div className="absolute right-5 top-5 z-10 rounded-full border border-white/15 bg-ink-950/55 px-3 py-1.5 font-mono text-[13px] tracking-wider text-steel-200 backdrop-blur-md">
              {String(industries.findIndex((i) => i.id === current.id) + 1).padStart(2, "0")}
              <span className="text-steel-500"> / {String(industries.length).padStart(2, "0")}</span>
            </div>

            <div className="relative z-10 flex h-full flex-col justify-end p-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.45 }}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    {/* A tinted chip with its own rim and blur, so the industry
                        accent stays legible over any photograph. */}
                    <span
                      className="rounded-full border px-3 py-1 text-xs font-semibold text-pure backdrop-blur-md"
                      style={{
                        background: `${current.accent}33`,
                        borderColor: `${current.accent}80`,
                      }}
                    >
                      {current.name}
                    </span>
                    <span className="text-xs text-steel-300">
                      <strong className="text-white">{current.stat.value}</strong>{" "}
                      {current.stat.label}
                    </span>
                  </div>
                  <h3 className="mt-4 max-w-md font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
                    {current.tagline}
                  </h3>
                  {/* line-clamp keeps a long description from pushing the
                      capability pills out of the fixed-height panel. */}
                  <p className="mt-3 line-clamp-3 max-w-md text-sm leading-relaxed text-steel-300">
                    {current.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {current.capabilities.slice(0, 3).map((c) => (
                      <span
                        key={c}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-steel-200 backdrop-blur-sm"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
