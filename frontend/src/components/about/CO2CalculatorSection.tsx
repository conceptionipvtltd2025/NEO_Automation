import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import {
  Target,
  Leaf,
  Route,
  Calculator,
  ChevronRight,
  BadgeCheck,
  TrendingDown,
  Zap,
  ArrowRight,
  Maximize2,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { Lightbox, type LightboxItem } from "@/components/ui/Lightbox";
import { asset } from "@/lib/asset";

/**
 * CO₂ Calculator & Strategic Partnership Selling — /about#co2-calculator.
 *
 * Copy is Atlas Copco's own, sent to Neo by Atlas Copco India (IMS Manager,
 * Industrial Technique) on 22 Sept 2026 as two slides, and set here as supplied
 * (only a missing article and a closing quote were fixed). The PCF tool and its
 * ISO 14067 certification belong to the Atlas Copco Group, NOT to Neo — Neo is
 * not ISO-registered, so keep every certification line attributed to the Group.
 *
 * The calculator screenshot is cropped from the second slide; the Atlas Copco
 * user's name and photo were blanked out of it (and of the full slide) before
 * publishing.
 *
 * The screenshot and both slides open in the in-page <Lightbox>, never as a raw
 * PNG in a new tab: on a phone that tab had no way back to the page. In the
 * viewer the browser's Back gesture closes the image and keeps the visitor here.
 */

type Step = { icon: LucideIcon; text: string; accent: string };

// Slide 1 — "Strategic Partnership Selling for Sustainability", in slide order.
const steps: Step[] = [
  {
    icon: Target,
    accent: "from-volt-500 to-iris-500",
    text: "It is an innovative sales process that supports customers to reach their sustainability targets and thus contributing to the transition to a low-carbon society.",
  },
  {
    icon: Leaf,
    accent: "from-aurora-500 to-volt-500",
    text: "Aims to reduce CO2 emissions in the use phase of the products and service.",
  },
  {
    icon: Route,
    accent: "from-iris-500 to-aurora-500",
    text: "The impact plan clearly shows how to reduce the customer’s CO2 emissions and waste by implementing Atlas Copco products and services.",
  },
  {
    icon: Calculator,
    accent: "from-volt-500 to-aurora-500",
    text: "The quantification of the benefits is done using a CO2 calculator, which applies parameters from the Group’s Product Carbon Footprint (PCF) tool. (ISO 14067 certified)",
  },
];

// Slide 2 — "CO2 Calculator – Intro", in slide order.
const intro = [
  "CO2 Calculator is a web tool derived from the “Product Carbon Footprint ‘PCF’ calculator”.",
  "PCF is ISO 14067 certified by Carbon Trust.",
  "Quantify CO2 emissions, energy & related cost savings by migrating to modern & most efficient assembly technologies.",
  "We get all this without compromising the traditional benefits such as, for example, productivity, quality, and connectivity.",
];

// The tool's own module tabs, as shown in the screenshot.
const modules = {
  live: ["Transformations", "Service"],
  upcoming: ["Production optimization", "Rework area", "Training"],
};

const SCREEN = {
  src: "images/co2/co2-calculator-screen.png",
  title: "CO2 Calculator · Atlas Copco",
  alt: "The Atlas Copco CO2 Calculator web tool: About page with Definitions, Assumptions, How to use and upcoming modules",
};

const slides = [
  {
    src: "images/co2/sps-sustainability-slide.png",
    title: "Strategic Partnership Selling for Sustainability",
  },
  {
    src: "images/co2/co2-calculator-intro-slide.png",
    title: "CO2 Calculator – Intro",
  },
];

// Everything the viewer can page through: the screenshot (index 0), then the
// two slides (index 1 and 2) — so slide card `i` opens at `i + 1`.
const viewerItems: LightboxItem[] = [
  { src: asset(SCREEN.src), alt: SCREEN.alt, title: SCREEN.title },
  ...slides.map((s) => ({
    src: asset(s.src),
    alt: `Atlas Copco slide: ${s.title}`,
    title: s.title,
  })),
];

// Horizontal indents that trace the slide's curved spine: in, out, out, in.
const INDENT = ["sm:ml-0", "sm:ml-10 lg:ml-16", "sm:ml-10 lg:ml-16", "sm:ml-0"];

function StepRow({ step, index }: { step: Step; index: number }) {
  const reduce = useReducedMotion();
  const Icon = step.icon;
  return (
    <motion.li
      initial={reduce ? { opacity: 0 } : { opacity: 0, x: -36 }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative flex items-center gap-4 sm:gap-6 ${INDENT[index]}`}
    >
      {/* Node — the slide's open circle, filled with an icon and a pulse ring. */}
      <span className="relative z-10 grid h-14 w-14 shrink-0 place-items-center sm:h-[72px] sm:w-[72px]">
        <span
          aria-hidden
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${step.accent} opacity-25 blur-md transition-opacity duration-500 group-hover:opacity-60`}
        />
        <span className="relative grid h-full w-full place-items-center rounded-full border-2 border-volt-400/60 bg-ink-950 shadow-card transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:border-volt-400">
          <Icon className="h-6 w-6 text-volt-400 transition-colors duration-300 group-hover:text-volt-500 sm:h-7 sm:w-7" />
        </span>
        {!reduce && (
          <span
            aria-hidden
            className="absolute inset-0 rounded-full border border-volt-400/50 opacity-0 group-hover:animate-ping group-hover:opacity-100"
          />
        )}
      </span>

      {/* Bar — the slide's teal band, as a lifted glass card. */}
      <div className="shine-sweep relative min-w-0 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 group-hover:border-volt-400/40 group-hover:bg-white/[0.05] group-hover:shadow-[0_22px_50px_-24px_rgb(var(--volt)/0.55)] sm:p-5">
        <span
          aria-hidden
          className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${step.accent}`}
        />
        <p className="pl-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-steel-500">
          Step {String(index + 1).padStart(2, "0")}
        </p>
        <p className="mt-1.5 pl-2 text-[14.5px] leading-relaxed text-steel-200 sm:text-base">
          {step.text}
        </p>
      </div>
    </motion.li>
  );
}

export function CO2CalculatorSection() {
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 80%", "end 55%"],
  });
  const spine = useSpring(scrollYProgress, { stiffness: 90, damping: 28, restDelta: 0.001 });
  const [viewing, setViewing] = useState<number | null>(null);

  return (
    <section
      id="co2-calculator"
      className="relative overflow-hidden py-10 sm:py-16"
    >
      {/* Soft mint/sky ambience behind the whole section. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-24 h-80 w-80 rounded-full bg-aurora-500/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-10 h-96 w-96 rounded-full bg-volt-500/10 blur-3xl"
      />

      <div className="container-px relative">
        <SectionHeading
          align="center"
          eyebrow="Sustainability with Atlas Copco"
          title="Strategic Partnership Selling for Sustainability"
          subtitle="How Atlas Copco helps customers measure and reduce the CO2 their assembly lines emit — and the CO2 Calculator that puts a number on it."
        />

        {/* ── Part 1: the four-step SPS spine ─────────────────────────────── */}
        <div className="mx-auto mt-12 max-w-4xl sm:mt-14">
          <ol ref={listRef} className="relative space-y-5 sm:space-y-6">
            {/* Faint rail + scroll-drawn bright rail through the node centres
                (28px / 36px = half the node width). */}
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-7 left-7 top-7 w-px -translate-x-1/2 bg-white/10 sm:hidden"
            />
            <motion.span
              aria-hidden
              style={reduce ? { scaleY: 1 } : { scaleY: spine }}
              className="pointer-events-none absolute bottom-7 left-7 top-7 w-0.5 -translate-x-1/2 origin-top rounded-full bg-gradient-to-b from-volt-400 via-aurora-400 to-iris-400 sm:hidden"
            />
            {/* From sm the nodes step in and out like the slide, so the spine
                is the slide's curve: a cubic from the first node's centre
                (x=36) bowing out to the indented nodes and back. The viewBox is
                px wide and %-tall (preserveAspectRatio none), and the bow is
                indent / 0.72 — the cubic's reach at the middle rows. */}
            {[
              { cls: "hidden sm:block lg:hidden", bow: 92 },
              { cls: "hidden lg:block", bow: 125 },
            ].map((c) => (
              <svg
                key={c.bow}
                aria-hidden
                viewBox="0 0 180 100"
                preserveAspectRatio="none"
                className={`pointer-events-none absolute inset-y-0 left-0 h-full w-[180px] ${c.cls}`}
              >
                <path
                  d={`M36 12 C${c.bow} 36 ${c.bow} 64 36 88`}
                  fill="none"
                  style={{ stroke: "rgb(var(--fg) / 0.12)" }}
                  strokeWidth={2}
                  vectorEffect="non-scaling-stroke"
                />
                <motion.path
                  d={`M36 12 C${c.bow} 36 ${c.bow} 64 36 88`}
                  fill="none"
                  stroke={`url(#co2-spine-${c.bow})`}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  style={{ pathLength: reduce ? 1 : spine }}
                />
                <defs>
                  <linearGradient id={`co2-spine-${c.bow}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" style={{ stopColor: "rgb(var(--volt))" }} />
                    <stop offset="55%" style={{ stopColor: "rgb(var(--aurora))" }} />
                    <stop offset="100%" style={{ stopColor: "rgb(var(--iris))" }} />
                  </linearGradient>
                </defs>
              </svg>
            ))}
            {steps.map((s, i) => (
              <StepRow key={s.text} step={s} index={i} />
            ))}
          </ol>
        </div>

        {/* ── Part 2: CO2 Calculator intro ────────────────────────────────── */}
        <div className="mt-16 grid items-center gap-10 sm:mt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14">
          <div className="min-w-0">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-aurora-500/30 bg-aurora-500/10 px-3 py-1 text-[12px] font-semibold uppercase tracking-wider text-white">
                <Calculator className="h-3.5 w-3.5 text-aurora-400" /> CO2 Calculator
              </span>
            </Reveal>
            <Reveal delay={0.06}>
              <h3 className="mt-4 font-display text-[clamp(1.6rem,3.4vw,2.4rem)] font-bold leading-tight text-gradient">
                CO2 Calculator – Intro
              </h3>
            </Reveal>

            <StaggerGroup className="mt-6 space-y-3">
              {intro.map((line) => (
                <StaggerItem key={line}>
                  <div className="group flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-aurora-500/40 hover:bg-white/[0.04]">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-aurora-500/15 text-aurora-400 transition-transform duration-300 group-hover:translate-x-0.5">
                      <ChevronRight className="h-4 w-4" />
                    </span>
                    <p className="text-[14.5px] leading-relaxed text-steel-200 sm:text-[15.5px]">
                      {line}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>

          {/* Screenshot in a browser frame, with floating proof chips. */}
          <Reveal delay={0.1} className="min-w-0">
            <div className="relative px-2 pb-8 pt-6 sm:px-6">
              <motion.button
                type="button"
                onClick={() => setViewing(0)}
                aria-label={`Enlarge screenshot: ${SCREEN.title}`}
                whileHover={reduce ? undefined : { y: -6, rotateX: 2, rotateY: -3 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                style={{ transformPerspective: 1200 }}
                className="group relative block w-full cursor-zoom-in overflow-hidden rounded-2xl border border-white/10 bg-ink-900 lg:cursor-pointer text-left shadow-card transition-colors duration-300 hover:border-volt-400/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-volt-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
              >
                <span className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-neo-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#f5b942]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-aurora-500" />
                  <span className="ml-3 min-w-0 truncate rounded-md bg-white/[0.05] px-3 py-1 text-[11.5px] text-steel-400">
                    {SCREEN.title}
                  </span>
                </span>
                <span className="relative block">
                  <img
                    src={asset(SCREEN.src)}
                    alt={SCREEN.alt}
                    loading="lazy"
                    width={649}
                    height={370}
                    className="block aspect-[649/370] w-full bg-pure object-cover"
                  />
                  {/* "Click to enlarge": on hover/focus with a mouse, always
                      shown on touch screens, where there is no hover to find it.
                      Not from lg: the source is only 649px wide, so the frame
                      already shows it at about full size and the viewer can't
                      honestly make it bigger. */}
                  <span className="pointer-events-none absolute bottom-3 right-3 inline-flex lg:hidden translate-y-1 items-center gap-1.5 rounded-full border border-white/20 bg-[#0e1014]/75 px-3 py-1.5 text-[12px] font-semibold text-pure opacity-0 backdrop-blur-sm transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">
                    <Maximize2 className="h-3.5 w-3.5" /> Click to enlarge
                  </span>
                </span>
              </motion.button>

              <motion.div
                animate={reduce ? undefined : { y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="glass-strong absolute -top-1 right-0 flex items-center gap-2 rounded-xl px-3 py-2 shadow-card sm:-right-2"
              >
                <BadgeCheck className="h-4 w-4 text-aurora-400" />
                <span className="text-[12px] font-semibold text-white">
                  PCF · ISO 14067 · Carbon Trust
                </span>
              </motion.div>
              <motion.div
                animate={reduce ? undefined : { y: [0, 8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                className="glass-strong absolute bottom-0 left-0 flex items-center gap-3 rounded-xl px-3 py-2 shadow-card sm:-left-2"
              >
                <span className="flex items-center gap-1 text-[12px] font-semibold text-white">
                  <TrendingDown className="h-4 w-4 text-aurora-400" /> CO2
                </span>
                <span className="h-4 w-px bg-white/15" />
                <span className="flex items-center gap-1 text-[12px] font-semibold text-white">
                  <Zap className="h-4 w-4 text-volt-400" /> Energy & cost
                </span>
              </motion.div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 px-2 sm:px-6">
              {modules.live.map((m) => (
                <span
                  key={m}
                  className="rounded-full border border-volt-500/30 bg-volt-500/10 px-3 py-1 text-[12.5px] font-medium text-white"
                >
                  {m}
                </span>
              ))}
              {modules.upcoming.map((m) => (
                <span
                  key={m}
                  className="rounded-full border border-dashed border-white/15 px-3 py-1 text-[12.5px] text-steel-400"
                >
                  {m} · upcoming
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        {/* ── Part 3: the original slides + CTA ───────────────────────────── */}
        <div className="mt-14 grid gap-6 sm:mt-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-center">
          <StaggerGroup className="grid grid-cols-2 gap-3 sm:gap-5">
            {slides.map((s, i) => (
              <StaggerItem key={s.src} className="min-w-0">
                {/* flex-col, not block: a <button> stretched to the row height
                    centres its content vertically, which dropped the shorter
                    card's slide below its top edge. */}
                <button
                  type="button"
                  onClick={() => setViewing(i + 1)}
                  aria-label={`Enlarge slide: ${s.title}`}
                  className="group flex h-full w-full cursor-zoom-in flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] text-left transition-all duration-300 hover:-translate-y-1 hover:border-volt-400/40 hover:shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-volt-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
                >
                  <span className="relative block overflow-hidden bg-pure">
                    <img
                      src={asset(s.src)}
                      alt={`Atlas Copco slide: ${s.title}`}
                      loading="lazy"
                      className="aspect-[16/9] w-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0e1014]/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                    />
                    {/* Expand affordance: the card opens larger, in place. */}
                    <span className="pointer-events-none absolute bottom-2 right-2 grid h-8 w-8 translate-y-1 place-items-center rounded-lg border border-white/20 bg-[#0e1014]/70 text-pure opacity-0 backdrop-blur-sm transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 sm:bottom-3 sm:right-3 sm:h-9 sm:w-9 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">
                      <Maximize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </span>
                  </span>
                  <span className="flex flex-1 items-center justify-between gap-2 p-3 sm:p-4">
                    <span className="min-w-0 text-[12.5px] font-medium leading-snug text-steel-200 sm:text-sm">
                      {s.title}
                    </span>
                    <span className="hidden shrink-0 items-center gap-1 text-[12px] font-medium text-steel-400 transition-colors duration-300 group-hover:text-white sm:inline-flex">
                      Expand
                      <Maximize2 className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110" />
                    </span>
                  </span>
                </button>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <Reveal delay={0.1}>
            <div className="gradient-border relative overflow-hidden p-6 sm:p-8">
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-steel-500">
                Source · Atlas Copco India
              </p>
              <h4 className="mt-3 font-display text-xl font-bold leading-snug text-white sm:text-2xl">
                Want to see the CO2 impact of upgrading your line?
              </h4>
              <p className="mt-3 text-sm leading-relaxed text-steel-400">
                Tell us about your current tools and stations, and we will take
                it forward with Atlas Copco.
              </p>
              <Link to="/inquiry" className="btn-primary mt-6">
                Talk to us <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>

      <Lightbox
        items={viewerItems}
        index={viewing}
        onClose={() => setViewing(null)}
        onIndexChange={setViewing}
      />
    </section>
  );
}
