import { lazy, Suspense, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Cpu, Gauge, Sparkles, Loader2 } from "lucide-react";
import { useCatalog } from "@/store/useCatalog";
import { homeSpecial, HOME_SIGNATURE_LIMIT } from "@/lib/homeProducts";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { safeImg, onImgError } from "@/lib/image";

const Showpiece3D = lazy(() =>
  import("@/components/three/Showpiece3D").then((m) => ({
    default: m.Showpiece3D,
  }))
);

/** How many flagship rows sit beside the showpiece — shared with the admin. */
const LIMIT = HOME_SIGNATURE_LIMIT;

export function SpecialProducts() {
  // Live catalogue — the admin's "Special / Flagship" flag and home ordering
  // drive this rail directly.
  const products = useCatalog((s) => s.products);
  const picks = useMemo(() => homeSpecial(products, LIMIT), [products]);

  // Nothing to show at all (an emptied catalogue): drop the section rather
  // than parading the 3D showpiece next to a blank column.
  if (picks.length === 0) return null;

  return (
    <section id="special-products" className="relative overflow-hidden py-10 sm:py-16">
      <div className="pointer-events-none absolute inset-0 bg-radial-glow opacity-60" />
      <div className="container-px relative">
        <SectionHeading
          align="center"
          eyebrow="Signature Engineering"
          title="Special products, built to outperform"
          subtitle="Hand-picked flagship tools that define precision — smart, connected and engineered for the assembly lines of tomorrow."
        />

        {/* items-stretch, not items-center: the showpiece is a fixed square and
            the list grows with the row count, so centring left the square
            floating with a gap above and below while the list overhung both
            ends. The rows below are sized to fill that same height. */}
        <div className="mt-8 grid items-stretch gap-6 sm:mt-16 sm:gap-10 lg:grid-cols-2">
          {/* 3D showpiece */}
          <Reveal>
            <div className="gradient-border relative aspect-[4/3] w-full overflow-hidden sm:aspect-square">
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
                className="absolute right-4 top-4 hidden glass rounded-xl px-3 py-2 sm:block"
              >
                <div className="flex items-center gap-2 text-xs text-steel-200">
                  <Cpu className="h-3.5 w-3.5 text-neo-500" /> Smart Connected
                </div>
              </motion.div>
            </div>
          </Reveal>

          {/* Product list */}
          <div className="flex min-w-0 flex-col justify-between gap-3">
            {picks.map((prod, i) => (
              <motion.div
                key={prod.id}
                className="min-w-0"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <Link
                  to={`/products/${prod.slug}`}
                  className="group flex min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-3 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05] sm:gap-4"
                >
                  <span className="font-display text-xl font-bold text-white/15">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-ink-800 sm:h-16 sm:w-20">
                    <img
                      src={safeImg(prod.images[0])}
                      onError={onImgError}
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
                        <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[12px] text-steel-300">
                          {prod.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-1 truncate font-display text-base font-semibold text-white">
                      {prod.name}
                    </h3>
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
