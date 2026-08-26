import { Link } from "react-router-dom";
import {
  Leaf,
  Recycle,
  Users,
  Sprout,
  PackageCheck,
  ShieldCheck,
  HardHat,
  PersonStanding,
  GraduationCap,
  BadgeCheck,
  CheckCircle2,
  ArrowUpRight,
  ArrowRight,
  Scale,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SustainabilityHeaderArt } from "@/components/ui/HeaderArt";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";

const commitment = [
  {
    icon: Leaf,
    title: "Two pillars, one standard",
    text: "Environmental responsibility and operator safety are held to the same rigorous, auditable standard as our tooling quality.",
  },
  {
    icon: Scale,
    title: "Certified at the source",
    text: "Neo does not hold these registrations itself — the OEMs we represent do, and we distribute their certified equipment unaltered.",
  },
];

// Circularity metrics — grounded in the Neo Service Workshop's real numbers.
const impact = [
  { value: 100, suffix: "%", label: "Genuine spares used in repairs" },
  { value: 48, suffix: "h", label: "Typical repair turnaround" },
  { value: 1200, suffix: "+", label: "Installations supported & extended" },
];

const sustainabilityPillars = [
  {
    icon: Leaf,
    accent: "bg-aurora-500/15 text-aurora-400",
    title: "Environmental Responsibility",
    text: "We work to reduce the footprint of our operations and the products we distribute — from energy-efficient pneumatics to lower-waste service processes.",
    points: [
      "Energy-efficient, leak-free pneumatic & air-piping systems",
      "Reusable packaging & efficient logistics",
      "Year-on-year footprint reduction targets",
    ],
  },
  {
    icon: PackageCheck,
    accent: "bg-volt-500/15 text-volt-400",
    title: "Responsible Sourcing",
    text: "As an authorised distributor, we partner only with manufacturers whose ethics, quality and environmental standards match our own.",
    points: [
      "Authorised OEM partnerships — no grey imports",
      "Fair-labour & anti-corruption expectations",
      "100% genuine, traceable components",
    ],
  },
  {
    icon: Recycle,
    accent: "bg-aurora-500/15 text-aurora-400",
    title: "Circularity & Longevity",
    text: "The most sustainable tool is the one that lasts. Repair, calibration and preventive maintenance keep equipment out of the waste stream.",
    points: [
      "Repair-over-replace at the Neo Service Workshop",
      "AMC contracts that maximise tool life",
      "Guidance on responsible end-of-life & recycling",
    ],
  },
  {
    icon: Sprout,
    accent: "bg-iris-500/15 text-iris-400",
    title: "Environmental Management",
    text: "A structured, documented approach to reducing the impact of our own operations — objectives set, controls applied and results reviewed.",
    points: [
      "Documented objectives, controls & review cycles",
      "Continual-improvement mindset",
      "Open to customer & third-party audit",
    ],
  },
  {
    icon: Users,
    accent: "bg-volt-500/15 text-volt-400",
    title: "Community & People",
    text: "Nearly two decades of equipping Indian industry has been built on people — our team, our OEM-trained engineers and the customers we serve.",
    points: [
      "Skilled local employment & OEM-certified training",
      "Knowledge sharing that raises the whole floor",
      "A pan-India service network of high-skill jobs",
    ],
  },
];

const safetyPillars = [
  {
    icon: ShieldCheck,
    accent: "bg-volt-500/15 text-volt-400",
    title: "Safety-First Culture",
    text: "Safety is engineered into everything we do — starting with our own people and extending to every operator using our tools.",
    points: [
      "A zero-harm mindset in workshop & on site",
      "Safe-by-design tool selection",
      "Controlled torque & reaction management",
    ],
  },
  {
    icon: HardHat,
    accent: "bg-iris-500/15 text-iris-400",
    title: "Occupational Health & Safety",
    text: "A formalised approach to how we identify hazards, control risk and protect everyone in our workshop and on customer sites.",
    points: [
      "Documented risk assessments & controls",
      "Incident reporting & review cycles",
      "Measurable, ongoing safety improvement",
    ],
  },
  {
    icon: PersonStanding,
    accent: "bg-aurora-500/15 text-aurora-400",
    title: "Operator Ergonomics",
    text: "Reducing operator strain protects health and improves quality. Our ergonomic tooling and lifting solutions make demanding work safer.",
    points: [
      "Modular aluminium cranes reduce lifting strain",
      "Reaction & vibration control lowers RSI risk",
      "Human-centred tool selection",
    ],
  },
  {
    icon: GraduationCap,
    accent: "bg-volt-500/15 text-volt-400",
    title: "Training & Enablement",
    text: "A safe line is a well-trained line. Our OEM-trained engineers transfer competence so tools are used safely and correctly.",
    points: [
      "Factory-certified, OEM-trained engineers",
      "Operator training & hands-on enablement",
      "Safe practice embedded on the floor",
    ],
  },
  {
    icon: BadgeCheck,
    accent: "bg-iris-500/15 text-iris-400",
    title: "Product Safety & Traceability",
    text: "Traceable torque and certified calibration are safety features — they prevent the under- and over-tightening that cause field failures.",
    points: [
      "Documented, audit-ready calibration certificates",
      "Transducer-controlled, error-proof tightening",
      "Full traceability of genuine spares",
    ],
  },
];

