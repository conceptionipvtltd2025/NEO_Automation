import { Link } from "react-router-dom";
import {
  ShieldCheck,
  HardHat,
  Zap,
  Wind,
  Gauge,
  GraduationCap,
  ClipboardCheck,
  AlertTriangle,
  PersonStanding,
  BadgeCheck,
  CheckCircle2,
  ArrowUpRight,
  Wrench,
  Boxes,
  Scale,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SafetyHeaderArt } from "@/components/ui/HeaderArt";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";

/**
 * /safety — the dedicated Safety section the client asked for in the header.
 *
 * Everything on this page is written to what Neo can actually evidence:
 * the equipment it distributes, how that equipment removes a specific hazard,
 * how the Neo Service Workshop keeps tools safe in use, and what training it
 * provides. Neo is NOT itself registered to ISO 45001 — its OEM partners hold
 * their own certifications — and the "Standards & accountability" band below
 * says exactly that rather than implying a registration Neo does not have.
 */

/* ── The four disciplines ────────────────────────────────────────────────── */
const pillars: { icon: LucideIcon; title: string; text: string; points: string[] }[] = [
  {
    icon: PersonStanding,
    title: "Operator Safety",
    text: "The person on the tool is the first line of defence — and the first thing a badly chosen tool hurts. Reaction force, weight, vibration and noise are selection criteria for us, not footnotes.",
    points: [
      "Torque reaction absorbed by arms and fixtures, never by a wrist",
      "Balancers and ergonomic suspension for high-cycle stations",
      "Low-vibration, low-noise tool selection",
      "Trigger and shut-off behaviour matched to the joint",
    ],
  },
  {
    icon: ClipboardCheck,
    title: "Process Safety",
    text: "A joint you cannot prove is a joint you cannot trust. Transducer-controlled tightening and error-proofing make the safe outcome the only outcome the line will accept.",
    points: [
      "Measured torque and angle on every safety-critical rundown",
      "Error-proofing that blocks part release until every joint is OK",
      "Documented, audit-ready results retained per unit",
      "Scheduled calibration with certificates",
    ],
  },
  {
    icon: Zap,
    title: "Electrical Safety",
    text: "Electrification put live high-voltage systems on the assembly line and in the service bay. Insulated tooling and disciplined isolation are non-negotiable for battery, pack and e-drive work.",
    points: [
      "VDE 1000 V insulated hand tools, individually tested",
      "Dedicated HV tool sets kept separate from general tooling",
      "Isolation, verification and lock-off discipline before work",
      "Insulated torque tools for live-adjacent fastening",
    ],
  },
  {
    icon: HardHat,
    title: "Site & Workshop Safety",
    text: "We hold our own workshop and our field engineers to the same standard we ask of a customer's floor — because most of our work happens on somebody else's site.",
    points: [
      "PPE and site-induction compliance on every visit",
      "Pressure and load testing behind fixed guarding",
      "Rated, inspected lifting equipment with documented tests",
      "Genuine spares only — never an improvised repair",
    ],
  },
];

/* ── Hazard → control → equipment ────────────────────────────────────────── */
const controls: {
  icon: LucideIcon;
  hazard: string;
  risk: string;
  control: string;
  kit: string[];
}[] = [
  {
    icon: AlertTriangle,
    hazard: "Torque reaction & kickback",
    risk: "A high-torque rundown puts the full reaction force into the operator's wrist, elbow and shoulder — the single most common tightening injury.",
    control:
      "Take the reaction into steel, not into a person: articulated reaction arms, torque-reaction bars and fixtured spindles carry the load, while shut-off clutches end the rundown cleanly.",
    kit: ["Articulated torque reaction arms", "Fixtured & multi-spindle tightening", "Shut-off clutch screwdrivers"],
  },
  {
    icon: PersonStanding,
    hazard: "Manual handling & repetitive strain",
    risk: "Lifting, holding and repositioning heavy tools or parts across a full shift is the leading cause of musculoskeletal injury on an assembly line.",
    control:
      "Take the weight off the operator entirely with modular aluminium crane systems, workstation jibs and tool balancers sized to the station and the reach.",
    kit: ["Modular aluminium crane systems", "Workstation & column cranes", "Tool balancers and suspension"],
  },
  {
    icon: Zap,
    hazard: "Live electrical work (HV & EV)",
    risk: "Battery packs, e-drives and switchgear hold lethal potential long after the line stops. An uninsulated spanner is all it takes.",
    control:
      "Individually tested VDE 1000 V insulated hand tools, kept as a dedicated HV set, used only after isolation has been proven and locked off.",
    kit: ["GARANT VDE insulated tool sets", "GEDORE VDE insulated hand tools", "Insulated torque wrenches"],
  },
  {
    icon: Wind,
    hazard: "Compressed air",
    risk: "A charged air line that is disconnected under pressure whips. An unregulated blow gun can drive debris — or air — into the body.",
    control:
      "Safety couplings that vent the downstream line before they release, regulated safety air guns, and a properly engineered aluminium air network that holds pressure without leaking.",
    kit: ["CEJN eSafe safety quick couplings", "Regulated safety air guns", "Transair aluminium air piping"],
  },
  {
    icon: Wrench,
    hazard: "Rotating & abrasive tools",
    risk: "An abrasive disc run over its rated speed, or without its guard, fails explosively. Grinding and cutting cause more shop-floor lost time than any other hand tool.",
    control:
      "Correctly rated, correctly matched abrasives from a certified manufacturer, run in guarded machines with the right speed and the right pressure — and replaced, not stretched.",
    kit: ["PFERD certified abrasives", "Guarded grinders & sanders", "Correct-speed tool matching"],
  },
  {
    icon: Gauge,
    hazard: "Undocumented or drifted torque",
    risk: "A tool that has silently drifted out of calibration produces joints that look right and are not — a latent failure that surfaces in the field.",
    control:
      "Scheduled torque calibration on documented benches, certificates retained, and transducer-controlled tools that report every result to the process data system.",
    kit: ["Documented torque calibration", "Quality-assurance wrenches", "Process data & traceability platforms"],
  },
  {
    icon: Boxes,
    hazard: "Suspended & moving loads",
    risk: "An overloaded or uninspected lifting point does not warn you before it lets go.",
    control:
      "Rated, load-tested crane and lifting systems with documented capacity, planned inspection intervals and service by trained engineers.",
    kit: ["Rated aluminium crane systems", "Documented load testing", "Planned inspection & service"],
  },
];

