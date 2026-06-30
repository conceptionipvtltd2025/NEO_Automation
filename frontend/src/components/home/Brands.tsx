import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { brands, type Brand } from "@/data/brands";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { SectionHeading } from "@/components/SectionHeading";

function Wordmark({ name, color }: { name: string; color: string }) {
  return (
    <span
      className="font-display text-2xl font-bold tracking-tight text-steel-400 grayscale transition-all duration-300 hover:scale-105 hover:text-white hover:grayscale-0 sm:text-3xl"
      style={{ ["--brand" as string]: color }}
    >
      <span className="hover:[color:var(--brand)]">{name}</span>
    </span>
  );
}

/**
 * Renders the official brand logo on a clean tile. If the logo file isn't
 * present yet (or fails to load) it gracefully falls back to the wordmark,
 * so dropping a PNG/SVG into /public/images/brands/<id>.png is all it takes.
 */
function BrandLogo({ brand }: { brand: Brand }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <Wordmark name={brand.name} color={brand.color} />;
  return (
    <span className="inline-flex h-12 max-w-[170px] items-center justify-center rounded-xl bg-white px-3.5 py-2 shadow-sm ring-1 ring-black/5">
      <img
        src={brand.logo}
        alt={`${brand.name} logo`}
        loading="lazy"
        onError={() => setFailed(true)}
        className="h-full w-auto max-w-full object-contain"
      />
    </span>
  );
}

export function Brands() {
  return (
    <section className="relative py-16">
      <div className="container-px">
        <SectionHeading
          eyebrow="Authorised Distribution"
          title="The world's finest brands, delivered by Neo"
          subtitle="We partner with global engineering leaders to bring certified, original equipment and consumables to Indian industry."
        />
      </div>

      {/* Marquee strip */}
      <Reveal className="mt-12">
        <div className="relative border-y border-white/10 bg-white/[0.015] py-8">
          <Marquee speed={26}>
            {brands.map((b) => (
              <div
                key={b.id}
                className="group flex items-center gap-3 px-2"
                style={{ ["--brand" as string]: b.color }}
              >
                <span className="font-display text-2xl font-bold tracking-tight text-steel-500 transition-colors duration-300 group-hover:[color:var(--brand)] sm:text-3xl">
                  {b.name}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-neo-600" />
              </div>
            ))}
          </Marquee>
        </div>
      </Reveal>

      {/* Brand cards */}
      <div className="container-px">
        <StaggerGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((b) => (
            <StaggerItem key={b.id}>
              <SpotlightCard
                className="h-full p-6"
                spotColor={`${b.color}26`}
              >
                <div className="flex items-start justify-between gap-3">
                  <BrandLogo brand={b} />
                  <span
                    className="rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider"
                    style={{
                      color: b.color,
                      background: `${b.color}1a`,
                    }}
                  >
                    {b.category}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-steel-400">
                  {b.blurb}
                </p>
                <Link
                  to={`/products?brand=${b.id}`}
                  className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-white/80 transition hover:text-white"
                >
                  View {b.name} range
                  <ArrowUpRight className="h-4 w-4 text-neo-500" />
                </Link>
                <motion.div
                  className="mt-5 h-px w-full origin-left"
                  style={{
                    background: `linear-gradient(90deg, ${b.color}, transparent)`,
                  }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                />
              </SpotlightCard>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