// IMPORTANT: Neo Automation is not itself registered to ISO standards. The
// manufacturers we represent hold those certifications for the equipment they
// build, and the site must say exactly that — nothing stronger.
const standards = [
  { code: "Certified OEMs", label: "Quality, environment & safety certifications held by our manufacturing partners", status: "At the source" },
  { code: "Authorised Distribution", label: "Appointed partner — genuine equipment, never grey imports", status: "Contracted" },
  { code: "OEM-Trained Engineers", label: "Factory-certified for installation, service & calibration", status: "In practice" },
  { code: "Documented Calibration", label: "Individually certified torque with audit-ready reports", status: "In practice" },
];

function PillarCard({
  icon: Icon,
  accent,
  title,
  text,
  points,
}: {
  icon: typeof Leaf;
  accent: string;
  title: string;
  text: string;
  points: string[];
}) {
  return (
    <div className="card-rich group flex h-full flex-col p-6">
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${accent}`}>
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="mt-5 font-display text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-steel-400">{text}</p>
      <ul className="mt-4 space-y-2 border-t border-white/10 pt-4">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2.5 text-[14.5px] text-steel-300">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-neo-500" />
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Sustainability() {
  return (
    <>
      <PageHeader
        eyebrow="Sustainability & Safety"
        title="Precision with responsibility"
        subtitle="Neo Automation pairs world-class tooling with a commitment to protecting people and the planet — engineering productivity that is safe, ethical and built to last."
        crumbs={[{ label: "Company", href: "/about" }, { label: "Sustainability & Safety" }]}
        media={<SustainabilityHeaderArt />}
      />

      {/* Our commitment + impact metrics */}
      <section className="container-px pb-8">
        <SectionHeading
          eyebrow="Why It Matters"
          title="Our commitment to people & planet"
          subtitle="Sustainability and safety are not add-ons at Neo — they are extensions of the precision and traceability we build into every tool, across our supply chain, our workshop and the factory floors we equip."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <StaggerGroup className="grid gap-5 sm:grid-cols-2">
            {commitment.map((c) => (
              <StaggerItem key={c.title}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-aurora-500/15 text-aurora-400">
                    <c.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-semibold text-white">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-steel-400">{c.text}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <Reveal delay={0.1}>
            <div className="grid h-full gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:grid-cols-3">
              {impact.map((m) => (
                <div key={m.label} className="flex flex-col justify-center text-center">
                  <p className="font-display text-3xl font-bold text-gradient-aurora">
                    <Counter value={m.value} suffix={m.suffix} />
                  </p>
                  <p className="mt-1.5 text-[13px] leading-snug text-steel-500">
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Sustainability pillars */}
      <section className="container-px py-14">
        <SectionHeading
          eyebrow="Planet & People"
          title="Sustainability, built into how we operate"
          subtitle="From responsible sourcing to circular service, we work to make every tool we supply — and every operation we run — kinder to the environment."
        />
        <StaggerGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sustainabilityPillars.map((p) => (
            <StaggerItem key={p.title}>
              <PillarCard {...p} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* Safety pillars */}
      <section className="container-px py-14">
        <SectionHeading
          eyebrow="Safety"
          title="A safety-first culture, engineered in"
          subtitle="Echoing our mission to improve quality, safety and productivity on every factory floor — it starts with our own people and reaches every operator using our tools."
        />
        <StaggerGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {safetyPillars.map((p) => (
            <StaggerItem key={p.title}>
              <PillarCard {...p} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* Standards & frameworks */}
      <section className="container-px py-14">
        <SectionHeading
          align="center"
          eyebrow="Standards & Partnerships"
          title="Held to standards you can audit"
          subtitle="Neo Automation is not itself an ISO-registered organisation — the OEMs whose equipment we distribute hold those certifications. What we guarantee is genuine, certified product, factory-trained people and documented results."
        />
        <StaggerGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {standards.map((s) => (
            <StaggerItem key={s.code}>
              <div className="group h-full rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center transition hover:border-neo-600/30 hover:bg-white/[0.04]">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-neo-600/15 text-neo-400 transition group-hover:scale-110">
                  <BadgeCheck className="h-6 w-6" />
                </span>
                <p className="mt-4 font-display text-lg font-bold text-white">{s.code}</p>
                <p className="mt-1 text-xs text-steel-400">{s.label}</p>
                <span className="mt-3 inline-block rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[12px] font-semibold uppercase tracking-wider text-steel-300">
                  {s.status}
                </span>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* CTA */}
      <section className="container-px py-16">
        <Reveal>
          <div className="gradient-border relative overflow-hidden p-8 sm:p-12">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-aurora-500/10 blur-3xl"
            />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <span className="eyebrow">Get in Touch</span>
                <h2 className="mt-5 font-display text-[clamp(1.6rem,3.2vw,2.4rem)] font-bold leading-tight text-white">
                  Talk to us about sustainability &amp; safety
                </h2>
                <p className="mt-4 max-w-xl leading-relaxed text-steel-400">
                  Whether you need audit documentation, ergonomic tooling
                  recommendations or a service plan that extends tool life, our
                  team can help you build a safer, more responsible line.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link to="/inquiry" className="btn-primary justify-center">
                  Request a consultation
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/contact" className="btn-ghost justify-center">
                  Contact Neo
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
