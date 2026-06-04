import { motion } from "framer-motion";
import { Search, PencilRuler, Cog, LifeBuoy, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";

type Step = {
  icon: LucideIcon;
  step: string;
  title: string;
  text: string;
};

const steps: Step[] = [
  {
    icon: Search,
    step: "01",
    title: "Consult & Assess",
    text: "We study your line, cycle times and quality targets to understand exactly where precision matters most.",
  },
  {
    icon: PencilRuler,
    step: "02",
    title: "Specify & Engineer",
    text: "Our engineers recommend the right tools, torque strategy and layout — sized to your throughput and budget.",
  },
  {
    icon: Cog,
    step: "03",
    title: "Deploy & Integrate",
    text: "We install, calibrate and connect everything — including SWF traceability — and validate against your specs.",
  },
  {
    icon: LifeBuoy,
    step: "04",
    title: "Support & Optimise",
    text: "Preventive service, fast spares and continuous tuning keep uptime high long after go-live.",
  },
];

export function Process() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-0 bg-radial-glow opacity-40" />
      <div className="container-px relative">
        <SectionHeading
          align="center"
          eyebrow="How We Work"
          title="A proven path from enquiry to uptime"
          subtitle="Every engagement follows the same disciplined process — so you get predictable quality, on every line, every time."
        />

        <div className="relative mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* connecting line (desktop) — flows colour across the steps */}
          <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px overflow-hidden lg:block">
            <div className="h-full w-full bg-[linear-gradient(90deg,transparent,rgb(var(--neo)/0.5),rgb(var(--volt)/0.5),transparent)] bg-[length:200%_100%] animate-gradient-pan" />
          </div>

          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="group relative text-center"
            >
              <div className="relative mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-neo-600/30 bg-ink-900 text-neo-400 shadow-glow-sm transition-all duration-500 group-hover:-translate-y-1 group-hover:scale-105 group-hover:border-neo-600/60 group-hover:text-neo-300 group-hover:shadow-glow">
                <s.icon className="h-6 w-6 transition-transform duration-500 group-hover:rotate-6" />
                <span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-neo-600 font-display text-[11px] font-bold text-pure shadow-glow-sm transition-transform duration-500 group-hover:scale-110">
                  {s.step}
                </span>
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-white">
                {s.title}
              </h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-steel-400">
                {s.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
