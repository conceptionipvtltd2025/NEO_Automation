import { motion } from "framer-motion";
import { Search, PencilRuler, Cog, LifeBuoy, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";

type Step = {
  icon: LucideIcon;
  step: string;
  title: string;
  text: string;
  /** rgb triple (matches a CSS var) used as the step's accent colour */
  accent: string;
};

// Each step rides its own accent from the brand trio so the row reads as a
// deliberate, colour-graded journey rather than four identical red tiles.
const steps: Step[] = [
  {
    icon: Search,
    step: "01",
    title: "Consult & Assess",
    text: "We study your line, cycle times and quality targets to understand exactly where precision matters most.",
    accent: "var(--neo)",
  },
  {
    icon: PencilRuler,
    step: "02",
    title: "Specify & Engineer",
    text: "Our engineers recommend the right tools, torque strategy and layout — sized to your throughput and budget.",
    accent: "var(--iris)",
  },
  {
    icon: Cog,
    step: "03",
    title: "Deploy & Integrate",
    text: "We install, calibrate and connect everything — with full traceability — and validate against your specs.",
    accent: "var(--volt)",
  },
  {
    icon: LifeBuoy,
    step: "04",
    title: "Support & Optimise",
    text: "Preventive service, fast spares and continuous tuning keep uptime high long after go-live.",
    accent: "var(--aurora)",
  },
];

export function Process() {
  return (
    <section className="relative overflow-hidden py-16">
      <div className="pointer-events-none absolute inset-0 bg-radial-glow opacity-40" />
      <div className="container-px relative">
        <SectionHeading
          align="center"
          eyebrow="How We Work"
          title="A proven path from enquiry to uptime"
          subtitle="Every engagement follows the same disciplined process — so you get predictable quality, on every line, every time."
        />

        <div className="relative mt-20">
          {/* Connecting flow line (desktop) — runs through the icon row behind
              the cards and gently pans the brand-trio colours across it. */}
          <div className="pointer-events-none absolute inset-x-[12.5%] top-[3.25rem] hidden h-px overflow-hidden lg:block">
            <div className="h-full w-full bg-[linear-gradient(90deg,transparent,rgb(var(--neo)/0.6),rgb(var(--iris)/0.6),rgb(var(--volt)/0.6),rgb(var(--aurora)/0.6),transparent)] bg-[length:200%_100%] animate-gradient-pan" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                style={{ ["--accent" as string]: s.accent }}
                className="group card-rich shine-sweep flex flex-col items-center p-7 text-center"
              >
                {/* giant ghosted step numeral — depth + hierarchy */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-1 -top-3 select-none font-display text-7xl font-bold leading-none text-white/[0.04] transition-colors duration-500 group-hover:text-white/[0.07]"
                >
                  {s.step}
                </span>

                {/* accent halo that blooms behind the icon on hover */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-7 h-20 w-20 -translate-x-1/2 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: "rgb(var(--accent) / 0.45)" }}
                />

                {/* icon tile */}
                <div
                  className="relative grid h-16 w-16 place-items-center rounded-2xl border bg-ink-900/80 backdrop-blur-sm transition-all duration-500 group-hover:-translate-y-1.5 group-hover:scale-105"
                  style={{
                    borderColor: "rgb(var(--accent) / 0.35)",
                    color: "rgb(var(--accent))",
                    boxShadow:
                      "inset 0 1px 0 rgb(255 255 255 / 0.08), 0 8px 24px -10px rgb(var(--accent) / 0.5)",
                  }}
                >
                  <s.icon className="h-7 w-7 transition-transform duration-500 group-hover:rotate-6" />
                  {/* step badge */}
                  <span
                    className="absolute -right-2.5 -top-2.5 grid h-7 w-7 place-items-center rounded-full font-display text-[11px] font-bold text-white shadow-lg transition-transform duration-500 group-hover:scale-110"
                    style={{
                      background: "rgb(var(--accent))",
                      boxShadow: "0 4px 14px -3px rgb(var(--accent) / 0.7)",
                    }}
                  >
                    {s.step}
                  </span>
                </div>

                <h3 className="mt-6 font-display text-lg font-semibold text-white">
                  {s.title}
                </h3>

                {/* short accent underline that grows on hover */}
                <span
                  aria-hidden
                  className="mt-3 h-0.5 w-8 origin-center rounded-full transition-all duration-500 group-hover:w-14"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgb(var(--accent)), transparent)",
                  }}
                />

                <p className="mt-3 text-sm leading-relaxed text-steel-400">
                  {s.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