/* ── How safety carries through the workshop ─────────────────────────────── */
const workshop = [
  {
    icon: BadgeCheck,
    title: "Returned certified, not just repaired",
    text: "Every nut runner that leaves the Neo Service Workshop is re-tested and comes back with its torque result documented — so a serviced tool is a known quantity from its first rundown.",
  },
  {
    icon: ShieldCheck,
    title: "Genuine spares, never an improvisation",
    text: "We fit 100% genuine OEM spares. A substituted clutch, seal or transducer changes the tool's behaviour and quietly moves the risk back onto the operator.",
  },
  {
    icon: GraduationCap,
    title: "OEM-trained engineers",
    text: "Our service and application engineers are factory-certified by the manufacturers we represent, and are trained on the safety systems built into each range.",
  },
  {
    icon: ClipboardCheck,
    title: "Preventive maintenance, not reactive",
    text: "AMC schedules catch a worn clutch or a drifting transducer before it becomes an incident — and keep the calibration record continuous.",
  },
];

export default function Safety() {
  return (
    <>
      <PageHeader
        eyebrow="Safety"
        title="Safety is engineered, not enforced"
        subtitle="A safe floor is not the result of more rules — it is the result of the right tool, taking the right load, proving the right result. That is the standard every product and every service we deliver is chosen against."
        crumbs={[{ label: "Safety" }]}
        media={<SafetyHeaderArt />}
      />

      {/* ── Position statement ───────────────────────────────────────────── */}
      <section id="commitment" className="container-px pb-4 pt-6">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <Reveal>
            <p className="text-lg leading-relaxed text-steel-300">
              Neo Automation has spent nearly two decades putting tools into the
              hands of operators on Indian production lines. In that time one
              thing has held true: the tool decision made at specification is the
              safety decision. Reaction force, weight, insulation, guarding and
              traceability are designed in long before anyone writes a work
              instruction.
            </p>
            <p className="mt-5 leading-relaxed text-steel-400">
              So we treat safety as an engineering requirement with the same
              weight as cycle time or torque accuracy. When we survey a station
              we are looking for where the load goes, what the operator has to
              hold, what is still live, and whether the result can be proved. The
              answer to each of those shapes what we recommend — and we will say
              so when a cheaper option is the less safe one.
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-7">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-neo-600/15 text-neo-400">
                <ShieldCheck className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-xl font-bold text-white">
                Our safety promise
              </h3>
              <ul className="mt-4 space-y-3">
                {[
                  "We recommend on risk, not only on price.",
                  "Every safety-critical joint we tool can be documented.",
                  "Every tool we service comes back certified.",
                  "We work to your site's EHS rules, every visit.",
                ].map((p) => (
                  <li key={p} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-neo-500" />
                    <span className="text-sm leading-relaxed text-steel-300">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── The four disciplines ─────────────────────────────────────────── */}
      <section id="disciplines" className="container-px py-16">
        <SectionHeading
          align="center"
          eyebrow="Four Disciplines"
          title="Where safety actually gets decided"
          subtitle="Operator, process, electrical and site. Miss any one of them and the other three will not save you."
        />
        <StaggerGroup className="mt-14 grid gap-5 md:grid-cols-2">
          {pillars.map((p) => (
            <StaggerItem key={p.title}>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-7 transition-all duration-300 hover:border-white/25 hover:bg-white/[0.04]">
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                />
                <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-neo-600/15 text-neo-400 transition-transform duration-300 group-hover:scale-110">
                  <p.icon className="h-6 w-6" />
                </span>
                <h3 className="relative mt-5 font-display text-xl font-bold text-white">
                  {p.title}
                </h3>
                <p className="relative mt-3 leading-relaxed text-steel-400">{p.text}</p>
                <ul className="relative mt-5 space-y-2.5 border-t border-white/10 pt-5">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-white/70" />
                      <span className="text-sm leading-relaxed text-steel-300">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* ── Hazard → control ─────────────────────────────────────────────── */}
      <section id="hazards" className="container-px py-16">
        <SectionHeading
          eyebrow="Hazard & Control"
          title="Seven risks we design out of the station"
          subtitle="For each one: what actually goes wrong, how the hazard is removed rather than warned about, and the equipment that does it."
        />

        <div className="mt-14 space-y-4">
          {controls.map((c, i) => (
            <Reveal key={c.hazard} delay={Math.min(i * 0.05, 0.25)}>
              <article className="group grid gap-6 rounded-3xl border border-white/10 bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/25 hover:bg-white/[0.04] sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
                <div>
                  <div className="flex items-start gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-neo-600/15 text-neo-400 transition-transform duration-300 group-hover:scale-110">
                      <c.icon className="h-6 w-6" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel-500">
                        Hazard {String(i + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mt-1.5 font-display text-xl font-bold leading-tight text-white">
                        {c.hazard}
                      </h3>
                    </div>
                  </div>
                  <p className="mt-5 leading-relaxed text-steel-400">{c.risk}</p>
                </div>

                <div className="lg:border-l lg:border-white/10 lg:pl-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel-500">
                    How we control it
                  </p>
                  <p className="mt-3 leading-relaxed text-steel-200">{c.control}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {c.kit.map((k) => (
                      <span
                        key={k}
                        className="rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1.5 text-[13px] font-medium text-steel-200"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Safety through service ───────────────────────────────────────── */}
      <section id="in-service" className="container-px py-16">
        <SectionHeading
          align="center"
          eyebrow="Safety Through Service"
          title="A tool stays safe only if it is kept safe"
          subtitle="Most tools do not become dangerous on the day they are bought. They drift — and the Neo Service Workshop exists to catch that drift."
        />
        <StaggerGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {workshop.map((w) => (
            <StaggerItem key={w.title}>
              <div className="group h-full rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-white/25 hover:bg-white/[0.04]">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-neo-600/15 text-neo-400 transition group-hover:scale-110">
                  <w.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold leading-tight text-white">
                  {w.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-steel-400">{w.text}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <Reveal delay={0.15}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/nsw" className="btn-ghost text-sm">
              Inside the Neo Service Workshop <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link to="/nsw#torque-calibration" className="btn-ghost text-sm">
              Torque calibration <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ── Training ─────────────────────────────────────────────────────── */}
      <section id="training" className="container-px py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-ink-900 p-8">
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-neo-600/10 blur-3xl" />
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-neo-600/15 text-neo-400">
                <GraduationCap className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-2xl font-bold text-white">
                Training & competence
              </h3>
              <p className="mt-3 leading-relaxed text-steel-400">
                A safe tool used incorrectly is not a safe tool. Every
                installation we commission includes hands-on operator training —
                how the tool reacts, how it shuts off, how the reaction is taken,
                what to check before a shift and when to take it out of service.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "On-site operator training at handover",
                  "Maintenance-team training on service intervals & wear signs",
                  "Refresher sessions when a line or a variant changes",
                  "Written handover notes retained with the installation",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-white/70" />
                    <span className="text-sm leading-relaxed text-steel-300">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-ink-900 p-8">
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-neo-600/10 blur-3xl" />
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-neo-600/15 text-neo-400">
                <Scale className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-2xl font-bold text-white">
                Standards & accountability
              </h3>
              <p className="mt-3 leading-relaxed text-steel-400">
                We are deliberately precise about what is certified and by whom.
                Neo Automation does not hold its own occupational health and
                safety registration — the manufacturers we represent hold theirs,
                and we distribute their certified equipment unaltered.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Equipment built and certified by its manufacturer — no grey imports",
                  "VDE insulated tools individually tested by the maker",
                  "Calibration performed and documented in our own workshop",
                  "Work on customer sites governed by that site's EHS rules",
                  "Open to customer and third-party audit of our records",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-white/70" />
                    <span className="text-sm leading-relaxed text-steel-300">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="container-px pb-20 pt-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-900 p-8 text-center sm:p-12">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neo-600/70 to-transparent" />
            <div className="pointer-events-none absolute -bottom-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-neo-600/10 blur-3xl" />
            <span className="eyebrow mx-auto">
              <span className="h-1 w-1 rounded-full bg-neo-500" />
              Talk to Neo
            </span>
            <h2 className="mx-auto mt-6 max-w-2xl font-display text-[clamp(1.7rem,3.6vw,2.6rem)] font-bold leading-tight text-white">
              Book a safety walk-through of your line
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-steel-400">
              An application engineer will walk the stations with you, map where
              the reaction, the load and the live parts actually are, and come
              back with a costed recommendation.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/inquiry" className="btn-primary">
                Request a walk-through <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link to="/sustainability" className="btn-ghost">
                Sustainability & responsibility <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
