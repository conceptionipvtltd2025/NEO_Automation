import { motion } from "framer-motion";
import {
  PackageCheck,
  Workflow,
  Gauge,
  GraduationCap,
  Boxes,
  Headset,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { StaggerGroup, StaggerItem } from "@/components/ui/Reveal";

type Capability = {
  icon: LucideIcon;
  title: string;
  text: string;
  accent: string; // rgb triplet — constant across themes
};

const capabilities: Capability[] = [
  {
    icon: PackageCheck,
    title: "Authorised Distribution",
    text: "Genuine, warranty-backed tools & consumables from Atlas Copco, GESIPA, GEDORE, CEJN, Hoffmann Group, Legris, eepos, PFERD & John Guest.",
    accent: "237,28,36",
  },
  {
    icon: Workflow,
    title: "System Integration",
    text: "Turnkey smart-tightening and material-handling lines, integrated with your MES and quality systems.",
    accent: "34,184,255",
  },
  {
    icon: Gauge,
    title: "Calibration & Service",
    text: "On-site calibration, preventive maintenance and rapid breakdown support that keeps your line running.",
    accent: "245,158,11",
  },
  {
    icon: GraduationCap,
    title: "Training & Enablement",
    text: "Operator and engineer training programmes so your team gets the most from every tool and workflow.",
    accent: "16,185,129",
  },
  {
    icon: Boxes,
    title: "Spares & Consumables",
    text: "Fast-moving spares, sockets, bits and abrasives held in stock for next-day dispatch across India.",
    accent: "139,92,246",
  },
  {
    icon: Headset,
    title: "SWF Deployment",
    text: "Atlas Copco Smart Workflow Feature roll-outs that error-proof assembly and capture full traceability.",
    accent: "236,72,153",
  },
];

export function Capabilities() {
  return (
    <section className="container-px py-24">
      <SectionHeading
        eyebrow="What We Do"
        title="End-to-end engineering, not just a supplier"
        subtitle="From the first specification to lifelong line support, Neo Automation covers every step of your tooling and automation journey."
      />

      <StaggerGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((c) => (
          <StaggerItem key={c.title}>
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="shine-sweep group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors duration-300 hover:border-white/20"
              style={{ ["--accent" as string]: c.accent }}
            >
              {/* corner glow on hover */}
              <div
                className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: `rgba(${c.accent},0.25)` }}
              />
              {/* top hairline accent that draws in on hover */}
              <span
                className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                style={{
                  background: `linear-gradient(90deg, rgba(${c.accent},0.8), transparent)`,
                }}
              />
              <span
                className="relative grid h-12 w-12 place-items-center rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6"
                style={{
                  background: `rgba(${c.accent},0.14)`,
                  color: `rgb(${c.accent})`,
                  boxShadow: `inset 0 0 0 1px rgba(${c.accent},0.25), 0 8px 24px -10px rgba(${c.accent},0.5)`,
                }}
              >
                <c.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-white">
                {c.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-steel-400">
                {c.text}
              </p>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}
