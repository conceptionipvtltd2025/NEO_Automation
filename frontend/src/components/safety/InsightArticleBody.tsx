import { useEffect, useId, useRef, useState, type RefObject } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Info,
  MoveHorizontal,
  Plus,
  Quote,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import type { InsightBlock } from "@/data/insightArticles";
import { allInsightPages, insightPath } from "@/data/safetyInsights";
import { Reveal } from "@/components/ui/Reveal";
import { VpmChart } from "@/components/safety/VpmChart";
import { asset } from "@/lib/asset";
import { cn, slugify } from "@/lib/utils";

/**
 * Renders an insight article (InsightBlock[]) for /safety/insights/:id.
 *
 * Typography: lead in steel-200, body copy in steel-300 on a relaxed measure,
 * headings in the display face with a small pastel accent bar. Pastels (volt /
 * iris / aurora, amber for warnings) colour icons, bars and fills only — text
 * always wears the text tokens so it holds contrast in the light theme.
 *
 * Rhythm: the space above a block depends on what precedes it (tight under a
 * heading, looser between prose and a figure), so any block order reads evenly.
 * Every block rises in with a small, blur-free Reveal.
 */

type Block<T extends InsightBlock["type"]> = Extract<InsightBlock, { type: T }>;

const PROSE_TYPES = new Set<InsightBlock["type"]>(["lead", "p"]);
const HEADING_TYPES = new Set<InsightBlock["type"]>(["h2", "h3"]);

/** Space above a block, from the block before it. */
function gapAbove(block: InsightBlock, prev: InsightBlock | undefined): string {
  if (!prev) return "";
  const afterHeading = HEADING_TYPES.has(prev.type);
  switch (block.type) {
    case "h2":
      return "mt-12 sm:mt-16";
    case "h3":
      return prev.type === "h2" ? "mt-6" : "mt-10";
    case "lead":
    case "p":
      if (afterHeading) return "mt-4";
      return PROSE_TYPES.has(prev.type) ? "mt-5" : "mt-8";
    case "list":
      return afterHeading ? "mt-5" : PROSE_TYPES.has(prev.type) ? "mt-5" : "mt-8";
    default:
      return afterHeading ? "mt-6" : "mt-8 sm:mt-10";
  }
}

/** Stable, de-duplicated ids for the article's h2s (anchors / scroll targets). */
export function headingIds(blocks: InsightBlock[]): Map<number, string> {
  const seen = new Map<string, number>();
  const ids = new Map<number, string>();
  blocks.forEach((b, i) => {
    if (b.type !== "h2") return;
    const base = slugify(b.text) || "section";
    const n = (seen.get(base) ?? 0) + 1;
    seen.set(base, n);
    ids.set(i, n === 1 ? base : `${base}-${n}`);
  });
  return ids;
}

export function InsightArticleBody({
  blocks,
  className,
}: {
  blocks: InsightBlock[];
  className?: string;
}) {
  if (!blocks.length) return null;
  const ids = headingIds(blocks);

  return (
    <div className={cn("min-w-0", className)}>
      {blocks.map((block, i) => (
        <Reveal
          key={i}
          y={16}
          blur={false}
          className={cn("min-w-0", gapAbove(block, blocks[i - 1]))}
        >
          <BlockView block={block} id={ids.get(i)} />
        </Reveal>
      ))}
    </div>
  );
}

