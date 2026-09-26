import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Check,
  CirclePlay,
  Compass,
  FileText,
  Newspaper,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import {
  insightPath,
  insightTopics,
  safetyInsights,
  type InsightTopic,
  type SafetyInsight,
} from "@/data/safetyInsights";
import { cn } from "@/lib/utils";

/**
 * Safety Insights — the nine Atlas Copco Expert Hub pieces, as a filterable
 * card grid. Every card opens Neo's own detail page for the piece
 * (/safety/insights/:id) — at the client's request nothing links out to the
 * manufacturer's site. Atlas Copco is credited in plain text; nothing here is
 * presented as Neo's own writing.
 *
 * Grid rule: no lonely orphan card at any width.
 *  - phones: 2 compact columns; an odd count makes the LAST card span both.
 *  - sm–lg: 2 columns; an odd last card spans both and turns horizontal.
 *  - lg+: 3 columns when the count divides by 3, otherwise 2.
 */

export const kindIcon: Record<SafetyInsight["kind"], LucideIcon> = {
  Overview: Compass,
  "Case study": Briefcase,
  Article: Newspaper,
  "White paper": FileText,
  "Pocket guide": BookOpen,
  "Product training": CirclePlay,
};

const monthYear = new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" });
/** "Jun 2026" — an insight's publication month. */
export const formatInsightDate = (iso: string) =>
  monthYear.format(new Date(`${iso}T00:00:00`));

type Topic = InsightTopic | "all";

