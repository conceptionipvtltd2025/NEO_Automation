import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowUpRight, ArrowLeft } from "lucide-react";
import { useCatalog } from "@/store/useCatalog";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import NotFound from "./NotFound";

export default function IndustryDetail() {
  const { id } = useParams();
  const industries = useCatalog((s) => s.industries);
  const products = useCatalog((s) => s.products);
  const industry = industries.find((i) => i.id === id);

  // Disabled industries are hidden from the public site — treat as not found.
  if (!industry || industry.visible === false) return <NotFound />;

  const relatedProducts = products
    .filter((p) => p.industries.includes(industry.id) && p.visible !== false)
    .slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="force-dark relative min-h-[70svh] overflow-hidden pt-24">
        <div className="absolute inset-0">
          <img
            src={industry.image}
            alt={industry.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/80 to-ink-950/40" />
          <div
            className="absolute inset-0 opacity-50 mix-blend-overlay"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${industry.accent}, transparent 60%)`,
            }}
          />
        </div>

        <div className="container-px relative z-10 flex min-h-[70svh] flex-col justify-end pb-14">
          <Link
            to="/industries"
            className="inline-flex w-fit items-center gap-2 text-sm text-steel-300 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> All industries
          </Link>
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="eyebrow mt-6 w-fit"
            style={{ borderColor: `${industry.accent}55`, color: industry.accent }}
          >
            {industry.name}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-5 max-w-3xl font-display text-[clamp(2.2rem,6vw,4.4rem)] font-bold leading-[1.02] text-white"
          >
            {industry.tagline}
          </motion.h1>
        </div>
      </section>

      {/* Body */}
      <section className="container-px py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr]">
          <Reveal>
            <p className="text-lg leading-relaxed text-steel-300">
              {industry.description}
            </p>

            <h2 className="mt-12 font-display text-xl font-bold text-white">
              What we deliver
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {industry.capabilities.map((c, i) => (
                <motion.div
                  key={c}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5"
                >
                  <span
                    className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full"
                    style={{ background: `${industry.accent}22`, color: industry.accent }}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm text-steel-200">{c}</span>
                </motion.div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="sticky top-28 space-y-4">
              <div
                className="rounded-3xl border p-7 text-center"
                style={{ borderColor: `${industry.accent}40`, background: `${industry.accent}0d` }}
              >
                <p className="font-display text-5xl font-bold text-white">
                  {industry.stat.value}
                </p>
                <p className="mt-2 text-sm text-steel-300">{industry.stat.label}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-ink-900 p-7">
                <h3 className="font-display text-lg font-bold text-white">
                  Talk to a {industry.name} specialist
                </h3>
                <p className="mt-2 text-sm text-steel-400">
                  Get a tailored recommendation for your line.
                </p>
                <Link to="/inquiry" className="btn-primary mt-5 w-full justify-center">
                  Request a quote <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="container-px pb-20">
          <h2 className="font-display text-2xl font-bold text-white">
            Recommended for {industry.name}
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