function BlockView({ block, id }: { block: InsightBlock; id?: string }) {
  switch (block.type) {
    case "lead":
      return (
        <p className="text-lg leading-relaxed text-steel-200 sm:text-xl sm:leading-[1.7]">
          {block.text}
        </p>
      );
    case "p":
      return (
        <p className="text-[16px] leading-relaxed text-steel-300 sm:text-base sm:leading-[1.8]">
          {block.text}
        </p>
      );
    case "h2":
      return (
        <h2
          id={id}
          className="font-display text-[1.55rem] font-bold leading-tight tracking-tight text-white sm:text-[1.9rem]"
        >
          <span
            aria-hidden
            className="mb-3.5 block h-1 w-10 rounded-full bg-gradient-to-r from-volt-500 via-iris-500 to-aurora-500"
          />
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 className="font-display text-lg font-bold leading-snug text-white sm:text-xl">
          {block.text}
        </h3>
      );
    case "list":
      return <ListBlock block={block} />;
    case "callout":
      return <CalloutBlock block={block} />;
    case "stats":
      return <StatsBlock block={block} />;
    case "image":
      return <ImageBlock block={block} />;
    case "faq":
      return <FaqBlock block={block} />;
    case "table":
      return <TableBlock block={block} />;
    case "vpm-chart":
      return <VpmBlock />;
    case "steps":
      return <StepsBlock block={block} />;
    case "quote":
      return <QuoteBlock block={block} />;
    default:
      return null;
  }
}

/* ── list ────────────────────────────────────────────────────────────────── */

/**
 * A list item whose title IS another insight's title (the overview's "nine
 * insights" list, for instance) becomes an internal link to that insight's
 * page — the text stays exactly as written, and nothing links out.
 */
const insightByTitle = new Map(
  allInsightPages.map((i) => [i.title.trim().toLowerCase(), i.id] as const)
);

function ListMarker({ style, index }: { style: Block<"list">["style"]; index: number }) {
  if (style === "check")
    return (
      <CheckCircle2 className="mt-[3px] h-5 w-5 shrink-0 text-aurora-500 [.light_&]:text-aurora-600" />
    );
  if (style === "number")
    return (
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-iris-500/15 font-mono text-[12.5px] font-semibold tabular-nums text-iris-300 ring-1 ring-inset ring-iris-500/25 [.light_&]:text-iris-600">
        {index + 1}
      </span>
    );
  return (
    <span aria-hidden className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-volt-500" />
  );
}

function ListBlock({ block }: { block: Block<"list"> }) {
  const titled = block.items.some((it) => it.title);
  const Tag = block.style === "number" ? "ol" : "ul";

  // Items with titles read as a set of short cards in one frame.
  if (titled) {
    return (
      <Tag className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
        {block.items.map((it, i) => {
          const linkId = it.title ? insightByTitle.get(it.title.trim().toLowerCase()) : undefined;
          const body = (
            <>
              <ListMarker style={block.style} index={i} />
              <div className="min-w-0 flex-1">
                {it.title && (
                  <p className="font-display text-[16px] font-bold leading-snug text-white sm:text-[17px]">
                    {it.title}
                  </p>
                )}
                <p
                  className={cn(
                    "text-[15px] leading-relaxed text-steel-300",
                    it.title && "mt-1"
                  )}
                >
                  {it.text}
                </p>
              </div>
            </>
          );
          const row = "flex gap-3.5 p-4 transition-colors duration-300 hover:bg-white/[0.03] sm:gap-4 sm:p-5";
          return (
            <li key={i}>
              {linkId ? (
                <Link to={insightPath(linkId)} className={cn(row, "group/li")}>
                  {body}
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center self-start rounded-full border border-white/10 text-steel-300 transition-colors group-hover/li:border-volt-500/45 group-hover/li:bg-volt-500/15 group-hover/li:text-white">
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/li:translate-x-0.5" />
                  </span>
                </Link>
              ) : (
                <div className={row}>{body}</div>
              )}
            </li>
          );
        })}
      </Tag>
    );
  }

  return (
    <Tag className="space-y-3">
      {block.items.map((it, i) => (
        <li key={i} className="flex gap-3.5">
          <ListMarker style={block.style} index={i} />
          <span
            className={cn(
              "min-w-0 text-[16px] leading-relaxed text-steel-300 sm:text-base",
              block.style === "number" && "pt-0.5"
            )}
          >
            {it.text}
          </span>
        </li>
      ))}
    </Tag>
  );
}

/* ── callout ─────────────────────────────────────────────────────────────── */

const calloutTone: Record<
  Block<"callout">["tone"],
  { icon: LucideIcon; frame: string; bar: string; chip: string }
