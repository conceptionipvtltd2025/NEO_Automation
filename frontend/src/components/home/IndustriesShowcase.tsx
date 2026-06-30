import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Car,
  Plane,
  Server,
  Factory,
  CircuitBoard,
  Zap,
  ArrowUpRight,
  Plus,
  type LucideIcon,
} from "lucide-react";
import { industries } from "@/data/industries";
import { SectionHeading } from "@/components/SectionHeading";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  Car,
  Plane,
  Server,
  Factory,
  CircuitBoard,
  Zap,
};

export function IndustriesShowcase() {
  const [active, setActive] = useState(0);
  const current = industries[active];

  return (
    <section className="relative py-16">
      <div className="container-px">
        <SectionHeading
          eyebrow="Industries We Power"
          title="Built for the floors that build the world"
          subtitle="From zero-defect automotive lines to hyperscale data centers, our solutions are engineered for the most demanding environments on earth."
          action={
            <Link to="/industries" className="btn-ghost text-[13px]">
              All Industries <ArrowUpRight className="h-4 w-4" />
            </Link>
          }
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Selector list */}
          <div className="flex flex-col gap-2">
            {industries.map((ind, i) => {
              const Icon = iconMap[ind.icon] ?? Factory;
              const isActive = i === active;
              return (
                <button
                  key={ind.id}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300",
                    isActive
                      ? "border-white/15 bg-white/[0.05]"
                      : "border-white/[0.06] bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.03]"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="ind-active"
                      className="absolute left-0 top-0 h-full w-1"
                      style={{ background: ind.accent }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span
                        className={cn(
                          "grid h-11 w-11 place-items-center rounded-xl border transition-colors",
                          isActive
                            ? "border-transparent text-white"
                            : "border-white/10 text-steel-300"
                        )}
                        style={isActive ? { background: `${ind.accent}26` } : {}}
                      >
                        <Icon
                          className="h-5 w-5"
                          style={isActive ? { color: ind.accent } : {}}
                        />
                      </span>
                      <div>
                        <h3 className="font-display text-lg font-semibold text-white">
                          {ind.name}
                        </h3>
                        <p className="text-xs text-steel-400">{ind.short}</p>
                      </div>
                    </div>
                    <Plus
                      className={cn(
                        "h-4 w-4 transition-transform duration-300",
                        isActive ? "rotate-45 text-white" : "text-steel-500"
                      )}
                    />
                  </div>

                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="mt-4 text-sm leading-relaxed text-steel-300">
                          {ind.tagline}
                        </p>
                        <Link
                          to={`/industries/${ind.id}`}
                          className="mt-3 inline-flex items-center gap-1 text-sm font-semibold"
                          style={{ color: ind.accent }}
                        >
                          Explore solutions <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </div>

          {/* Visual */}
          <div className="force-dark relative min-h-[420px] overflow-hidden rounded-3xl border border-white/10 lg:min-h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <img
                  src={current.image}
                  alt={current.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
                <div
                  className="absolute inset-0 opacity-40 mix-blend-overlay"
                  style={{
                    background: `radial-gradient(circle at 70% 20%, ${current.accent}, transparent 60%)`,
                  }}
                />
              </motion.div>
            </AnimatePresence>

            <div className="relative z-10 flex h-full flex-col justify-end p-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.45 }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        background: `${current.accent}26`,
                        color: current.accent,
                      }}
                    >
                      {current.name}
                    </span>
                    <span className="text-xs text-steel-300">
                      <strong className="text-white">{current.stat.value}</strong>{" "}
                      {current.stat.label}
                    </span>
                  </div>
                  <h3 className="mt-4 max-w-md font-display text-2xl font-bold text-white sm:text-3xl">
                    {current.tagline}
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-steel-300">
                    {current.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {current.capabilities.map((c) => (
                      <span
                        key={c}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-steel-200 backdrop-blur-sm"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
