import { useRef, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { insightPath } from "@/data/safetyInsights";
import { asset } from "@/lib/asset";
import { scrollToHash } from "@/lib/scroll";

/**
 * "Safety first … no bad vibes" — the Atlas Copco Expert Hub's own framing of
 * operator safety, told as a cinematic image band and credited to Atlas Copco.
 *
 * The photograph (a worker standing inside a steel pipe, subject centred) is
 * never allowed under the copy:
 *  - lg+: the photo sits in the RIGHT 64% of the story panel, anchored at its
 *    own 60% point, so the face lands at ~75% of the card width whatever the
 *    panel's height. A left-to-right ink scrim carries the text column (~56%).
 *    Figures and actions sit in a strip below, which keeps the photo panel
 *    short — the source is only 600px tall and softens if stretched further.
 *  - below lg: the photo is its own 16:9 strip on top, text below it.
 * The whole card is a force-dark island so the scrim and white copy hold in
 * the light theme too.
 *
 * No outbound links (client rule): "Read the full insight" opens Neo's own
 * page for the overview (/safety/insights/safety-first), and "Browse the
 * insights" scrolls to the card grid below. Atlas Copco is credited in text.
 */

const stats = [
  { value: "1958", label: "Atlas Copco's ergonomics programme begins", bar: "bg-volt-500" },
  { value: "2.5 m/s²", label: "EU daily vibration exposure action value, A(8)", bar: "bg-iris-500" },
  { value: "Jan 2027", label: "New VPM vibration value for CE marking", bar: "bg-aurora-500" },
];

export function NoBadVibesBand() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // A few percent of drift, on the desktop photo only (the mobile photo is a
  // separate, static element), so the band feels layered without swimming.
  const y = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  const src = asset("images/safety/no-bad-vibes.jpg");
  const alt =
    "A smiling worker in an orange high-visibility suit and blue hard hat, standing inside a large steel pipe";

  const browse = (e: MouseEvent<HTMLAnchorElement>) => {
    if (scrollToHash("#insights")) e.preventDefault();
  };

  return (
    <Reveal>
      <div
        ref={ref}
        className="force-dark relative isolate overflow-hidden rounded-[2rem] border border-white/10 bg-ink-950 shadow-card"
      >
        {/* soft pastel bloom behind the copy */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-24 z-[1] h-72 w-72 rounded-full bg-iris-500/15 blur-3xl"
        />

        {/* ── Mobile / tablet photo: its own strip, never under text ── */}
        <div className="relative aspect-[16/9] overflow-hidden lg:hidden">
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-[60%_30%]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink-950 to-transparent"
          />
        </div>

        {/* ── Story: photo + scrim behind the copy on lg ── */}
        <div className="relative lg:min-h-[30rem]">
          <div className="absolute inset-y-0 right-0 hidden w-[64%] overflow-hidden lg:block">
            <motion.img
              src={src}
              alt={alt}
              loading="lazy"
              decoding="async"
              style={reduce ? undefined : { y }}
              className="absolute inset-x-0 -top-[6%] h-[112%] w-full object-cover object-[60%_30%]"
            />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-ink-950 from-[36%] via-ink-950/75 via-[56%] to-transparent to-[78%] lg:block"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-32 bg-gradient-to-t from-ink-950/80 to-transparent lg:block"
          />

          <div className="relative z-10 px-5 pb-2 pt-3 xs:px-6 xs:pt-4 sm:px-10 sm:pt-6 lg:w-[60%] lg:px-14 lg:pb-12 lg:pt-14 xl:w-[56%]">
            <span className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-volt-400" />
              Insight · Atlas Copco Expert Hub
            </span>

            <h2 className="mt-5 font-display text-[clamp(1.5rem,4.2vw,2.6rem)] font-bold leading-[1.1] tracking-tight text-pure">
              Safety first. A sound business priority — with simply{" "}
              <span className="text-gradient-aurora">no bad vibes.</span>
            </h2>

            <p className="mt-5 leading-relaxed text-steel-300">
              Noise and vibration put operators under physical strain every
              shift. Long-term exposure to vibrating handheld tools, left
              uncontrolled, can damage nerves and blood vessels and lead to
              musculoskeletal disorders — while high sound levels bring stress,
              fatigue and occupational hearing loss, one of the most common
              work-related disorders in industry.
            </p>
            <p className="mt-4 leading-relaxed text-steel-400">
              The answer is ergonomics designed into the tool: vibration
              isolated from the surfaces you grip, and noise engineered out.
              Atlas Copco has run a dedicated ergonomics programme since 1958 —
              the same thinking behind the tools we supply and service.
            </p>
          </div>
        </div>

        {/* ── Spec strip: figures + actions ── */}
        <div className="relative z-10 px-5 pb-5 pt-5 xs:px-6 xs:pb-6 sm:px-10 sm:pb-10 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10 lg:border-t lg:border-white/10 lg:bg-ink-900/80 lg:px-14 lg:py-8 lg:backdrop-blur-md">
          <StaggerGroup className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
            {stats.map((s, i) => (
              <StaggerItem
                key={s.value}
                className={i === stats.length - 1 ? "col-span-2 sm:col-span-1" : undefined}
              >
                <div className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] px-3.5 pb-3.5 pt-4">
                  <span aria-hidden className={`absolute inset-x-3.5 top-0 h-[2px] rounded-b-full ${s.bar}`} />
                  <p className="whitespace-nowrap font-display text-xl font-bold leading-tight text-pure xl:text-2xl">
                    {s.value}
                  </p>
                  <p className="mt-1.5 text-[12.5px] leading-snug text-steel-400">
                    {s.label}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <div className="mt-6 lg:mt-0">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 lg:flex-col lg:items-stretch lg:gap-3">
              <Link
                to={insightPath("safety-first")}
                className="btn-ghost group/read text-sm"
              >
                Read the full insight
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/read:translate-x-0.5" />
              </Link>
              <a
                href="#insights"
                onClick={browse}
                className="group/browse inline-flex items-center gap-2 rounded-full py-2 text-sm font-semibold text-steel-200 transition-colors hover:text-pure lg:justify-center"
              >
                Browse the insights
                <span className="grid h-7 w-7 place-items-center rounded-full border border-white/15 transition group-hover/browse:border-volt-400/50 group-hover/browse:bg-volt-500/15">
                  <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover/browse:translate-y-0.5" />
                </span>
              </a>
            </div>
            <p className="mt-5 text-[12px] text-steel-500 lg:mt-3 lg:text-center">
              Image and insight: Atlas Copco
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