> = {
  info: {
    icon: Info,
    frame: "border-volt-500/30 bg-volt-500/[0.07]",
    bar: "bg-volt-500",
    chip: "bg-volt-500/15 text-volt-400 [.light_&]:text-volt-600",
  },
  success: {
    icon: ShieldCheck,
    frame: "border-aurora-500/30 bg-aurora-500/[0.07]",
    bar: "bg-aurora-500",
    chip: "bg-aurora-500/15 text-aurora-400 [.light_&]:text-aurora-600",
  },
  warning: {
    icon: AlertTriangle,
    frame: "border-[#f5b942]/35 bg-[#f5b942]/[0.08]",
    bar: "bg-[#f5b942]",
    chip: "bg-[#f5b942]/15 text-[#f5b942] [.light_&]:text-[#9a6200]",
  },
};

function CalloutBlock({ block }: { block: Block<"callout"> }) {
  const t = calloutTone[block.tone] ?? calloutTone.info;
  const Icon = t.icon;
  return (
    <aside
      className={cn(
        "relative flex gap-4 overflow-hidden rounded-2xl border p-5 pl-6 sm:p-6 sm:pl-7",
        t.frame
      )}
    >
      <span aria-hidden className={cn("absolute inset-y-0 left-0 w-1", t.bar)} />
      <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl", t.chip)}>
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <div className="min-w-0 pt-1">
        {block.title && (
          <p className="font-display text-[16px] font-bold leading-snug text-white">
            {block.title}
          </p>
        )}
        <p
          className={cn(
            "text-[15px] leading-relaxed text-steel-300",
            block.title && "mt-1.5"
          )}
        >
          {block.text}
        </p>
      </div>
    </aside>
  );
}

/* ── stats ───────────────────────────────────────────────────────────────── */

const statBars = ["bg-volt-500", "bg-iris-500", "bg-aurora-500"];

