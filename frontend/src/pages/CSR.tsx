import {
  useCallback,
  useEffect,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  HeartPulse,
  Droplets,
  GraduationCap,
  HandHeart,
  Users,
  Handshake,
  Globe2,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowUpRight,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SustainabilityHeaderArt } from "@/components/ui/HeaderArt";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { asset } from "@/lib/asset";
import { scrollToHash } from "@/lib/scroll";

// Every claim about Neo's own work on this page is evidenced by the
// photographs in public/images/csr/. No donor counts, litres or beneficiary
// numbers for Neo's projects appear anywhere — those were never recorded, so
// they are never implied.
//
// The "Water for All, Worldwide" section (#water-for-all-global) is the one
// exception, and it is NOT Neo's work: it presents the Atlas Copco Group's own
// Water for All programme (founded 1984), using Atlas Copco's photograph and
// the figures Atlas Copco publishes on atlascopco.com. Attribution rule — keep
// it on screen, link out to atlascopco.com / water4all.org, and never state or
// imply that Neo is part of, funds, or named its project after that
// programme. Neo's Project 02 simply shares the name and the belief.

/** Pair a CSR slug with its full-size and grid-sized files. */
const img = (slug: string) => ({
  full: asset(`images/csr/${slug}.jpg`),
  thumb: asset(`images/csr/${slug}-thumb.jpg`),
});

type CSRPhoto = {
  /** Optimised full-size image, shown in the lightbox and project blocks. */
  full: string;
  /** Smaller image used in the grid. */
  thumb: string;
  /** Accessible caption / alt text. */
  caption: string;
};

type Project = {
  id: string;
  icon: typeof HeartPulse;
  /** Icon-medallion classes — one pastel accent per project. */
  accent: string;
  eyebrow: string;
  title: string;
  partner: string;
  body: string[];
  photo: CSRPhoto;
  /** Optional in-page link rendered under the body copy. */
  jump?: { hash: string; label: string };
};

/** Smooth in-page jump that keeps a real `href` for no-JS / open-in-new-tab. */
const jumpTo = (hash: string) => (e: ReactMouseEvent<HTMLAnchorElement>) => {
  if (scrollToHash(hash)) e.preventDefault();
};

const projects: Project[] = [
  {
    id: "blood-donation",
    icon: HeartPulse,
    accent: "bg-neo-600/15 text-neo-400",
    eyebrow: "Project 01",
    title: "Blood Donation Camp",
    partner: "With the Rotary Club of Ahmedabad Majesty Stars",
    body: [
      "We opened the Neo Automation premises for a blood donation camp run jointly with the Rotary Club of Ahmedabad Majesty Stars, bringing the collection van to our own gate so colleagues could step off the floor and give.",
      "Donors were registered and screened on site, and each one received an Indian Red Cross Society certificate for their donation.",
      "Hosting the camp at our office was deliberate — it turned a working day into a day of giving without anyone needing to travel for it.",
    ],
    photo: {
      ...img("blood-donation-team"),
      caption:
        "The Neo Automation team with Rotary volunteers outside the office at the blood donation camp",
    },
  },
  {
    id: "water-for-all",
    icon: Droplets,
    accent: "bg-volt-500/15 text-volt-400",
    eyebrow: "Project 02",
    title: "Water for All",
    partner: "With the Rotary Club of Ahmedabad Majesty Stars & Team Atulya",
    body: [
      "Neo Automation donated a water cooler — a public drinking-water parab — for the neighbourhood at Sayona City, Vibhag-1, Chankyapuri.",
      "It was inaugurated on 1st July 2025, garlanded with marigolds, alongside the Rotary Club of Ahmedabad Majesty Stars and Team Atulya.",
      "The parab stays where people actually need it: on the street, open to anyone, through the Gujarat summer.",
    ],
    jump: {
      hash: "#water-for-all-global",
      label: "Water for All around the world",
    },
    photo: {
      ...img("water-for-all-parab"),
      caption:
        "The donated water parab at its inauguration in Sayona City, Vibhag-1, Chankyapuri",
    },
  },
  {
    id: "sanand-girls-school",
    icon: GraduationCap,
    accent: "bg-aurora-500/15 text-aurora-400",
    eyebrow: "Project 03",
    title: "Sanand Girls School — Kurti Distribution",
    partner: "At the JDG school, Sanand",
    body: [
      "We visited the JDG girls school in Sanand to distribute kurtis to its students, handing them over class by class rather than leaving a carton at the gate.",
      "Going in person mattered. The visit let our team meet the girls and their teachers, and see the school the donation supports.",
      "Education is the long game for the communities around our industrial belt, and we would rather back it directly.",
    ],
    photo: {
      ...img("sanand-girls-kurti"),
      caption: "Students of the JDG school in Sanand with the donated kurtis",
    },
  },
];

