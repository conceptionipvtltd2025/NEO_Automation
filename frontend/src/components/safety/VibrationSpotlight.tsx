import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Bone,
  HeartPulse,
  Info,
  ShieldCheck,
  Timer,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { VpmChart } from "@/components/safety/VpmChart";
import { havsInjuries, insightPath } from "@/data/safetyInsights";
import { cn } from "@/lib/utils";

/**
 * Vibration, explained — two findings from the Atlas Copco insights above:
 * the three injuries behind HAVS, and the hand-arm value vs the new Vibration
 * Peak Magnitude (VPM) value per tool type (the chart itself is VpmChart).
 *
 * Nothing here links out: both cards point to Neo's own insight pages
 * (/safety/insights/:id), and Atlas Copco is credited in plain text.
 */

const injuryStyle: { icon: LucideIcon; tone: string; label: string }[] = [
  {
    icon: HeartPulse,
    tone: "bg-volt-500/15 text-volt-400 [.light_&]:text-volt-600",
    label: "bg-volt-500/10 text-volt-400 [.light_&]:text-[#1f7fbf]",
  },
  {
    icon: Activity,
    tone: "bg-iris-500/15 text-iris-400 [.light_&]:text-iris-600",
    label: "bg-iris-500/10 text-iris-300 [.light_&]:text-iris-600",
  },
  {
    icon: Bone,
    tone: "bg-aurora-500/15 text-aurora-400 [.light_&]:text-aurora-600",
    label: "bg-aurora-500/10 text-aurora-300 [.light_&]:text-[#138a72]",
  },
];

export function VibrationSpotlight() {
  return (
    <section id="vibration" className="container-px py-10 sm:py-16">
      <SectionHeading
        eyebrow="Vibration, Explained"
        title="What vibration does — and how it is measured"
        subtitle="Two findings from the insights above: the injuries behind Hand-Arm Vibration Syndrome, and why a new value is coming for percussive tools."
      />

      <div className="mt-10 grid gap-5 sm:mt-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-6">
        <Reveal className="min-w-0">
          <HavsCard />
        </Reveal>
        <Reveal delay={0.1} className="min-w-0">
          <ShockChart />
        </Reveal>
      </div>
    </section>
  );
}

/* ── (a) Hand-Arm Vibration Syndrome ─────────────────────────────────────── */
function HavsCard() {
  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-5 xs:p-6 sm:p-8">
      <span
        aria-hidden
        className="pointer-events-none absolute -left-20 -top-20 h-52 w-52 rounded-full bg-volt-500/10 blur-3xl"
      />
      <p className="relative text-xs font-semibold uppercase tracking-[0.18em] text-steel-500">
        Health effects
      </p>
      <h3 className="relative mt-2 font-display text-xl font-bold leading-tight text-white sm:text-2xl">
        Hand-Arm Vibration Syndrome: 3 related injuries
      </h3>
      <p className="relative mt-3 text-sm leading-relaxed text-steel-400">
        Years on impact wrenches, grinders and other vibrating tools can do
        lasting harm in three ways.
      </p>

      <ol className="relative mt-6 divide-y divide-white/10 border-y border-white/10">
        {havsInjuries.map((inj, i) => {
          const s = injuryStyle[i % injuryStyle.length];
          const Icon = s.icon;
          return (
            <li key={inj.title} className="group flex gap-4 py-5 sm:gap-5">
              <div className="flex shrink-0 flex-col items-center gap-2">
                <span
                  className={cn(
                    "grid h-11 w-11 place-items-center rounded-2xl transition-transform duration-300 group-hover:scale-110",
                    s.tone
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="font-mono text-[11px] font-semibold tabular-nums text-steel-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                  <h4 className="font-display text-lg font-bold leading-tight text-white">
                    {inj.title}
                  </h4>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
                      s.label
                    )}
                  >
                    {inj.name}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-steel-400">{inj.text}</p>
              </div>
            </li>
          );
        })}
      </ol>

      {/* The article's own prevention advice. */}
      <div className="relative mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
        <p className="flex items-center gap-2 text-[13px] font-semibold text-white">
          <ShieldCheck className="h-4 w-4 text-aurora-500 [.light_&]:text-aurora-600" />
          The two defences that matter most
        </p>
        <ul className="mt-3 grid gap-2 xs:grid-cols-2">
          {[
            { icon: Timer, text: "Control each operator's exposure time" },
            { icon: Waves, text: "Use tools designed to minimise vibration" },
          ].map(({ icon: I, text }) => (
            <li key={text} className="flex items-start gap-2.5 text-[13px] leading-snug text-steel-300">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-white/[0.06] text-steel-200">
                <I className="h-3.5 w-3.5" />
              </span>
              <span className="pt-0.5">{text}</span>
            </li>
          ))}
        </ul>
      </div>

      <Link
        to={insightPath("hand-arm-vibration")}
        className="group/link relative mt-auto inline-flex items-center gap-2 self-start pt-6 text-sm font-semibold text-steel-200 transition-colors hover:text-white"
      >
        Read about all 3 injuries
        <span className="grid h-7 w-7 place-items-center rounded-full border border-white/15 transition group-hover/link:border-volt-400/50 group-hover/link:bg-volt-500/15">
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5" />
        </span>
      </Link>
    </article>
  );
}

/* ── (b) Same vibration value, very different shocks ─────────────────────── */
function ShockChart() {
  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-5 xs:p-6 sm:p-8">
      <span
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-iris-500/10 blur-3xl"
      />
      <p className="relative text-xs font-semibold uppercase tracking-[0.18em] text-steel-500">
        Old value vs new value
      </p>
      <h3 className="relative mt-2 font-display text-xl font-bold leading-tight text-white sm:text-2xl">
        Same vibration value, very different shocks
      </h3>
      <p className="relative mt-3 text-sm leading-relaxed text-steel-400">
        Five tool types, measured two ways. The hand-arm value misses repeated
        shocks; the new VPM value, applicable from January 2027, captures them.
        Two scales, so two panels.
      </p>

      <VpmChart className="mt-6" />

      <div className="relative mt-5 grid gap-3 sm:grid-cols-2">
        {[
          "Impulse nutrunner vs pneumatic grinder: near-identical hand-arm values (3.3 vs 3.5 m/s²), yet 220 vs 90 m/s² once repeated shocks are counted.",
          "Vibration-damped chipping hammer vs impact nutrunner: the same 5.0 m/s² hand-arm value, but 260 vs 650 m/s² VPM.",
        ].map((t) => (
          <div key={t} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-iris-500/15 text-iris-400 [.light_&]:text-iris-600">
              <Info className="h-4 w-4" />
            </span>
            <p className="text-[13px] leading-relaxed text-steel-300">{t}</p>
          </div>
        ))}
      </div>

      {/* Credit in plain text, and an internal link to Neo's own page for the
          article — nothing on /safety links out to the manufacturer's site. */}
      <p className="relative mt-5 text-[12.5px] leading-relaxed text-steel-500">
        From the insight:{" "}
        <Link
          to={insightPath("vibration-standard")}
          className="font-medium text-steel-300 underline decoration-white/20 underline-offset-2 transition-colors hover:text-white hover:decoration-white/50"
        >
          New Vibration Standard: Shielding Against Repeated Shocks
          <ArrowRight className="ml-1 inline h-3.5 w-3.5 align-[-2px]" />
        </Link>{" "}
        (Atlas Copco, April 2025)
      </p>
    </article>
  );
}