export function SafetyInsights() {
  const [topic, setTopic] = useState<Topic>("all");
  const reduce = useReducedMotion();

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: safetyInsights.length };
    for (const s of safetyInsights) c[s.topic] = (c[s.topic] ?? 0) + 1;
    return c;
  }, []);

  const visible = useMemo(
    () => (topic === "all" ? safetyInsights : safetyInsights.filter((s) => s.topic === topic)),
    [topic]
  );

  const count = visible.length;
  const odd = count % 2 === 1;
  const threeUp = count % 3 === 0;

  return (
    // No scroll-mt here: scrollToHash already clears the navbar, and Lenis
    // adds any scroll-margin on top of that (the offset counted twice).
    <section id="insights" className="container-px py-10 sm:py-16">
      <SectionHeading
        align="center"
        eyebrow="Safety Insights"
        title="Expert reading on vibration, ergonomics & bolting"
        subtitle="Nine articles, guides and case studies from the Atlas Copco Expert Hub — the manufacturer whose tools we distribute and service. Open any card for the full insight."
      />

      {/* Topic chips — a swipeable row on phones (scrollbar hidden, bled to
          the gutter so it never widens the page), centred and wrapping from sm. */}
      <Reveal delay={0.1}>
        <div
          role="group"
          aria-label="Filter insights by topic"
          className="-mx-5 mt-8 flex gap-2 overflow-x-auto px-5 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:mt-10 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {insightTopics.map((t) => {
            const active = topic === t.id;
            return (
              <button
                key={t.id}
                type="button"
                aria-pressed={active}
                onClick={() => setTopic(t.id)}
                className={cn(
                  "relative inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "border-transparent text-white"
                    : "border-white/10 text-steel-400 hover:border-white/20 hover:text-white"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="safety-insight-chip"
                    aria-hidden
                    className="absolute inset-0 rounded-full border border-volt-500/45 bg-volt-500/15"
                    transition={
                      reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }
                    }
                  />
                )}
                <span className="relative z-10">{t.label}</span>
                <span
                  className={cn(
                    "relative z-10 grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[11px] font-semibold tabular-nums",
                    active ? "bg-white/15 text-white" : "bg-white/[0.07] text-steel-400"
                  )}
                >
                  {counts[t.id] ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      </Reveal>

      <p className="sr-only" aria-live="polite">
        Showing {count} {count === 1 ? "insight" : "insights"}
      </p>

      <motion.div
        layout={!reduce}
        className={cn(
          "relative mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-5",
          threeUp ? "lg:grid-cols-3" : "lg:mx-auto lg:max-w-5xl lg:grid-cols-2"
        )}
      >
        <AnimatePresence mode="sync">
          {visible.map((insight, i) => {
            const wide = odd && i === count - 1;
            return (
              <motion.div
                key={insight.id}
                layout={!reduce}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 22, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
                transition={{
                  duration: reduce ? 0.2 : 0.55,
                  delay: reduce ? 0 : (i % 3) * 0.07,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={cn(
                  "min-w-0",
                  wide && "col-span-2",
                  wide && threeUp && "lg:col-span-1"
                )}
              >
                <InsightCard insight={insight} wide={wide} wideOnLg={wide && !threeUp} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      <Reveal delay={0.1}>
        <div className="mt-10 flex flex-col items-center text-center sm:mt-12">
          <p className="max-w-xl text-[12.5px] leading-relaxed text-steel-500">
            Articles, images and guides courtesy of Atlas Copco — shared by Neo
            Automation as an authorised Atlas Copco channel partner.
          </p>
        </div>
      </Reveal>
    </section>
  );
}

/**
 * One insight card — the whole card is an internal link to the insight's
 * detail page. Exported for reuse ("More safety insights" on those pages).
 * `wide`: the odd last card, spanning both columns below lg (horizontal from sm).
 * `wideOnLg`: it stays wide + horizontal on lg too (lg grid is 2-up).
 */
export function InsightCard({
  insight,
  wide = false,
  wideOnLg = false,
}: {
  insight: SafetyInsight;
  wide?: boolean;
  wideOnLg?: boolean;
}) {
  const Icon = kindIcon[insight.kind];
  // back to a vertical card on lg when the 3-up grid gives it a normal cell
  const backToVertical = wide && !wideOnLg;

  return (
    <Link
      to={insightPath(insight.id)}
      className={cn(
        "card-rich group flex h-full flex-col rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-volt-400 sm:rounded-3xl",
        wide && "sm:flex-row",
        backToVertical && "lg:flex-col"
      )}
    >
      <span aria-hidden className="shine-sweep pointer-events-none absolute inset-0 z-[3]" />
      {/* rim glow on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 z-0 h-44 w-44 rounded-full bg-iris-500/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
      />

      {/* ── Art ── */}
      <div
        className={cn(
          "force-dark relative w-full shrink-0 overflow-hidden bg-ink-900",
          // one aspect class per breakpoint — never two competing at the same one
          wide
            ? "aspect-[16/9] sm:aspect-auto sm:min-h-[15rem] sm:w-[45%]"
            : "aspect-[4/3] sm:aspect-[16/10]",
          backToVertical && "lg:aspect-[16/10] lg:min-h-0 lg:w-full"
        )}
      >
        <InsightArt insight={insight} />

        <span className="absolute left-2.5 top-2.5 z-[2] inline-flex max-w-[calc(100%-1.25rem)] items-center gap-1.5 rounded-full border border-pure/15 bg-ink-950/60 px-2.5 py-1 text-[11px] font-semibold text-pure backdrop-blur-md sm:left-3.5 sm:top-3.5 sm:px-3 sm:text-xs">
          <Icon className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{insight.kind}</span>
        </span>
      </div>

      {/* ── Body ── */}
      <div className="relative z-[1] flex min-w-0 flex-1 flex-col p-3.5 sm:p-6">
        {/* each half stays whole, so a narrow card breaks between them */}
        <p className="flex flex-wrap gap-x-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-steel-500 sm:gap-x-1.5 sm:text-xs">
          <time dateTime={insight.date} className="whitespace-nowrap">
            {formatInsightDate(insight.date)}
          </time>
          <span aria-hidden className="hidden sm:inline">·</span>
          <span className="whitespace-nowrap">{insight.readLabel}</span>
        </p>
        <h3 className="mt-2 line-clamp-3 font-display text-[15px] font-bold leading-snug text-white sm:mt-2.5 sm:text-lg">
          {insight.title}
        </h3>
        {/* wrapper carries the show/hide so line-clamp keeps its -webkit-box */}
        <div className="hidden sm:block">
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-steel-400">
            {insight.summary}
          </p>
        </div>
        <ul className="mt-4 hidden space-y-1.5 sm:block">
          {insight.takeaways.map((t) => (
            <li key={t} className="flex items-start gap-2 text-[13px] leading-snug text-steel-300">
              <span className="mt-[1px] grid h-4 w-4 shrink-0 place-items-center rounded-full bg-aurora-500/15 text-aurora-600">
                <Check className="h-2.5 w-2.5" strokeWidth={3} />
              </span>
              {t}
            </li>
          ))}
        </ul>

        {/* footer pinned to the bottom so rows of cards line up */}
        <span className="mt-auto block pt-3 sm:pt-5">
          <span className="flex items-center justify-between gap-3 border-t border-white/10 pt-3 text-[13px] font-semibold text-steel-200 transition-colors group-hover:text-white sm:pt-4 sm:text-sm">
          <span>
            <span className="sm:hidden">Read</span>
            <span className="hidden sm:inline">Read the full insight</span>
          </span>
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] transition-colors group-hover:border-volt-500/45 group-hover:bg-volt-500/15 sm:h-8 sm:w-8">
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 sm:h-4 sm:w-4" />
          </span>
          </span>
        </span>
      </div>
    </Link>
  );
}

export function InsightArt({ insight }: { insight: SafetyInsight }) {
  if (insight.fit === "cover") {
    return (
      <>
        <img
          src={insight.image}
          alt={insight.alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-950/35 via-transparent to-ink-950/25"
        />
      </>
    );
  }

  if (insight.plate === "navy") {
    // Brochure cover: whole, centred on a deep-navy stage, lifting on hover.
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(ellipse_at_50%_35%,#1f4a86_0%,#0d2248_50%,#060e1f_100%)] px-4 py-3 sm:py-5">
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-[8%] left-1/2 h-6 w-1/3 -translate-x-1/2 rounded-full bg-black/60 blur-xl"
        />
        <img
          src={insight.image}
          alt={insight.alt}
          loading="lazy"
          decoding="async"
          className="relative h-full w-auto max-w-full rounded-[3px] object-contain shadow-[0_18px_36px_-10px_rgba(0,0,0,0.75)] ring-1 ring-pure/10 transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-hover:-rotate-2"
        />
      </div>
    );
  }

  // Product shot on white: shown whole on a white plate.
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-pure p-2 pt-6 sm:p-3 sm:pt-8">
      <img
        src={insight.image}
        alt={insight.alt}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.06]"
      />
    </div>
  );
}