const principles = [
  {
    icon: HandHeart,
    title: "Local first",
    text: "We give where we operate — the neighbourhoods, schools and streets around our Ahmedabad base, not somewhere abstract.",
  },
  {
    icon: Handshake,
    title: "In partnership",
    text: "Each project runs with an established partner: the Rotary Club of Ahmedabad Majesty Stars, Team Atulya, the Indian Red Cross Society.",
  },
  {
    icon: Users,
    title: "Hands on the work",
    text: "Our own team shows up — donating, inaugurating, distributing. A cheque posted from the office is not what we mean by responsibility.",
  },
];

/* ── Atlas Copco Group — Water for All ─────────────────────────────────
   Atlas Copco's programme, Atlas Copco's photograph, Atlas Copco's figures
   (all from atlascopco.com/en-uk/about-atlas-copco/water-for-all). Shown for
   context beside Neo's own parab — never as Neo's work. */
const W4A_SITE_URL = "https://www.water4all.org/en";
const W4A_ATLAS_URL =
  "https://www.atlascopco.com/en-uk/about-atlas-copco/water-for-all";

const w4aPhoto = img("water-for-all-atlas-copco");

type W4AStat = {
  /** Static display value, or a number to count up to. */
  value: string | number;
  suffix?: string;
  label: string;
};

const w4aStats: W4AStat[] = [
  { value: "1984", label: "Founded in Sweden by Atlas Copco employees" },
  {
    value: 50,
    suffix: "+",
    label: "Countries with a local Water for All organisation",
  },
  { value: "Millions", label: "People reached since 1984" },
  { value: "2×", label: "Each employee donation matched twice over" },
];

/** Every CSR photograph, ordered to follow the projects above. */
const gallery: CSRPhoto[] = [
  {
    ...img("blood-donation-team"),
    caption:
      "The Neo Automation team with Rotary volunteers under the blood donation banner",
  },
  {
    ...img("blood-donation-donor"),
    caption: "A Neo team member donating blood aboard the collection van",
  },
  {
    ...img("blood-donation-kit"),
    caption:
      "A donor with her Indian Red Cross Society certificate outside the Neo Automation office",
  },
  {
    ...img("water-for-all-poster"),
    caption:
      "The Water for All event poster — donating a water cooler, 1st July 2025",
  },
  {
    ...img("water-for-all-parab"),
    caption: "The installed water parab, garlanded at its inauguration",
  },
  {
    ...img("sanand-girls-kurti"),
    caption: "Kurti distribution at the JDG girls school in Sanand",
  },
];

/**
 * Lightbox gallery — mirrors the NSWGallery pattern (uniform 4:3 tiles, arrow
 * and escape keys, scroll lock) but reads the CSR set defined above rather
 * than the NSW data module.
 */
