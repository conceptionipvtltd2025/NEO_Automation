import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Cpu, Gauge, Sparkles, Loader2 } from "lucide-react";
import { specialProducts } from "@/data/products";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { formatINR } from "@/lib/utils";

const Showpiece3D = lazy(() =>
  import("@/components/three/Showpiece3D").then((m) => ({
    default: m.Showpiece3D,
  }))
);

export function SpecialProducts() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-0 bg-radial-glow opacity-60" />
      <div className="container-px relative">
        <SectionHeading
          align="center"
          eyebrow="Signature Engineering"
          title="Special products, built to outperform"
          subtitle="Hand-picked flagship tools that define precision — smart, connected and engineered for the assembly lines of tomorrow."
        />

        <div className="mt-16 grid items-center gap-10 lg:grid-cols-2">
          {/* 3D showpiece */}
          <Reveal>
            <div className="gradient-border relative aspect-square w-full overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(237,28,36,0.12),transparent_60%)]" />
              <Suspense
                fallback={
                  <div className="absolute inset-0 grid place-items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-neo-600/60" />
                  </div>
                }
              >
                <Showpiece3D className="absolute inset-0 h-full w-full" />
              </Suspense>

              <span className="absolute left-5 top-5 eyebrow">
                <Sparkles className="h-3.5 w-3.5 text-neo-500" /> Live 3D
              </span>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute bottom-5 left-5 glass rounded-xl px-3 py-2"
              >
                <div className="flex items-center gap-2 text-xs text-steel-200">
                  <Gauge className="h-3.5 w-3.5 text-volt-500" /> ±2% Torque
                </div>
              </motion.div>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                className="absolute right-5 top-1/3 glass rounded-xl px-3 py-2"
              >
                <div className="flex items-center gap-2 text-xs text-steel-200">
                  <Cpu className="h-3.5 w-3.5 text-neo-500" /> SWF Connected
                </div>
              </motion.div>
            </div>
          </Reveal>

          {/* Product list */}
          <div className="flex flex-col gap-4">
            {specialProducts.map((prod, i) => (
              <motion.div
                key={prod.id}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <Link
                  to={`/products/${prod.slug}`}
                  className="group flex items-center gap-5 rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05]"
                >
                  <span className="font-display text-2xl font-bold text-white/15">
                    0{i + 1}
                  </span>
                  <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-ink-800">
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium uppercase tracking-wider text-neo-400">
                        {prod.brand}
                      </span>
                      {prod.badge && (
                        <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-steel-300">
                          {prod.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-1 truncate font-display text-base font-semibold text-white">
                      {prod.name}
                    </h3>
                    <p className="text-sm text-steel-400">
                      {formatINR(prod.price)}
                    </p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-steel-500 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-neo-500" />
                </Link>
              </motion.div>
            ))}

            <Reveal delay={0.2}>
              <Link
                to="/products"
                className="btn-ghost mt-2 w-full justify-center"
              >
                View full catalogue <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
