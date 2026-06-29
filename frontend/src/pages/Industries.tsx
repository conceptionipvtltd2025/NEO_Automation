import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Car,
  Plane,
  Server,
  Factory,
  CircuitBoard,
  Zap,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { useCatalog } from "@/store/useCatalog";
import { CTABand } from "@/components/home/CTABand";

const iconMap: Record<string, LucideIcon> = {
  Car,
  Plane,
  Server,
  Factory,
  CircuitBoard,
  Zap,
};

export default function Industries() {
  const industries = useCatalog((s) => s.industries);

  return (
    <>
      <PageHeader
        eyebrow="Industries"
        title="Solutions tuned to your sector"
        subtitle="Every industry has its own tolerances, takt times and standards. We bring the right tools and expertise to each."
        crumbs={[{ label: "Industries" }]}
      />

      <section className="container-px pb-12">
        <div className="grid gap-6 md:grid-cols-2">
          {industries.map((ind, i) => {
            const Icon = iconMap[ind.icon] ?? Factory;
            return (
              <motion.div
                key={ind.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: (i % 2) * 0.1 }}
              >
                <Link
                  to={`/industries/${ind.id}`}
                  className="force-dark group relative block h-full overflow-hidden rounded-3xl border border-white/10 shadow-card"
                >
                  <div className="relative h-72 overflow-hidden sm:h-80">
                    <img
                      src={ind.image}
                      alt={ind.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
                    <div
                      className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        background: `radial-gradient(circle at 50% 100%, ${ind.accent}33, transparent 70%)`,
                      }}
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-7">
                    <div className="flex items-center justify-between">
                      <span
                        className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 backdrop-blur-md"
                        style={{ background: `${ind.accent}22`, color: ind.accent }}
                      >
                        <Icon className="h-6 w-6" />
                      </span>
                      <span className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-steel-200 transition-all duration-300 group-hover:border-neo-600 group-hover:bg-neo-600 group-hover:text-pure">
                        <ArrowUpRight className="h-5 w-5" />
                      </span>
                    </div>
                    <h3 className="mt-5 font-display text-2xl font-bold text-white">
                      {ind.name}
                    </h3>
                    <p className="mt-2 max-w-md text-sm text-steel-300">
                      {ind.tagline}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-steel-400">
                      <strong className="text-white">{ind.stat.value}</strong>
                      {ind.stat.label}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      <CTABand />
    </>
  );
}