function StatsBlock({ block }: { block: Block<"stats"> }) {
  const n = block.items.length;
  const odd = n % 2 === 1;
  // 2-up on phones; 3-up from sm when the count divides by 3, else stays 2-up.
  const threeUp = n % 3 === 0;
  return (
    <div className={cn("grid grid-cols-2 gap-3 sm:gap-4", threeUp && "sm:grid-cols-3")}>
      {block.items.map((s, i) => (
        <div
          key={i}
          className={cn(
            "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] px-4 pb-4 pt-5 transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]",
            // no lonely orphan on the 2-up phone grid
            odd && i === n - 1 && "col-span-2",
            odd && i === n - 1 && threeUp && "sm:col-span-1"
          )}
        >
          <span
            aria-hidden
            className={cn(
              "absolute inset-x-4 top-0 h-[2px] rounded-b-full transition-all duration-500 group-hover:inset-x-0",
              statBars[i % statBars.length]
            )}
          />
          <p className="break-words font-display text-[1.45rem] font-bold leading-tight tracking-tight text-white sm:text-[1.7rem]">
            {s.value}
          </p>
          <p className="mt-1.5 text-[13px] leading-snug text-steel-400">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

/* ── image ───────────────────────────────────────────────────────────────── */

/**
 * "contain" images are artwork on a baked-in white background (product shots,
 * brochure covers). They sit on a plate that hugs the image (never a
 * full-width white slab, which in the dark theme was the brightest thing on
 * the page), in a soft platinum rather than pure white, with the photo
 * multiply-blended so its own white melts into the plate.
 */
function ImageBlock({ block }: { block: Block<"image"> }) {
  const src = asset(block.src);
  const contain = block.fit === "contain";
  return (
    <figure className="min-w-0">
      {contain ? (
        <div className="group relative mx-auto w-fit max-w-full overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(ellipse_at_50%_40%,#ffffff_0%,#f1f3f6_60%,#e3e7ed_100%)] p-4 shadow-card sm:p-6">
          <img
            src={src}
            alt={block.alt}
            loading="lazy"
            decoding="async"
            className="mx-auto block max-h-60 w-auto max-w-full object-contain mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-[1.04] sm:max-h-72"
          />
        </div>
      ) : (
        <div className="force-dark group relative overflow-hidden rounded-3xl border border-white/10 bg-ink-900 shadow-card">
          <img
            src={src}
            alt={block.alt}
            loading="lazy"
            decoding="async"
            className="block max-h-[36rem] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-pure/10"
          />
        </div>
      )}
      {block.caption && (
        <figcaption
          className={cn(
            "mt-3 px-1 text-[13px] leading-relaxed text-steel-500",
            contain && "mx-auto max-w-md text-center"
          )}
        >
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}

/* ── faq ─────────────────────────────────────────────────────────────────── */

function FaqBlock({ block }: { block: Block<"faq"> }) {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();
  const base = useId();

  return (
    <div className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
      {block.items.map((it, i) => {
        const isOpen = open === i;
        const btnId = `${base}-q${i}`;
        const panelId = `${base}-a${i}`;
        return (
          <div key={i} className={cn("transition-colors duration-300", isOpen && "bg-white/[0.03]")}>
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-start justify-between gap-4 px-4 py-4 text-left sm:px-6 sm:py-5"
              >
                <span className="font-display text-[16px] font-bold leading-snug text-white sm:text-[17px]">
                  {it.q}
                </span>
                <span
                  className={cn(
                    "grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-all duration-300",
                    isOpen
                      ? "rotate-45 border-iris-500/45 bg-iris-500/15 text-iris-300 [.light_&]:text-iris-600"
                      : "border-white/15 text-steel-300 group-hover:border-white/30 group-hover:text-white"
                  )}
                >
                  <Plus className="h-3.5 w-3.5" />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  key="panel"
                  initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: reduce ? 0.12 : 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-4 pb-5 text-[15px] leading-relaxed text-steel-300 sm:px-6">
                    {it.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

/* ── table ───────────────────────────────────────────────────────────────── */

/** A short value that starts with a number ("3.5", "1,700", "80 dB(A)"). */
const NUMERIC_CELL = /^[<>≈~±+−–-]?\s?\d[\d.,]*(\s?[^\s]{0,8}){0,2}$/;
/** A value cell longer than this reads as a phrase, not a value. */
const PROSE_CELL = 24;
/** Values this short never break mid-value ("135 dB(C)", "2.5 m/s²"). */
const SHORT_CELL = 14;
/** A number keeps its unit on the same line: "(2.5 m/s²)", "1 h 30 min". */
const glueUnits = (t: string) => t.replace(/(\d) (?=[^\s\d]\S{0,6}(?:[\s)]|$))/g, "$1\u00a0");

/**
 * Whether a scroll box overflows sideways, and whether it is scrolled to its
 * end. Measured rather than guessed from the breakpoint, so the "scroll
 * sideways" hint shows exactly when a table really is wider than its frame.
 */
function useSideScroll(ref: RefObject<HTMLElement>) {
  const [state, setState] = useState({ overflow: false, atEnd: true });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const overflow = el.scrollWidth > el.clientWidth + 1;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
      setState((s) => (s.overflow === overflow && s.atEnd === atEnd ? s : { overflow, atEnd }));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    el.addEventListener("scroll", update, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", update);
    };
  }, [ref]);
  return state;
}

/**
 * Column widths come from the content (auto table layout), not a fixed
 * per-column minimum, so a short numeric table fits a phone as it is. A table
 * with phrases in its value cells can't fit 320–400px without hiding a
 * column, so below `sm` it becomes one card per row instead. Anything still
 * wider than its frame scrolls inside it, with a measured hint and edge fade.
 */
function TableBlock({ block }: { block: Block<"table"> }) {
  const cols = block.head.length;
  // Numeric columns are right-aligned so their digits line up.
  const numeric = block.head.map(
    (_, c) =>
      c > 0 &&
      block.rows.length > 0 &&
      block.rows.every((r) => !r[c] || NUMERIC_CELL.test(r[c].trim()))
  );
  const prose = block.rows.some((r) =>
    r.some((cell, c) => c > 0 && cell.trim().length > PROSE_CELL)
  );
  const frameRef = useRef<HTMLDivElement>(null);
  const { overflow, atEnd } = useSideScroll(frameRef);

  return (
    <figure className="min-w-0">
      {block.caption && (
        <figcaption className="mb-3 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-steel-500">
          {block.caption}
        </figcaption>
      )}

      {/* Phones, phrase tables: one card per row. Short values sit beside
          their label, phrases below it; empty cells are left out. */}
      {prose && (
        <ul data-table-cards className="space-y-3 sm:hidden">
          {block.rows.map((row, r) => (
            <li
              key={r}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 pl-5"
            >
              <span
                aria-hidden
                className={cn("absolute inset-y-0 left-0 w-[3px]", statBars[r % statBars.length])}
              />
              <p className="font-display text-[15px] font-bold leading-snug text-white">
                {row[0]}
              </p>
              <dl className="mt-3 space-y-2.5 border-t border-white/10 pt-3">
                {row.slice(1).map((cell, j) => {
                  if (!cell.trim()) return null;
                  const short = cell.trim().length <= SHORT_CELL;
                  return (
                    <div
                      key={j}
                      className={short ? "flex items-baseline justify-between gap-4" : undefined}
                    >
                      <dt className="text-[12.5px] leading-snug text-steel-500">
                        {glueUnits(block.head[j + 1] ?? "")}
                      </dt>
                      <dd
                        className={cn(
                          "text-[14.5px] leading-snug text-steel-200",
                          short ? "shrink-0 text-right tabular-nums" : "mt-1"
                        )}
                      >
                        {glueUnits(cell)}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </li>
          ))}
        </ul>
      )}

      {/* The table. Scrolls sideways inside its own frame, never the page. */}
      <div className={cn("relative", prose && "hidden sm:block")}>
        <div
          ref={frameRef}
          role="region"
          aria-label={block.caption ?? "Table"}
          tabIndex={overflow ? 0 : undefined}
          className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02] [scrollbar-width:thin] focus:outline-none focus-visible:ring-2 focus-visible:ring-volt-400"
        >
          <table
            className="w-full border-collapse text-left text-[13.5px] tabular-nums sm:text-[14px]"
            // phrase tables only show from sm: keep their columns readable there
            style={prose ? { minWidth: `${cols * 7.5}rem` } : undefined}
          >
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.05]">
                {block.head.map((h, i) => (
                  <th
                    key={i}
                    scope="col"
                    className={cn(
                      "px-3 py-3 align-bottom text-[12.5px] font-semibold text-white sm:px-4 sm:text-[13px]",
                      // phones may wrap a short header too ("Hours per day")
                      h.length <= SHORT_CELL && "sm:whitespace-nowrap",
                      numeric[i] && "text-right"
                    )}
                  >
                    {glueUnits(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr
                  key={r}
                  className={cn(
                    "border-b border-white/[0.06] transition-colors last:border-0 hover:bg-white/[0.04]",
                    r % 2 === 1 && "bg-white/[0.025]"
                  )}
                >
                  {row.map((cell, c) =>
                    c === 0 ? (
                      <th
                        key={c}
                        scope="row"
                        className="px-3 py-3 align-top font-semibold text-steel-200 sm:px-4"
                      >
                        {glueUnits(cell)}
                      </th>
                    ) : (
                      <td
                        key={c}
                        className={cn(
                          "px-3 py-3 align-top leading-relaxed text-steel-300 sm:px-4",
                          cell.length <= SHORT_CELL && "whitespace-nowrap",
                          numeric[c] && "text-right"
                        )}
                      >
                        {glueUnits(cell)}
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Fade on the cut-off edge while there is more to the right. */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-px right-px w-12 rounded-r-2xl bg-gradient-to-l from-ink-950 to-transparent transition-opacity duration-300",
            overflow && !atEnd ? "opacity-90" : "opacity-0"
          )}
        />
      </div>
      {overflow && (
        <p
          data-scroll-hint
          className="mt-2 flex items-center gap-1.5 text-[12px] text-steel-500"
        >
          <MoveHorizontal className="h-3.5 w-3.5 shrink-0" />
          Scroll the table sideways to see every column.
        </p>
      )}
    </figure>
  );
}

/* ── vpm-chart ───────────────────────────────────────────────────────────── */

function VpmBlock() {
  return (
    <figure className="relative min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-5 xs:p-6 sm:p-7">
      <span
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-iris-500/10 blur-3xl"
      />
      <figcaption className="relative">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel-500">
          Old value vs new value
        </p>
        <p className="mt-2 font-display text-lg font-bold leading-snug text-white sm:text-xl">
          Hand-arm vibration value vs Vibration Peak Magnitude, by tool type
        </p>
        <p className="mt-2 text-[13.5px] leading-relaxed text-steel-400">
          Five tool types, measured two ways, in m/s². Two different scales, so
          two panels.
        </p>
      </figcaption>
      <VpmChart className="mt-6" />
    </figure>
  );
}

/* ── steps ───────────────────────────────────────────────────────────────── */

const stepAccent = [
  "from-volt-500 to-iris-500",
  "from-iris-500 to-aurora-500",
  "from-aurora-500 to-volt-500",
];

function StepsBlock({ block }: { block: Block<"steps"> }) {
  const n = block.items.length;
  return (
    <ol className="grid gap-4 sm:grid-cols-2">
      {block.items.map((s, i) => (
        <li
          key={i}
          className={cn("min-w-0", n % 2 === 1 && i === n - 1 && "sm:col-span-2")}
        >
          <div className="card-rich group h-full p-5 sm:p-6">
            <span aria-hidden className="shine-sweep pointer-events-none absolute inset-0" />
            <span
              aria-hidden
              className={cn(
                "absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r opacity-70 transition-opacity duration-500 group-hover:opacity-100",
                stepAccent[i % stepAccent.length]
              )}
            />
            <div className="relative flex items-center gap-3">
              <span
                className={cn(
                  // near-black on the pastel fill in both themes (ink-950 flips)
                  "grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br font-mono text-[13px] font-bold tabular-nums text-[#0e1116] transition-transform duration-500 group-hover:scale-110",
                  stepAccent[i % stepAccent.length]
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="min-w-0 font-display text-[16.5px] font-bold leading-snug text-white">
                {s.title}
              </p>
            </div>
            {s.points.length > 0 && (
              <ul className="relative mt-4 space-y-2.5 border-t border-white/10 pt-4">
                {s.points.map((pt, j) => (
                  <li key={j} className="flex items-start gap-2.5">
                    <span className="mt-[3px] grid h-4 w-4 shrink-0 place-items-center rounded-full bg-aurora-500/15 text-aurora-500 [.light_&]:text-aurora-600">
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    </span>
                    <span className="min-w-0 text-[14.5px] leading-relaxed text-steel-300">
                      {pt}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ── quote ───────────────────────────────────────────────────────────────── */

function QuoteBlock({ block }: { block: Block<"quote"> }) {
  return (
    <figure className="relative overflow-hidden rounded-3xl border border-iris-500/25 bg-iris-500/[0.06] p-6 pl-7 sm:p-9 sm:pl-10">
      <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-iris-400 to-volt-500" />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-iris-500/15 blur-3xl"
      />
      <Quote
        aria-hidden
        className="relative h-9 w-9 rotate-180 text-iris-400 [.light_&]:text-iris-600 sm:h-11 sm:w-11"
        fill="currentColor"
        strokeWidth={0}
      />
      <blockquote className="relative mt-3 sm:mt-4">
        <p className="font-display text-xl font-semibold leading-snug tracking-tight text-white sm:text-2xl sm:leading-snug">
          {block.text}
        </p>
      </blockquote>
      {block.cite && (
        <figcaption className="relative mt-4 flex items-center gap-2.5 text-sm font-medium text-steel-400">
          <span aria-hidden className="h-px w-6 bg-iris-400/60" />
          {block.cite}
        </figcaption>
      )}
    </figure>
  );
}
