import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Target, Eye, Award, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";

export function AboutTeaser() {
  return (
    <section className="relative py-24">
      <div className="container-px grid items-center gap-12 lg:grid-cols-2">
        {/* Visual */}
        <Reveal>
          <div className="relative">
            <div className="force-dark relative overflow-hidden rounded-3xl border border-white/10 shadow-card">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80"
                alt="Neo Automation engineering team"
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 to-transparent" />
            </div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -bottom-6 -right-2 glass-strong rounded-2xl p-5 shadow-card sm:-right-6"
            >
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-neo-500" />
                <div>
                  <p className="font-display text-2xl font-bold text-white">
                    <Counter value={18} suffix="+" />
                  </p>
                  <p className="text-xs text-steel-400">Years of excellence</p>
                </div>
              </div>
            </motion.div>

            <div className="absolute -left-4 top-8 hidden rounded-2xl border border-white/10 bg-ink-900/80 px-4 py-3 backdrop-blur-xl sm:block">
              <p className="font-display text-xl font-bold text-white">ISO 9001</p>
              <p className="text-[11px] text-steel-400">Quality certified</p>
            </div>
          </div>
        </Reveal>

        {/* Text */}
        <div>
          <Reveal>
            <span className="eyebrow">
              <span className="h-1 w-1 rounded-full bg-neo-500" /> Who We Are
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-display text-[clamp(1.9rem,4vw,3rem)] font-bold leading-[1.06] text-gradient">
              A partner engineered for precision &amp; trust
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-5 text-base leading-relaxed text-steel-400">
              Neo Automation brings world-class industrial tools and automation
              solutions to Indian manufacturing. As authorised distributors of
              the finest global brands, we pair genuine equipment with expert
              engineering support, on-site service and rapid spares.
            </p>
          </Reveal>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              { icon: Target, title: "Our Mission", text: "Empower every factory floor with precision, traceable tooling." },
              { icon: Eye, title: "Our Vision", text: "To be India's most trusted automation solutions partner." },
            ].map((m, i) => (
              <Reveal key={m.title} delay={0.2 + i * 0.08}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-neo-600/15 text-neo-400">
                    <m.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-semibold text-white">
                    {m.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-steel-400">
                    {m.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.36}>
            <Link to="/about" className="btn-ghost mt-8 text-[13px]">
              More about Neo <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
