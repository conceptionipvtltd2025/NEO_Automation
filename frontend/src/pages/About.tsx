import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import {
  Target,
  Eye,
  Rocket,
  Heart,
  Award,
  Users,
  ShieldCheck,
  BadgeCheck,
  MapPin,
  Wrench,
  Bot,
  GraduationCap,
  HeartPulse,
  Droplets,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { CertificatesSection } from "@/components/Certificates";
import { AboutHeaderArt } from "@/components/ui/HeaderArt";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { SectionHeading } from "@/components/SectionHeading";
import { StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { site } from "@/data/site";
import { asset } from "@/lib/asset";

// Neo is not itself ISO-registered — our OEM partners are. Keep every claim
// here to what Neo can actually evidence: appointment letters, training
// certificates, calibration records and installed base.
const credentials = [
  { icon: ShieldCheck, title: "Certified OEM Equipment", text: "Every product we supply is built and certified by its manufacturer — genuine, never grey imports." },
  { icon: BadgeCheck, title: "Authorised Distributor", text: "Officially appointed partner for ten global engineering brands." },
  { icon: Users, title: "OEM-Trained Engineers", text: "Factory-certified specialists for installation and calibration." },
  // "Gujarat Service", not "Pan-India": the GESIPA distributor certificate
  // appoints Neo for the Gujarat region specifically, and Gujarat is where the
  // workshop and the engineers actually are. Claiming national coverage was
  // broader than anything Neo can evidence.
  { icon: MapPin, title: "Gujarat Service Coverage", text: "On-site engineers across Ahmedabad, Sanand, Halol, Vadodara and the state's manufacturing belt." },
  // Replaced "Next-Day Spares" — a delivery-time promise Neo cannot guarantee
  // and would be held to. The in-house workshop is a concrete, verifiable
  // capability that the /nsw page already documents in detail.
  { icon: Wrench, title: "In-House Service Workshop", text: "Nut runners stripped, repaired and torque-calibrated on our own bench — with documented results." },
  { icon: Award, title: "1200+ Installations", text: "A proven track record across automotive, aerospace & beyond." },
];

// Each milestone shows either a partner brand logo (from public/images/brands)
// or, for company milestones with no single brand, an accent icon.
type Milestone = {
  year: string;
  title: string;
  text: string;
  logo?: string; // public path to a brand logo
  brand?: string; // wordmark fallback + alt text
  color?: string; // brand accent — the plate glow + wordmark rule
  icon?: LucideIcon; // used when there is no brand logo
};

const timeline: Milestone[] = [
  {
    year: "2007",
    title: "The journey begins",
    text: "Founded in Ahmedabad — appointed distributor for Miranda tools and John Guest aluminium compressed-air piping.",
    logo: "images/brands/john-guest.png",
    brand: "John Guest",
    color: "#0e7ec4",
  },
  {
    year: "2009",
    title: "Atlas Copco tools & assembly",
    text: "Became distributor for Atlas Copco power tools and assembly systems.",
    logo: "images/brands/atlas-copco.png",
    brand: "Atlas Copco",
    color: "#a5c532",
  },
  {
    year: "2013",
    title: "GEDORE hand tools",
    text: "Added GEDORE premium hand tools and workshop storage to the portfolio.",
    logo: "images/brands/gedore.png",
    brand: "GEDORE",
    color: "#1e4d9b",
  },
  {
    year: "2014",
    title: "GESIPA riveting technology",
    text: "Became distributor for GESIPA blind-rivet and rivet-nut setting tools.",
    logo: "images/brands/gesipa.png",
    brand: "GESIPA",
    color: "#2ed658",
  },
  {
    year: "2016",
    title: "Atlas Copco bolting solutions",
    text: "Started supplying bolting and tightening solutions from Atlas Copco.",
    logo: "images/brands/atlas-copco.png",
    brand: "Atlas Copco",
    color: "#a5c532",
  },
  {
    year: "2017",
    title: "10 years of milestones",
    text: "Celebrated a decade of delivering precision, traceable tooling to Indian industry.",
    logo: "images/milestones/10-years.png",
    brand: "10 Years",
    color: "#c8a24e",
  },
  {
    year: "2019",
    title: "eepos aluminium cranes",
    text: "Became promoter for the eepos aluminium crane system, expanding into material handling.",
    logo: "images/brands/eepos.png",
    brand: "eepos",
    color: "#1b9bd7",
  },
  {
    year: "2022",
    title: "Nuclear Service Workshop",
    text: "Established the Nuclear Service Workshop for Atlas Copco.",
    logo: "images/brands/atlas-copco.png",
    brand: "Atlas Copco",
    color: "#a5c532",
  },
  {
    year: "2024",
    title: "Hoffmann Group hand tools",
    text: "Added Hoffmann Group industrial hand tools and workstation solutions.",
    logo: "images/brands/hoffmann-group.png",
    brand: "Hoffmann Group",
    color: "#ff7300",
  },
  {
    year: "2026",
    title: "AGV / AMR Solutions",
    text: "Expanded into automated guided vehicles and autonomous mobile robots for smart intralogistics.",
    icon: Bot,
  },
];

// The array above is authored chronologically because that is how the client
// maintains it — but the page shows it NEWEST FIRST, so a visitor lands on
// where Neo is today and reads back to 2007.
const timelineNewestFirst = [...timeline].reverse();

// The three CSR projects, in the order the /csr page tells them. Copy is kept
// to what the photographs actually evidence — no donor counts, no litres.
const csrTeasers = [
  {
    title: "Blood Donation Camp",
    text: "Run at our own premises with the Rotary Club of Ahmedabad Majesty Stars, with Indian Red Cross certification for every donor.",
    image: "images/csr/blood-donation-team-thumb.jpg",
    alt: "The Neo Automation team and Rotary volunteers at the blood donation camp",
    icon: HeartPulse,
    href: "/csr#projects",
  },
  {
    title: "Water for All",
    text: "A public drinking-water parab donated and inaugurated at Sayona City, Chankyapuri, in July 2025.",
    image: "images/csr/water-for-all-parab-thumb.jpg",
    alt: "The donated drinking-water parab, garlanded at its inauguration",
    icon: Droplets,
    href: "/csr#projects",
  },
  {
    title: "Sanand Girls School",
    text: "Kurtis handed to the students of the JDG girls school in Sanand, class by class.",
    image: "images/csr/sanand-girls-kurti-thumb.jpg",
    alt: "Students of the JDG girls school in Sanand with the donated kurtis",
    icon: GraduationCap,
    href: "/csr#projects",
  },
];

const values = [
  { icon: Heart, title: "Integrity", text: "Genuine equipment, honest advice, always." },
  { icon: Rocket, title: "Precision", text: "Obsessed with accuracy and reliability." },
  { icon: Users, title: "Partnership", text: "We invest in our people and processes so our team consistently exceeds — not just meets — customer expectations." },
  { icon: Award, title: "Excellence", text: "World-class brands, world-class service." },
];

/** Geometry of the logo plate, shared by all three render branches below. It
 *  used to be typed out three times, which meant any sizing tweak had to be
 *  made in triplicate (and inevitably drifted). One constant, one box.
 *  `group-hover:` tilts + lifts the plate with the card (see the milestone
 *  hover choreography) — transform only, so nothing re-lays-out. */
const PLATE_BOX =
  "h-24 w-[200px] shrink-0 rounded-xl shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:-translate-y-1 group-hover:rotate-[-1.25deg] group-hover:scale-[1.035] sm:h-28 sm:w-[248px]";

/** The hero of each milestone row: a large WIDE literal-white plate carrying the
 *  partner logo (object-contain so a near-square logo and a 7:1 wordmark share
 *  one optical box), a wordmark fallback if the PNG is missing, or a dark ink
 *  medallion for company milestones that have no single brand. Mirrors
 *  BrandLogoPlate: bg-pure (never bg-white, which flips to near-ink in the light
 *  theme and swallows dark artwork), ring-1 ring-black/10, shadow-sm. */
function TimelineLogoPlate({
  logo,
  icon: Icon,
  label,
  accent,
}: {
  logo?: string;
  icon?: LucideIcon;
  label?: string;
  accent: string;
}) {
  const [failed, setFailed] = useState(false);

  // Company milestone (no brand logo): a dark medallion + accent glow, so a
  // brand-less row reads as a "company chapter", not a missing/empty plate.
  if (!logo && Icon) {
    return (
      <span
        className={`${PLATE_BOX} relative grid place-items-center overflow-hidden border border-neo-600/30 bg-ink-950`}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30 transition-opacity duration-500 group-hover:opacity-50"
          style={{ background: `radial-gradient(circle at 50% 50%, ${accent}, transparent 70%)` }}
        />
        <Icon className="relative h-9 w-9 text-neo-400" />
      </span>
    );
  }

  // Logo present and loading fine.
  if (logo && !failed) {
    return (
      <span
        className={`${PLATE_BOX} inline-flex items-center justify-center overflow-hidden bg-pure p-5 ring-1 ring-black/10 sm:p-6`}
      >
        <img
          src={asset(logo)}
          alt={label ? `${label} logo` : ""}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-contain"
        />
      </span>
    );
  }

  // Missing PNG (e.g. john-guest.png) → wordmark: constant dark ink on the same
  // white plate, underlined in the brand's own hex (several brand hexes are
  // unreadable as text, so the ink carries legibility and the hex only rules).
  return (
    <span
      className={`${PLATE_BOX} inline-flex items-center justify-center bg-pure p-5 ring-1 ring-black/10 sm:p-6`}
    >
      <span
        className="border-b-2 pb-0.5 text-center font-display text-xl font-bold tracking-tight text-[#12141a] sm:text-2xl"
        style={{ borderColor: accent }}
      >
        {label}
      </span>
    </span>
  );
}

/* ── Timeline geometry ────────────────────────────────────────────────────
   The node column is a fixed 72px GRID TRACK (not a width on the node itself),
   so the cap, the spine rail and the cards are aligned by the grid rather than
   by hand-tuned offsets — there is exactly one number to change.

   Under lg: `grid-cols-[72px_1fr]`, node column first, rail at `left-9` (36px)
   with `-translate-x-1/2` — i.e. 72/2, dead centre of the track, and the node
   is `justify-center` within it, so cap centre and rail are the same axis.

   From lg: `grid-cols-[1fr_72px_1fr]` makes it a true two-sided timeline with
   the node track in the middle, so the rail is simply `left-1/2`. Even rows put
   their card in column 1 (right-aligned), odd rows in column 3; the unused side
   is an empty spacer, which keeps each row's height driven by its own card and
   the vertical rhythm (pb-12) identical on both sides.

   `pt-6` (lg:`pt-7`) on the node track is not arbitrary: it matches the card's
   `p-5`/`sm:p-6` top padding plus half the year line, so the cap sits on the
   same optical baseline as the milestone's year — not floating above it.      */
const NODE_TRACK = "grid-cols-[72px_minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_72px_minmax(0,1fr)]";

/**
 * Lift a brand hex to a minimum HSL lightness so it stays readable as TEXT on
 * the dark card. The accents are logo colours, not UI colours: GEDORE's navy
 * (#1e4d9b) measures 2.17:1 against its own tinted chip — well under AA — while
 * Atlas Copco's lime is already 7.7:1. Raising only the too-dark ones keeps
 * each brand recognisable instead of flattening them all to one safe tint.
 * Hue and saturation are untouched; lightness only.
 */
function readableAccent(hex: string, minL = 0.58): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return hex;
  const int = parseInt(m[1], 16);
  const r = ((int >> 16) & 255) / 255;
  const g = ((int >> 8) & 255) / 255;
  const b = (int & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (l >= minL) return hex;
  const d = max - min;
  if (d === 0) {
    const v = Math.round(minL * 255);
    return `rgb(${v} ${v} ${v})`;
  }
  const s = d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h *= 60;
  if (h < 0) h += 360;
  // Back to RGB at the raised lightness.
  const c = (1 - Math.abs(2 * minL - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const mm = minL - c / 2;
  const [r1, g1, b1] =
    h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x]
    : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  const to = (v: number) => Math.round((v + mm) * 255);
  return `rgb(${to(r1)} ${to(g1)} ${to(b1)})`;
}
const NODE_SIZE = "h-11 w-11";

/** One milestone's spine node: a graduation cap on an accent-tinted plate,
 *  replacing the old coloured dot. It lights up on its OWN `useInView` rather
 *  than from a shared parent scroll value, so a node activates exactly when its
 *  card reaches the reading line regardless of how fast the page is scrolled. */
function MilestoneNode({ accent, active }: { accent: string; active: boolean }) {
  return (
    <span
      className={`relative grid ${NODE_SIZE} place-items-center rounded-2xl border bg-ink-950 transition-[transform,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${
        active ? "scale-110" : "scale-95"
      }`}
      style={{
        borderColor: active ? `${accent}99` : "rgb(255 255 255 / 0.10)",
        boxShadow: active
          ? `0 0 0 5px rgb(var(--ink-950)), 0 0 22px -2px ${accent}80`
          : "0 0 0 5px rgb(var(--ink-950))",
      }}
    >
      {/* Accent wash behind the cap — fades in with the active state. */}
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-500 ${
          active ? "opacity-100" : "opacity-0"
        }`}
        style={{ background: `radial-gradient(circle at 50% 35%, ${accent}40, transparent 72%)` }}
      />
      {/* The cap is optically centred: lucide's GraduationCap carries more mass
          below its mortarboard, so a hair of upward nudge reads as true centre. */}
      <GraduationCap
        className="relative h-[22px] w-[22px] -translate-y-px transition-colors duration-500"
        style={{ color: active ? accent : "rgb(var(--steel-500))" }}
        strokeWidth={1.75}
      />
    </span>
  );
}

/** A single milestone row. Split out of the map so each one can own its
 *  `useInView` (the active-node effect) without lifting state to the section. */
function MilestoneRow({ milestone, index }: { milestone: Milestone; index: number }) {
  const rowRef = useRef<HTMLLIElement>(null);
  const reduce = useReducedMotion();
  // `-45% 0px -45% 0px` = a thin band across the middle of the viewport, so a
  // node lights the moment its card crosses the reading line — not on entry.
  const inView = useInView(rowRef, { margin: "-45% 0px -45% 0px" });
  const accent = milestone.color ?? "#ed1c24";
  const Icon = milestone.icon;
  // Newest-first rows alternate sides from lg up; index 0 (2026) sits left.
  const onLeft = index % 2 === 0;

  return (
    <motion.li
      ref={rowRef}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
        delay: reduce ? 0 : Math.min(index * 0.06, 0.35),
      }}
      className={`relative grid ${NODE_TRACK} items-start gap-x-4 pb-12 last:pb-0 sm:gap-x-5 lg:gap-x-0`}
    >
      {/* Column 1 on lg: the card when this row sits left, else a spacer. */}
      {onLeft ? (
        <MilestoneCard
          milestone={milestone}
          accent={accent}
          icon={Icon}
          active={inView}
          className="order-2 lg:order-1 lg:pe-10"
          align="right"
        />
      ) : (
        <div aria-hidden className="pointer-events-none hidden lg:order-1 lg:block" />
      )}

      {/* The node track. `justify-center` inside a 72px column puts the cap on
          the same axis as the rail at every breakpoint, with no nudge values. */}
      <div className="order-1 flex justify-center pt-6 lg:order-2 lg:pt-7">
        <MilestoneNode accent={accent} active={inView} />
      </div>

      {/* Column 3 on lg: the card when this row sits right, else a spacer. */}
      {onLeft ? (
        <div aria-hidden className="pointer-events-none hidden lg:order-3 lg:block" />
      ) : (
        <MilestoneCard
          milestone={milestone}
          accent={accent}
          icon={Icon}
          active={inView}
          className="order-2 lg:order-3 lg:ps-10"
          align="left"
        />
      )}
    </motion.li>
  );
}

/** The milestone card itself. `align` only flips the lg+ text/plate order for
 *  the left-hand side of the two-sided layout — content is identical. */
function MilestoneCard({
  milestone,
  accent,
  icon: Icon,
  active,
  className,
  align,
}: {
  milestone: Milestone;
  accent: string;
  icon?: LucideIcon;
  active: boolean;
  className: string;
  align: "left" | "right";
}) {
  const right = align === "right";
  return (
    // `group` lives HERE, not on the row <li>: at lg the row is
    // 1fr / 72px / 1fr, so the <li> spans the full 1152px and half of it is an
    // empty decorative spacer. With `group` on the row, hovering that blank
    // half fired the whole card's hover choreography from a dead region on the
    // opposite side of the spine. Scoping it to the card matches how
    // shine-sweep is wired everywhere else (Capabilities, Process, MegaMenu).
    <div className={`group ${className}`}>
      <div
        className="shine-sweep relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-[transform,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:-translate-y-1.5 sm:p-6"
        // Active rows warm their border to the brand hue; the stronger
        // hover glow rides on the accent-ring span below (box-shadow only).
        style={{ borderColor: active ? `${accent}3d` : undefined }}
      >
        {/* Accent-tinted gradient wash — the card picks up its brand's hue. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `linear-gradient(${right ? "225deg" : "135deg"}, ${accent}1f, transparent 58%)`,
          }}
        />
        {/* Soft same-hue corner glow (warms on hover). */}
        <span
          aria-hidden
          className={`pointer-events-none absolute -bottom-16 h-40 w-40 rounded-full opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-40 ${
            right ? "-right-16" : "-left-16"
          }`}
          style={{ backgroundColor: accent }}
        />
        {/* Hover-only accent ring — box-shadow, so it never affects layout. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ boxShadow: `0 0 0 1px ${accent}59, 0 22px 50px -26px ${accent}b3` }}
        />
        {/* Ghost-year watermark — brightens and drifts outward on hover. */}
        <span
          aria-hidden
          className={`pointer-events-none absolute top-1 select-none font-display text-6xl font-bold leading-none text-white/[0.03] transition-[transform,color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-white/[0.07] sm:text-7xl ${
            right
              ? "left-4 group-hover:-translate-x-1.5"
              : "right-4 group-hover:translate-x-1.5"
          } group-hover:-translate-y-1`}
        >
          {milestone.year}
        </span>

        {/* Plate + text. This only goes side-by-side in the md–lg window, the
            one range where the card is wide enough for both: the plate is a
            248px `shrink-0` box, so a row costs 272px of the card's content
            width and the title keeps whatever is left.
              • under md the card has ~436px → 164px of title. Too narrow.
              • md–lg (single column, max-w-3xl): 564-628px → 292-356px. Fits.
              • from lg the two-sided grid halves the card: 340px at 1024px and
                452px past 1280px → only 68-180px of title, which shatters a
                24px headline into one word per line.
            So it is a column everywhere except md–lg. `lg:gap-5` matches the
            mobile stack so the rhythm is identical wherever it columns, and
            `lg:items-end` pulls the plate to the spine-facing edge on the
            left-hand side so the two sides stay mirror images. */}
        <div
          className={`relative flex flex-col gap-5 md:flex-row md:items-center md:gap-6 lg:flex-col lg:gap-5 ${
            right ? "lg:items-end lg:text-right" : "lg:items-start"
          }`}
        >
          {/* The hero: large wide white logo plate. */}
          <TimelineLogoPlate
            logo={milestone.logo}
            icon={Icon}
            label={milestone.brand}
            accent={accent}
          />

          <div className="w-full min-w-0">
            <div className={`flex items-center gap-3 ${right ? "lg:flex-row-reverse" : ""}`}>
              {/* The year is the spine of this section — a reader scans the
                  dates first and the titles second, so it is set as a large
                  display figure on its own accent-tinted chip rather than the
                  14px caption it used to be. The chip is tinted with THIS
                  milestone's brand accent, which ties the year, the spine node
                  and the hairline into one colour story per row. */}
              <span
                className="inline-flex shrink-0 items-center rounded-xl border px-3 py-1.5 font-display text-2xl font-extrabold leading-none tracking-tight transition-colors duration-500 sm:text-[1.75rem]"
                style={{
                  // Text uses the LIFTED accent (see readableAccent); the chip
                  // fill and border stay on the true brand hex, so the colour
                  // still reads as that brand.
                  color: readableAccent(accent),
                  borderColor: active ? `${accent}66` : `${accent}33`,
                  backgroundColor: active ? `${accent}1f` : `${accent}12`,
                }}
              >
                {milestone.year}
              </span>
              {/* Thin brand-accent hairline tied to this milestone — it runs
                  away from the year, so it points at the spine on both sides. */}
              <span
                aria-hidden
                className="h-px flex-1 rounded-full transition-opacity duration-500"
                style={{
                  backgroundImage: `linear-gradient(${right ? "270deg" : "90deg"}, ${accent}, transparent)`,
                  opacity: active ? 1 : 0.55,
                }}
              />
            </div>
            <h4 className="mt-2 font-display text-xl font-semibold leading-tight text-white sm:text-2xl">
              {milestone.title}
            </h4>
          </div>
        </div>

        {/* The copy follows the card's side from lg up, so the whole card reads
            as one block flowing away from the spine rather than a right-aligned
            title over left-aligned body text. */}
        <p
          className={`relative mt-4 text-sm leading-relaxed text-steel-400 sm:text-[16px] ${
            right ? "lg:text-right" : ""
          }`}
        >
          {milestone.text}
        </p>
      </div>
    </div>
  );
}

export default function About() {
  // Scroll-progress rail: the bright line draws itself down the spine as the
  // list scrolls past. `start 85%` → `end 60%` means the line is empty when the
  // first milestone arrives and full just as the last one settles, rather than
  // completing while half the timeline is still below the fold.
  const railRef = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 85%", "end 60%"],
  });
  const railScale = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <>
      <PageHeader
        eyebrow="About Neo"
        title="Precision is our heritage"
        subtitle="For nearly two decades, Neo Automation has equipped Indian industry with the world's finest tools — backed by engineering expertise that goes far beyond the sale."
        crumbs={[{ label: "About" }]}
        media={<AboutHeaderArt />}
      />

      {/* Intro + image */}
      <section id="story" className="container-px pb-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="force-dark relative overflow-hidden rounded-3xl border border-white/10 shadow-card">
              <img
                src={asset("images/nsw/team-leadership.jpg")}
                alt="The Neo Automation team at the Service Workshop inauguration"
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 to-transparent" />
            </div>
          </Reveal>
          <div>
            <Reveal>
              <p className="text-lg leading-relaxed text-steel-300">
                Neo Automation is a leading Ahmedabad–Gujarat based provider of
                Industrial Tools, Assembly Solutions, Special Purpose Machines
                (SPM), Line Automation, Torque Reaction Systems and Smart Factory
                Automation Solutions.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 leading-relaxed text-steel-400">
                Our journey began in 2007 when{" "}
                <span className="font-medium text-white">Mr. Baldev Solanki</span>{" "}
                founded the company with a vision to deliver world-class
                industrial tool solutions and exceptional customer service to the
                manufacturing industry. Over the years, we have evolved from a
                trusted industrial tools supplier into a comprehensive automation
                solutions partner serving the Automotive, Auto Component,
                Electrical, Engineering and Manufacturing industries across India.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mt-4 leading-relaxed text-steel-400">
                With nearly two decades of experience, we help customers improve
                productivity, quality, ergonomics and process reliability through
                innovative engineering — delivering customized, cost-effective
                solutions backed by technical expertise and unmatched after-sales
                support.
              </p>
            </Reveal>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {site.stats.map((s) => (
                <Reveal key={s.label} className="h-full">
                  <div className="flex h-full flex-col justify-center rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center">
                    <p className="font-display text-2xl font-bold text-white">
                      <Counter value={s.value} suffix={s.suffix} decimals={s.value % 1 !== 0 ? 1 : 0} />
                    </p>
                    <p className="mt-1 text-[13px] uppercase tracking-wider text-steel-500">
                      {s.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section id="mission-vision" className="container-px py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {[
            { icon: Target, title: "Our Mission", text: "To empower every factory floor in India with precision, traceable and reliable tooling — improving quality, safety and productivity on every line we touch." },
            { icon: Eye, title: "Our Vision", text: "To become a reliable and trusted tightening partner to our esteemed customers, in line with the requirements of Industry 4.0 — recognised for genuine products, deep expertise and uncompromising service." },
          ].map((m, i) => (
            <Reveal key={m.title} delay={i * 0.1}>
              <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-ink-900 p-8">
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-neo-600/10 blur-3xl" />
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-neo-600/15 text-neo-400">
                  <m.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-2xl font-bold text-white">
                  {m.title}
                </h3>
                <p className="mt-3 leading-relaxed text-steel-400">{m.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section id="timeline" className="container-px py-16">
        <SectionHeading
          align="center"
          eyebrow="Our Journey"
          title="Built milestone by milestone"
        />
        <ol
          ref={railRef}
          className="relative mx-auto mt-14 max-w-3xl lg:max-w-6xl"
        >
          {/* Static faint rail. `left-9` = half of the 72px node column under
              lg; `left-1/2` once the two-sided grid puts that column centre. */}
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-7 left-9 top-7 w-px -translate-x-1/2 bg-white/10 lg:left-1/2"
          />
          {/* Scroll-progress overlay — a bright brand gradient that draws itself
              down the rail. transform-origin top + scaleY, so it is a single
              composited property and never triggers layout. */}
          <motion.span
            aria-hidden
            style={reduce ? { scaleY: 1 } : { scaleY: railScale }}
            className="pointer-events-none absolute bottom-7 left-9 top-7 w-px -translate-x-1/2 origin-top bg-gradient-to-b from-neo-600 via-neo-400 to-volt-500 lg:left-1/2"
          />

          {timelineNewestFirst.map((t, i) => (
            <MilestoneRow key={t.year} milestone={t} index={i} />
          ))}
        </ol>
      </section>

      {/* Values */}
      <section id="values" className="container-px py-16">
        <SectionHeading align="center" eyebrow="What Drives Us" title="Our core values" />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.08}>
              <div className="group h-full rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-neo-600/30 hover:bg-white/[0.04]">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-neo-600/15 text-neo-400 transition group-hover:scale-110">
                  <v.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-white">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm text-steel-400">{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Certifications & standards */}
      <section id="credentials" className="container-px py-16">
        <SectionHeading
          align="center"
          eyebrow="Credentials You Can Trust"
          title="Authorised, trained & accountable"
          subtitle="Our standards are not a claim — they are backed by genuine manufacturer authorisation, factory training and documented results."
        />
        <StaggerGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {credentials.map((c) => (
            <StaggerItem key={c.title}>
              <div className="group flex h-full items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-all duration-300 hover:border-neo-600/30 hover:bg-white/[0.04]">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-neo-600/15 text-neo-400 transition-transform duration-300 group-hover:scale-110">
                  <c.icon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold text-white">
                    {c.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-steel-400">
                    {c.text}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* CSR teaser. The full /csr page existed but was only reachable from a
          mega-menu column and the footer, so nobody browsing the Company page
          ever found it. Three photo cards + one link surface it where it
          belongs. Images are the -thumb crops, which are already 4:3. */}
      <section id="csr" className="container-px py-16">
        <SectionHeading
          align="center"
          eyebrow="Beyond the Balance Sheet"
          title="Our community work"
          subtitle="Blood donation camps with Rotary, drinking water for a neighbourhood and kurtis for a girls school — the work we do that has nothing to do with tooling."
        />
        <StaggerGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {csrTeasers.map((c) => (
            <StaggerItem key={c.href + c.title}>
              <Link
                to={c.href}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-all duration-300 hover:-translate-y-1 hover:border-neo-600/30"
              >
                <span className="relative block overflow-hidden">
                  <img
                    src={asset(c.image)}
                    alt={c.alt}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/10 to-transparent"
                  />
                </span>
                <span className="flex flex-1 flex-col p-6">
                  <span className="flex items-center gap-2.5">
                    <c.icon className="h-5 w-5 shrink-0 text-neo-400" />
                    <span className="font-display text-lg font-semibold text-white">
                      {c.title}
                    </span>
                  </span>
                  <span className="mt-2 text-sm leading-relaxed text-steel-300">
                    {c.text}
                  </span>
                </span>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
        <Reveal delay={0.15}>
          <div className="mt-10 flex justify-center">
            <Link to="/csr" className="btn-ghost group">
              See all our CSR work
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Certificates sit LAST, after the CSR teaser. They are the page's
          closing proof — a visitor reads the story, the values, the claims and
          the community work, then sees the signed paperwork that backs the
          "Authorised Distributor" claim. The client asked for this order
          explicitly: CSR above, certificates below. */}
      <CertificatesSection />
    </>
  );
}
