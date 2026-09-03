import { Link } from "react-router-dom";
import { Leaf, Recycle, ShieldCheck, BadgeCheck, ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { SectionGlow } from "@/components/ui/Backgrounds";

const pillars = [
  {
    icon: Leaf,
    accent: "bg-aurora-500/15 text-aurora-400",
    title: "Environmental responsibility",
    text: "Energy-efficient systems, responsible sourcing and lower-waste operations.",
  },
  {
    icon: Recycle,
    accent: "bg-volt-500/15 text-volt-400",
    title: "Circularity & longevity",
    text: "Repair, calibration and AMC that keep tools out of the waste stream.",
  },
  {
    icon: ShieldCheck,
    accent: "bg-iris-500/15 text-iris-400",
    title: "Safety-first culture",
    text: "Safe-by-design tooling, ergonomics and a zero-harm mindset.",
  },
  {
    icon: BadgeCheck,
    accent: "bg-neo-600/15 text-neo-400",
    title: "Traceable by design",
    text: "Documented calibration and error-proof, recorded tightening.",
  },
];

// Neo is not itself certified to these standards — our OEM partners are, and we
// distribute their certified equipment. Keep this framing: the client was
// explicit that the site must not imply Neo holds the registrations.
const standards = [
  "OEM-certified equipment",
  "Authorised distribution",
  "OEM-trained engineers",
  "Documented calibration",
];

export function SustainabilitySection() {
  return (
    <section className="relative overflow-hidden py-10 sm:py-16">
      <SectionGlow color="79,217,180" />
      <div className="container-px">
        <div className="grid gap-7 sm:gap-12 lg:grid-cols-2 lg:items-center">
          {/* Copy */}
          <div>
            <SectionHeading
              eyebrow="Responsibility"
              title="Sustainability & safety, built into every tool"
              subtitle="Precision with responsibility — from responsible sourcing and lower-waste operations to a safety-first culture and ergonomic, traceable tooling, Neo builds sustainability and operator safety into everything we supply and service."
            />

            <Reveal delay={0.15}>
              <div className="mt-7 flex flex-wrap gap-2">
                {standards.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[13px] font-medium text-steel-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <Link to="/sustainability" className="btn-primary mt-8">
                Our commitments
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>

          {/* Pillars */}
          <StaggerGroup className="grid grid-cols-2 gap-3 sm:gap-5">
            {pillars.map((p) => (
              <StaggerItem key={p.title}>
                <div className="card-rich group h-full p-6">
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${p.accent}`}
                  >
                    <p.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-3 font-display text-[14px] font-semibold text-white sm:mt-4 sm:text-base">
                    {p.title}
                  </h3>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-steel-400 sm:mt-2 sm:text-[14.5px]">
                    {p.text}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}
