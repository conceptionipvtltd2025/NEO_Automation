import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import { Link, useParams } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpenText,
  CalendarDays,
  CheckCircle2,
  Clock,
  Headset,
  Layers,
  Library,
  Sparkles,
  Tag,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { InsightArticleBody } from "@/components/safety/InsightArticleBody";
import {
  InsightArt,
  InsightCard,
  formatInsightDate,
  kindIcon,
} from "@/components/safety/SafetyInsights";
import {
  allInsightPages,
  getInsight,
  insightPath,
  insightTopics,
  type SafetyInsight,
} from "@/data/safetyInsights";
import { insightArticles, type InsightBlock } from "@/data/insightArticles";
import { cn } from "@/lib/utils";
import NotFound from "./NotFound";

/**
 * /safety/insights/:slug — Neo's own page for one Atlas Copco Expert Hub
 * safety insight (the "no bad vibes" overview or one of the nine cards).
 *
 * The client asked for NO outbound links: everything a visitor needs is here,
 * the credit to Atlas Copco is plain text, and the source URL kept in the data
 * is never rendered. Long-form copy lives in
 * src/data/insightArticles/<id>.ts; when an article has no body yet, the page
 * falls back to the card's own summary and takeaways rather than showing a gap.
 *
 * Layout: article left (72ch measure) + a sticky aside on lg. On phones the
 * Key takeaways card sits right under the hero image, before the body, and the
 * rest of the aside follows the body.
 */

const fullDate = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});
const formatFullDate = (iso: string) => fullDate.format(new Date(`${iso}T00:00:00`));

const TRAILING_FILLER = /\s+(a|an|the|of|in|on|for|with|and|to|at|by|under)$/i;

/** Cut at a word boundary, ~max chars, with an ellipsis (no dangling "a"/"the"). */
function shorten(s: string, max = 40) {
  if (s.length <= max + 4) return s; // a few chars over beats a pointless cut
  const cut = s.slice(0, max + 1);
  const space = cut.lastIndexOf(" ");
  let out = space > 0 ? cut.slice(0, space) : cut.slice(0, max);
  while (TRAILING_FILLER.test(out)) out = out.replace(TRAILING_FILLER, "");
  return `${out.replace(/[\s.,:;–—-]+$/, "")}…`;
}

/** True from Tailwind's `sm` (640px) up — the breadcrumb gets a longer label there. */
function useIsSmUp() {
  const query = "(min-width: 640px)";
  const [match, setMatch] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return match;
}

export default function SafetyInsightDetail() {
  const { slug } = useParams();
  const meta = getInsight(slug);
  if (!meta) return <NotFound />;
  // keyed so every piece of page state resets when moving between insights
  return <InsightPage key={meta.id} meta={meta} />;
}

