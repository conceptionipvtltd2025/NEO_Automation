import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, ArrowUpRight, ShieldCheck, GitBranch, Workflow, Gauge } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const pillars = [
  { icon: ShieldCheck, title: "Error-Proofing", desc: "Stop defects before they happen with guided, verified tightening." },
  { icon: GitBranch, title: "Full Traceability", desc: "Every result logged, time-stamped and audit-ready." },
  { icon: Workflow, title: "Smart Sequencing", desc: "Operators guided step-by-step through complex assemblies." },
  { icon: Gauge, title: "Live Quality Data", desc: "Real-time torque & angle analytics across the line." },
];

export function SWFSection() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="container-px">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10">
          {/* bg */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=2000&q=80"
              alt="Atlas Copco service centre"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/90 to-ink-950/50" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(0,51,160,0.35),transparent_55%)]" />
          </div>

          <div className="relative grid gap-10 p-8 sm:p-12 lg:grid-cols-[1.1fr_0.9fr] lg:p-16">
            <div>
              <Reveal>
                <span className="eyebrow border-volt-500/30 bg-volt-500/10 text-volt-400">
                  Atlas Copco · Smart Workflow Feature
                </span>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="mt-6 font-display text-[clamp(2rem,4.5vw,3.4rem)] font-bold leading-[1.04] text-white">
                  Zero-defect assembly,{" "}
                  <span className="text-gradient-neo">engineered in.</span>
                </h2>
              </Reveal>
              <Reveal delay={0.18}>
                <p className="mt-5 max-w-lg text-base leading-relaxed text-steel-300">
                  SWF connects every Atlas Copco tool into one intelligent,
                  error-proofed workflow — guiding operators, capturing every
                  result and giving you total traceability across the line.
                </p>
              </Reveal>

              <Reveal delay={0.26}>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link to="/swf" className="btn-primary">
                    Explore SWF <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <button className="group flex items-center gap-3 text-sm font-medium text-white">
                    <span className="relative grid h-12 w-12 place-items-center rounded-full border border-white/20 transition group-hover:border-neo-500">
                      <span className="absolute inset-0 animate-ping rounded-full border border-neo-500/40" />
                      <Play className="h-4 w-4 fill-white" />
                    </span>
                    Watch service centre
                  </button>
                </div>
              </Reveal>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {pillars.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="rounded-2xl border border-white/10 bg-ink-900/50 p-5 backdrop-blur-xl transition hover:border-volt-500/30"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-volt-500/15 text-volt-400">
                    <p.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-semibold text-white">
                    {p.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-steel-400">
                    {p.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