function CSRGallery() {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const next = useCallback(
    () => setActive((i) => (i === null ? i : (i + 1) % gallery.length)),
    []
  );
  const prev = useCallback(
    () =>
      setActive((i) =>
        i === null ? i : (i - 1 + gallery.length) % gallery.length
      ),
    []
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, close, next, prev]);

  return (
    <>
      {/* Uniform grid — every tile is a 4:3 cell (object-cover crops to fit) so
          rows stay aligned with no ragged bottoms. Full image shows in lightbox. */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {gallery.map((photo, i) => (
          <motion.button
            key={photo.thumb}
            type="button"
            onClick={() => setActive(i)}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.06 }}
            className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-neo-500"
            aria-label={`View photo: ${photo.caption}`}
          >
            <img
              src={photo.thumb}
              alt={photo.caption}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
            <span className="absolute inset-x-0 bottom-0 translate-y-2 p-3 text-left text-xs font-medium text-pure opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
              {photo.caption}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] grid place-items-center p-4 sm:p-8"
          >
            <div
              className="absolute inset-0 bg-ink-950/90 backdrop-blur-md"
              onClick={close}
            />

            <button
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-xl border border-white/15 bg-ink-900/60 text-steel-200 transition hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <button
              onClick={prev}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-ink-900/60 text-steel-200 transition hover:text-white sm:left-6"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={next}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-ink-900/60 text-steel-200 transition hover:text-white sm:right-6"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <motion.figure
              key={active}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="relative z-[5] flex max-h-[88vh] max-w-5xl flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={gallery[active].full}
                alt={gallery[active].caption}
                className="max-h-[80vh] w-auto rounded-2xl border border-white/10 object-contain shadow-card"
              />
              <figcaption className="mt-4 text-center text-sm text-steel-300">
                {gallery[active].caption}
                <span className="ml-2 text-steel-500">
                  {active + 1} / {gallery.length}
                </span>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * One project block. Image and text swap columns on `lg` for odd-indexed
 * projects via order utilities, so the DOM order stays image-then-text on
 * every block and small screens always read photo first.
 */
function ProjectBlock({ project, flip }: { project: Project; flip: boolean }) {
  const Icon = project.icon;

  return (
    // `id` makes every project deep-linkable (/csr#water-for-all etc.);
    // scroll-mt clears the fixed navbar on native anchor jumps.
    <div
      id={project.id}
      className="grid scroll-mt-28 items-center gap-8 lg:grid-cols-2 lg:gap-12"
    >
      <Reveal className={flip ? "lg:order-2" : undefined}>
        <div className="force-dark group relative overflow-hidden rounded-3xl border border-white/10 shadow-card">
          <img
            src={project.photo.full}
            alt={project.photo.caption}
            loading="lazy"
            className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          />
          {/* The caption sits on the photograph, so its scrim is anchored to the
              caption band itself (not the whole image) and stays fully opaque
              behind every line — a gradient scaled to the image goes transparent
              exactly where the caption's first line falls on tall mobile captions. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0">
            <div
              aria-hidden
              className="h-16 bg-gradient-to-t from-ink-950/95 to-transparent"
            />
            <p className="bg-ink-950/95 px-5 pb-5 pt-1 text-sm leading-snug text-pure/90 sm:px-6 sm:pb-6">
              {project.photo.caption}
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.1} className={flip ? "lg:order-1" : undefined}>
        <div>
          <span
            className={`grid h-12 w-12 place-items-center rounded-2xl ${project.accent}`}
          >
            <Icon className="h-6 w-6" />
          </span>
          <p className="mt-5 text-[13px] font-semibold uppercase tracking-wider text-steel-500">
            {project.eyebrow}
          </p>
          <h3 className="mt-2 font-display text-[clamp(1.5rem,3.2vw,2.1rem)] font-bold leading-tight text-white">
            {project.title}
          </h3>
          <p className="mt-3 text-sm font-medium text-neo-400">
            {project.partner}
          </p>
          <div className="mt-5 space-y-4">
            {project.body.map((para) => (
              <p key={para} className="leading-relaxed text-steel-400">
                {para}
              </p>
            ))}
          </div>
          {project.jump && (
            <a
              href={project.jump.hash}
              onClick={jumpTo(project.jump.hash)}
              className="group/jump mt-6 inline-flex items-center gap-3 text-sm font-semibold text-steel-200 transition hover:text-white"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-volt-500/10 text-volt-500 transition duration-300 group-hover/jump:translate-y-0.5 group-hover/jump:border-volt-500/40">
                <ArrowDown className="h-4 w-4" />
              </span>
              <span className="underline decoration-white/20 decoration-1 underline-offset-4 transition group-hover/jump:decoration-volt-500">
                {project.jump.label}
              </span>
            </a>
          )}
        </div>
      </Reveal>
    </div>
  );
}

/**
 * "Water for All, Worldwide" — the Atlas Copco Group's programme, presented as
 * Atlas Copco's (attributed + linked out), then bridged back to Neo's own
 * parab, which only shares the name and the belief.
 *
 * One cinematic force-dark split card: photo on top below `lg`, photo left /
 * copy right from `lg`. The photo settles from a slight zoom once on entry
 * (transform only; skipped under reduced motion).
 */
function WaterForAllGlobal() {
  const reduce = useReducedMotion();

  return (
    <section
      id="water-for-all-global"
      className="container-px scroll-mt-28 py-10 sm:py-16"
    >
      <SectionHeading
        align="center"
        eyebrow="Water for All, Worldwide"
        title="Clean water is a human right"
        subtitle="The same three words also name one of industry's longest-running community programmes — the Atlas Copco Group's Water for All, founded by its own employees in 1984."
      />

      <Reveal className="mt-10 sm:mt-14">
        <article
          aria-labelledby="w4a-global-title"
          className="force-dark relative overflow-hidden rounded-[2rem] border border-white/10 bg-ink-900 shadow-card lg:grid lg:grid-cols-2"
        >
          {/* Photo — 4:3 on top below lg; fills the left column from lg. */}
          <figure className="shine-sweep group relative aspect-[4/3] overflow-hidden bg-ink-800 lg:aspect-auto lg:min-h-[34rem]">
            {/* Hover drift lives on this wrapper so it never fights the
                framer-driven Ken Burns transform on the <img> itself. */}
            <div className="absolute inset-0 transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]">
              <motion.img
                src={w4aPhoto.full}
                // The thumb is a 4:3 centre crop — right for the stacked
                // layout. From lg the column is taller than it is wide, so
                // object-cover renders the photo far wider than the column:
                // declare a wide slot there so the full 1600w file is used.
                srcSet={`${w4aPhoto.thumb} 800w, ${w4aPhoto.full} 1600w`}
                sizes="(min-width: 1024px) 1200px, 100vw"
                width={1600}
                height={1067}
                alt="A brass tap with a thin stream of clean water running from it, in front of a clay-walled village house"
                loading="lazy"
                decoding="async"
                initial={reduce ? false : { scale: 1.08 }}
                whileInView={reduce ? undefined : { scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                // Tap + stream sit right of centre. From lg the column is a
                // tall portrait slot, so the crop is biased right to keep the
                // spout, stream and handle in frame — less at lg, where the
                // slot is narrowest, more at xl, where the concrete post can
                // take the scrim instead of the tap.
                className="h-full w-full object-cover object-center lg:object-[58%_50%] xl:object-[66%_50%]"
              />
            </div>

            {/* Soft scrim toward the copy: down into it below lg, right into
                it from lg — kept short so the running water stays clear. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-b from-transparent to-ink-900 lg:hidden"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-r from-transparent to-ink-900 lg:block"
            />

            <figcaption className="glass-strong absolute left-3 top-3 z-[2] inline-flex max-w-[calc(100%-1.5rem)] items-center gap-2 rounded-full px-3 py-1.5 text-[0.72rem] font-medium text-pure/90 xs:left-4 xs:top-4 xs:max-w-[calc(100%-2rem)] xs:px-3.5 xs:text-xs sm:left-6 sm:top-6">
              <Droplets className="hidden h-3.5 w-3.5 shrink-0 text-volt-400 xs:block" />
              <span className="truncate">Water for All · Atlas Copco Group</span>
            </figcaption>
          </figure>

          {/* Copy */}
          <div className="relative min-w-0 p-5 xs:p-6 sm:p-10 xl:p-14">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-volt-500/10 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-28 left-1/4 h-64 w-64 rounded-full bg-aurora-500/[0.07] blur-3xl"
            />

            <div className="relative">
              {/* One line at every width: the label tightens (and drops its
                  globe) on the narrowest phones instead of wrapping. */}
              <span className="inline-flex max-w-full items-center gap-2 whitespace-nowrap rounded-full border border-volt-400/25 bg-volt-500/15 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-volt-400 xs:px-3 xs:tracking-[0.12em] sm:text-2xs sm:tracking-[0.16em]">
                <Globe2 className="hidden h-3.5 w-3.5 shrink-0 xs:block" />
                Atlas Copco Group initiative
              </span>
              <h3
                id="w4a-global-title"
                className="mt-4 font-display text-[clamp(1.75rem,3.6vw,2.6rem)] font-bold leading-tight tracking-tight text-pure"
              >
                Water for All
              </h3>
              <div className="mt-4 space-y-4">
                <p className="leading-relaxed text-steel-300">
                  Water for All is the Atlas Copco Group's main community
                  engagement initiative. It was founded in Sweden in 1984 by two
                  Atlas Copco employees, Peter Håkansson and Torgny Rogert, and
                  has spread across the world ever since.
                </p>
                <p className="leading-relaxed text-steel-400">
                  Volunteering employees fund projects that give people access
                  to clean drinking water, sanitation and hygiene — and every
                  voluntary employee donation is matched twice over by the
                  company. Because women and girls are hit hardest when water is
                  scarce, every project aims to improve their lives in
                  particular.
                </p>
              </div>

              <StaggerGroup className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
                {w4aStats.map((s) => (
                  <StaggerItem key={s.label} className="min-w-0">
                    <div className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-3.5 transition duration-300 hover:-translate-y-0.5 hover:border-volt-400/30 hover:bg-white/[0.06] xs:p-4 sm:p-5">
                      <span
                        aria-hidden
                        className="absolute inset-x-4 top-0 h-px bg-aurora opacity-70"
                      />
                      <p className="font-display text-[1.35rem] font-bold leading-none tracking-tight text-pure tabular-nums xs:text-2xl sm:text-3xl">
                        {typeof s.value === "number" ? (
                          reduce ? (
                            `${s.value}${s.suffix ?? ""}`
                          ) : (
                            <Counter value={s.value} suffix={s.suffix} />
                          )
                        ) : (
                          s.value
                        )}
                      </p>
                      <p className="mt-2 text-xs leading-snug text-steel-400 sm:text-sm sm:leading-snug">
                        {s.label}
                      </p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGroup>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <a
                  href={W4A_SITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                >
                  Visit water4all.org
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                <a
                  href={W4A_ATLAS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/ext inline-flex items-center gap-1.5 text-sm font-semibold text-volt-400 underline-offset-4 transition hover:text-pure hover:underline"
                >
                  Read on atlascopco.com
                  <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover/ext:-translate-y-0.5 group-hover/ext:translate-x-0.5" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>

              <p className="mt-6 text-2xs text-steel-500">
                Image and programme details: Atlas Copco Group.
              </p>
            </div>
          </div>
        </article>
      </Reveal>

      {/* Bridge back to Neo's own parab — same name, same belief, nothing more. */}
      <Reveal delay={0.1} className="mt-6 sm:mt-8">
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/20 xs:flex-row sm:gap-5 sm:p-6 lg:items-center">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-aurora-500/15 text-aurora-600">
            <Droplets className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1 lg:flex lg:items-center lg:justify-between lg:gap-10">
            <p className="leading-relaxed text-steel-300">
              Neo's own Water for All parab at Sayona City shares the name —
              and the belief behind it: clean drinking water should be open to
              anyone who needs it.
            </p>
            <a
              href="#water-for-all"
              onClick={jumpTo("#water-for-all")}
              // Plain inline flow (not inline-flex) so, if the label ever wraps,
              // the arrow follows the last word instead of floating off right.
              className="group/back mt-3 block text-sm font-semibold text-white lg:mt-0 lg:shrink-0"
            >
              <span className="underline decoration-aurora-600/60 decoration-2 underline-offset-4 transition group-hover/back:decoration-aurora-600">
                See our Water for All project
              </span>
              <ArrowUp className="ml-1.5 inline-block h-4 w-4 align-[-0.2em] text-aurora-600 transition duration-300 group-hover/back:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default function CSR() {
  return (
    <>
      <PageHeader
        eyebrow="Corporate Social Responsibility"
        title="Giving back where we work"
        subtitle="Beyond the factory floor, Neo Automation supports the community around it — a blood donation camp at our own premises, drinking water on a public street and school supplies handed over in person."
        crumbs={[{ label: "Company", href: "/about" }, { label: "CSR" }]}
        media={<SustainabilityHeaderArt />}
      />

      {/* Intro + the principles behind how we choose projects */}
      <section className="container-px pb-8">
        <SectionHeading
          eyebrow="Our Commitment"
          title="Small projects, done properly"
          subtitle="We are a distributor of industrial tools, not a foundation. What we can offer is our premises, our people's time and a share of what the business earns — given to causes close enough that we can stand in front of them."
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <Reveal>
            <div className="space-y-4">
              <p className="text-lg leading-relaxed text-steel-300">
                Neo Automation's corporate social responsibility work is
                deliberately local and deliberately small. Every project so far
                has happened within reach of our Ahmedabad office, with a
                partner already doing the work on the ground.
              </p>
              <p className="leading-relaxed text-steel-400">
                That has meant opening our gate for a blood donation camp,
                donating a public drinking-water parab for a neighbourhood that
                needed one, and carrying kurtis to a girls school in Sanand
                ourselves. Three projects, each one finished rather than
                announced.
              </p>
              <p className="leading-relaxed text-steel-400">
                We do not publish donor counts or beneficiary numbers for our
                projects. What we can show is the photographs from each day, and
                the partners whose names are on them.
              </p>
            </div>
          </Reveal>

          <StaggerGroup className="grid gap-5">
            {principles.map((p) => (
              <StaggerItem key={p.title}>
                <div className="flex h-full flex-col items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.04] sm:flex-row">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-neo-600/15 text-neo-400">
                    <p.icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-base font-semibold text-white">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-steel-400">
                      {p.text}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* The three projects */}
      <section id="projects" className="container-px py-10 sm:py-16">
        <SectionHeading
          align="center"
          eyebrow="What We've Done"
          title="Three projects, three partners"
          subtitle="Each of these ran with an established local partner, and each one our own team turned up for."
        />
        <div className="mt-14 space-y-16">
          {projects.map((project, i) => (
            <ProjectBlock
              key={project.id}
              project={project}
              flip={i % 2 === 1}
            />
          ))}
        </div>
      </section>

      {/* Atlas Copco Group's Water for All — attributed context, not Neo's work */}
      <WaterForAllGlobal />

      {/* Photo gallery */}
      <section id="gallery" className="container-px py-10 sm:py-16">
        <SectionHeading
          align="center"
          eyebrow="From the Days Themselves"
          title="Photographs from our CSR work"
          subtitle="The camp at our office, the parab at Sayona City and the classroom in Sanand — select any photograph to view it full size."
        />
        <div className="mt-14">
          <CSRGallery />
        </div>
      </section>

      {/* CTA */}
      <section className="container-px py-10 sm:py-16">
        <Reveal>
          <div className="gradient-border relative overflow-hidden p-8 sm:p-12">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-neo-600/10 blur-3xl"
            />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <span className="eyebrow">Work With Us</span>
                <h2 className="mt-5 font-display text-[clamp(1.6rem,3.2vw,2.4rem)] font-bold leading-tight text-white">
                  Running a community project near Ahmedabad?
                </h2>
                <p className="mt-4 max-w-xl leading-relaxed text-steel-400">
                  If you are organising a camp, a donation drive or a school
                  initiative in or around our neighbourhood, we would like to
                  hear about it — our premises, our people and our support are
                  open to the right partner.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link to="/contact" className="btn-primary justify-center">
                  Get in touch
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/sustainability" className="btn-ghost justify-center">
                  Sustainability &amp; safety
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