function InsightPage({ meta }: { meta: SafetyInsight }) {
  const article = insightArticles[meta.id];
  const articleRef = useRef<HTMLElement>(null);
  const smUp = useIsSmUp();

  useEffect(() => {
    const previous = document.title;
    document.title = `${meta.title} | Neo Automation`;
    return () => {
      document.title = previous;
    };
  }, [meta.title]);

  const intro = article?.intro?.trim() || meta.summary;
  const hasBody = !!article?.body?.length;
  const blocks: InsightBlock[] = hasBody
    ? article.body
    : [
        // Graceful fallback while an article is still being written: the
        // card's own facts, never an empty page.
        ...(intro !== meta.summary ? [{ type: "lead" as const, text: meta.summary }] : []),
        { type: "h2", text: "The short version" },
        {
          type: "list",
          style: "check",
          items: meta.takeaways.map((t) => ({ text: t })),
        },
      ];
  const takeaways = article?.keyTakeaways?.length ? article.keyTakeaways : meta.takeaways;
  const neoLinks = article?.neoLinks ?? [];
  const topicLabel = insightTopics.find((t) => t.id === meta.topic)?.label ?? "Safety";

  const idx = allInsightPages.findIndex((i) => i.id === meta.id);
  const prev = idx > 0 ? allInsightPages[idx - 1] : undefined;
  const next = idx >= 0 && idx < allInsightPages.length - 1 ? allInsightPages[idx + 1] : undefined;

  // Same topic first, then the rest; within each, pieces that are not already
  // offered as previous/next come first. Never the current one.
  const adjacent = new Set([prev?.id, next?.id]);
  const related = allInsightPages
    .filter((i) => i.id !== meta.id)
    .map((i, order) => ({
      i,
      order,
      score: (i.topic === meta.topic ? 0 : 2) + (adjacent.has(i.id) ? 1 : 0),
    }))
    .sort((a, b) => a.score - b.score || a.order - b.order)
    .slice(0, 3)
    .map((r) => r.i);

  return (
    <>
      <ReadingProgress target={articleRef} />

      <PageHeader
        eyebrow={meta.kind}
        title={meta.title}
        subtitle={intro}
        crumbs={[
          { label: "Safety", href: "/safety" },
          { label: "Insights", href: "/safety#insights" },
          // phones: a short label so the trail stays on one line
          { label: shorten(meta.title, smUp ? 40 : 16) },
        ]}
        media={<HeroArt meta={meta} className="w-full max-w-[34rem]" />}
      />

      <section className="container-px pb-10 pt-2 sm:pb-16 lg:pt-6">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12">
          {/* ── Article ── */}
          <div className="min-w-0">
            {/* PageHeader hides its media below lg — show the art here instead. */}
            <Reveal y={18} blur={false} className="lg:hidden">
              <HeroArt meta={meta} className="mx-auto w-full max-w-2xl" />
            </Reveal>
            <Reveal y={18} blur={false} className="mt-6 lg:hidden">
              <TakeawaysCard items={takeaways} />
            </Reveal>

            <article
              ref={articleRef}
              aria-label={meta.title}
              className="mt-10 max-w-[72ch] lg:mt-0"
            >
              <InsightArticleBody blocks={blocks} />
            </article>

            <Reveal y={12} blur={false} className="mt-12 max-w-[72ch]">
              <p className="flex items-start gap-3 border-t border-white/10 pt-6 text-[13px] leading-relaxed text-steel-500">
                <BookOpenText className="mt-0.5 h-4 w-4 shrink-0 text-steel-500" />
                <span>
                  Source: Atlas Copco Expert Hub — republished by Neo Automation,
                  an authorised Atlas Copco channel partner.
                </span>
              </p>
            </Reveal>
          </div>

          {/* ── Aside ── */}
          <InsightAside
            meta={meta}
            takeaways={takeaways}
            topicLabel={topicLabel}
            neoLinks={neoLinks}
          />
        </div>
      </section>

      {/* ── Previous / next ── */}
      <section className="container-px py-10 sm:py-12">
        <nav aria-label="Previous and next insight" className="grid gap-4 sm:grid-cols-2 sm:gap-5">
          <Reveal y={16} blur={false} className="min-w-0">
            {prev ? <AdjacentCard insight={prev} dir="prev" /> : <AllInsightsTile />}
          </Reveal>
          <Reveal y={16} blur={false} delay={0.08} className="min-w-0">
            {next ? <AdjacentCard insight={next} dir="next" /> : <AllInsightsTile />}
          </Reveal>
        </nav>
      </section>

      {/* ── More safety insights ── */}
      <section className="container-px pb-16 pt-6 sm:pb-24 sm:pt-10">
        <Reveal y={18} blur={false}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="eyebrow">
                <span className="h-1.5 w-1.5 rounded-full bg-volt-400" />
                Keep reading
              </span>
              <h2 className="mt-4 font-display text-[clamp(1.5rem,4vw,2.3rem)] font-bold leading-tight tracking-tight text-gradient">
                More safety insights
              </h2>
            </div>
            <Link
              to="/safety#insights"
              className="group/back inline-flex items-center gap-2 self-start rounded-full py-2 text-sm font-semibold text-steel-200 transition-colors hover:text-white sm:self-auto"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full border border-white/15 transition group-hover/back:border-volt-400/50 group-hover/back:bg-volt-500/15">
                <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover/back:-translate-x-0.5" />
              </span>
              Back to all insights
            </Link>
          </div>
        </Reveal>

        <StaggerGroup className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {related.map((r, i) => {
            const wide = related.length % 2 === 1 && i === related.length - 1;
            return (
              <StaggerItem
                key={r.id}
                className={cn("min-w-0", wide && "col-span-2 lg:col-span-1")}
              >
                <InsightCard insight={r} wide={wide} wideOnLg={false} />
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </section>
    </>
  );
}

/* ── Reading progress ────────────────────────────────────────────────────── */

/**
 * A thin volt → iris → aurora bar pinned to the very top of the viewport,
 * tracking progress through the article body. Its track covers the site-wide
 * page-progress line on this page, so there is only ever one bar. Portalled to
 * <body> so the route's entrance transform can never re-anchor it.
 */
function ReadingProgress({ target }: { target: RefObject<HTMLElement> }) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start 0.3", "end 0.85"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[61] h-[3px] bg-ink-950"
    >
      <motion.div
        style={{ scaleX: reduce ? scrollYProgress : smooth }}
        className="h-full origin-left bg-gradient-to-r from-volt-500 via-iris-500 to-aurora-500"
      />
    </div>,
    document.body
  );
}

/* ── Hero art ────────────────────────────────────────────────────────────── */

function HeroArt({ meta, className }: { meta: SafetyInsight; className?: string }) {
  const reduce = useReducedMotion();
  const chip = `${formatInsightDate(meta.date)} · ${meta.readLabel}`;

  return (
    <div className={cn("group relative", className)}>
      {/* soft pastel bloom behind the frame */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-3 -z-10 rounded-[3rem] bg-aurora-soft opacity-70 blur-3xl sm:-inset-6"
      />
      <div className="force-dark relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-ink-900 shadow-card">
        {meta.fit === "cover" ? (
          <>
            <motion.img
              src={meta.image}
              alt={meta.alt}
              decoding="async"
              initial={reduce ? false : { scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/70 via-ink-950/5 to-ink-950/20"
            />
          </>
        ) : meta.plate === "navy" ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(ellipse_at_50%_35%,#1f4a86_0%,#0d2248_50%,#060e1f_100%)] px-6 pb-14 pt-6">
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-[14%] left-1/2 h-8 w-1/3 -translate-x-1/2 rounded-full bg-black/60 blur-xl"
            />
            <img
              src={meta.image}
              alt={meta.alt}
              decoding="async"
              className="relative h-full w-auto max-w-full rounded-[4px] object-contain shadow-[0_24px_48px_-12px_rgba(0,0,0,0.8)] ring-1 ring-pure/10 transition-transform duration-700 ease-out group-hover:-translate-y-1.5 group-hover:-rotate-2"
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-pure px-8 pb-16 pt-8">
            <img
              src={meta.image}
              alt={meta.alt}
              decoding="async"
              className="h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          </div>
        )}
        <span aria-hidden className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-pure/10" />

        <motion.span
          animate={reduce ? undefined : { y: [0, -4, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-4 left-4 inline-flex max-w-[calc(100%-2rem)] items-center gap-2 rounded-full border border-pure/15 bg-ink-950/65 px-3.5 py-1.5 text-[13px] font-semibold text-pure shadow-card backdrop-blur-md"
        >
          <CalendarDays className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{chip}</span>
        </motion.span>
      </div>
    </div>
  );
}

/* ── Aside ───────────────────────────────────────────────────────────────── */

/**
 * On lg the aside is sticky. When it is taller than the viewport it pins by
 * its bottom edge instead (a negative `top`), so its last card is never cut off.
 */
function useFitSticky(ref: RefObject<HTMLElement>, base = 112, gap = 24) {
  const [top, setTop] = useState(base);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const h = el.offsetHeight;
      const vh = window.innerHeight;
      setTop(h + base + gap > vh ? Math.min(base, vh - h - gap) : base);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [ref, base, gap]);
  return top;
}

function InsightAside({
  meta,
  takeaways,
  topicLabel,
  neoLinks,
}: {
  meta: SafetyInsight;
  takeaways: string[];
  topicLabel: string;
  neoLinks: { label: string; href: string; desc: string }[];
}) {
  const ref = useRef<HTMLElement>(null);
  const top = useFitSticky(ref);
  const KindIcon = kindIcon[meta.kind];
  const isRead = /read$/i.test(meta.readLabel);

  const facts: { icon: typeof Clock; label: string; value: ReactNode }[] = [
    { icon: KindIcon, label: "Type", value: meta.kind },
    {
      icon: CalendarDays,
      label: "Published",
      value: <time dateTime={meta.date}>{formatFullDate(meta.date)}</time>,
    },
    { icon: Clock, label: isRead ? "Reading time" : "Format", value: meta.readLabel },
    { icon: Tag, label: "Topic", value: topicLabel },
  ];

  return (
    <aside
      ref={ref}
      style={{ top }}
      aria-label="About this insight"
      className="grid min-w-0 gap-4 self-start sm:grid-cols-2 lg:sticky lg:grid-cols-1"
    >
      <Reveal y={16} blur={false} className="hidden lg:block">
        <TakeawaysCard items={takeaways} />
      </Reveal>

      <Reveal y={16} blur={false} delay={0.05} className="min-w-0">
        <SideCard icon={Layers} title="At a glance">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
            {facts.map((f) => (
              <div key={f.label} className="min-w-0">
                <dt className="flex items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-steel-500">
                  <f.icon className="h-3.5 w-3.5 shrink-0" />
                  {f.label}
                </dt>
                <dd className="mt-1 text-[14px] font-medium leading-snug text-steel-200">
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 border-t border-white/10 pt-4 text-[12.5px] leading-relaxed text-steel-500">
            Published by Atlas Copco on its Expert Hub.
          </p>
        </SideCard>
      </Reveal>

      {neoLinks.length > 0 && (
        <Reveal y={16} blur={false} delay={0.1} className="min-w-0">
          <SideCard icon={Library} title="From Neo">
            <ul className="-mx-2 space-y-1">
              {neoLinks.map((l) => (
                <li key={`${l.href}-${l.label}`}>
                  <Link
                    to={l.href}
                    className="group/nl flex items-start justify-between gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-white/[0.05]"
                  >
                    <span className="min-w-0">
                      <span className="block text-[14.5px] font-semibold leading-snug text-white">
                        {l.label}
                      </span>
                      {l.desc && (
                        <span className="mt-0.5 block text-[13px] leading-snug text-steel-400">
                          {l.desc}
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/10 text-steel-300 transition-colors group-hover/nl:border-volt-500/45 group-hover/nl:bg-volt-500/15 group-hover/nl:text-white">
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/nl:-translate-y-0.5 group-hover/nl:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </SideCard>
        </Reveal>
      )}

      <Reveal
        y={16}
        blur={false}
        delay={0.15}
        className={cn("min-w-0", neoLinks.length > 0 && "sm:col-span-2 lg:col-span-1")}
      >
        <div className="force-dark relative overflow-hidden rounded-3xl border border-white/10 bg-ink-900 p-6 shadow-card">
          <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neo-600/70 to-transparent" />
          <span aria-hidden className="pointer-events-none absolute -bottom-20 -right-16 h-48 w-48 rounded-full bg-neo-600/15 blur-3xl" />
          <span className="relative grid h-11 w-11 place-items-center rounded-2xl bg-neo-600/15 text-neo-400">
            <Headset className="h-5 w-5" />
          </span>
          <h3 className="relative mt-4 font-display text-lg font-bold leading-snug text-pure">
            Talk to a Neo engineer
          </h3>
          <p className="relative mt-2 text-[14px] leading-relaxed text-steel-300">
            Questions about the tools or practices in this insight? An
            application engineer can help you apply them on your line.
          </p>
          <Link to="/inquiry" className="btn-primary relative mt-5 w-full">
            Send an inquiry <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>
    </aside>
  );
}

function SideCard({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Clock;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-card">
      <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-steel-500">
        <Icon className="h-4 w-4" />
        {title}
      </p>
      {children}
    </div>
  );
}

function TakeawaysCard({ items }: { items: string[] }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-card">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-volt-500 via-iris-500 to-aurora-500"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-aurora-500/10 blur-3xl"
      />
      <p className="relative mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-steel-500">
        <Sparkles className="h-4 w-4 text-aurora-500 [.light_&]:text-aurora-600" />
        Key takeaways
      </p>
      <StaggerGroup className="relative space-y-3">
        {items.map((t) => (
          <StaggerItem key={t}>
            <p className="flex items-start gap-3 text-[14.5px] leading-snug text-steel-200">
              <CheckCircle2 className="mt-[1px] h-[18px] w-[18px] shrink-0 text-aurora-500 [.light_&]:text-aurora-600" />
              <span className="min-w-0">{t}</span>
            </p>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </div>
  );
}

/* ── Previous / next ─────────────────────────────────────────────────────── */

function AdjacentCard({ insight, dir }: { insight: SafetyInsight; dir: "prev" | "next" }) {
  const isNext = dir === "next";
  const Arrow = isNext ? ArrowRight : ArrowLeft;
  return (
    <Link
      to={insightPath(insight.id)}
      className={cn(
        "card-rich group flex h-full items-center gap-4 p-3 sm:gap-5 sm:rounded-3xl sm:p-4",
        isNext && "flex-row-reverse text-right"
      )}
    >
      <span aria-hidden className="shine-sweep pointer-events-none absolute inset-0 z-[3]" />
      <span className="force-dark relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-xl bg-ink-900 sm:w-32 sm:rounded-2xl">
        <InsightArt insight={insight} />
      </span>
      <span className="relative z-[1] min-w-0 flex-1">
        <span
          className={cn(
            "flex items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-steel-500",
            isNext && "justify-end"
          )}
        >
          {!isNext && (
            <Arrow className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
          )}
          {isNext ? "Next insight" : "Previous insight"}
          {isNext && (
            <Arrow className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          )}
        </span>
        <span className="mt-1.5 block text-[12px] font-semibold text-steel-400">
          {insight.kind}
        </span>
        <span className="mt-0.5 line-clamp-2 font-display text-[15px] font-bold leading-snug text-white sm:text-base">
          {insight.title}
        </span>
      </span>
    </Link>
  );
}

function AllInsightsTile() {
  return (
    <Link
      to="/safety#insights"
      className="card-rich group flex h-full min-h-[7rem] items-center gap-4 p-4 sm:rounded-3xl sm:p-5"
    >
      <span aria-hidden className="shine-sweep pointer-events-none absolute inset-0 z-[3]" />
      <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-volt-500/15 text-volt-400 transition-transform duration-300 group-hover:scale-110 [.light_&]:text-volt-600">
        <Layers className="h-5 w-5" />
      </span>
      <span className="relative min-w-0">
        <span className="block text-[11.5px] font-semibold uppercase tracking-[0.14em] text-steel-500">
          Safety insights
        </span>
        <span className="mt-1 block font-display text-[15px] font-bold leading-snug text-white sm:text-base">
          Browse all insights
        </span>
      </span>
    </Link>
  );
}
