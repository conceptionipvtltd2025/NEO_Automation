import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { brands, type Brand } from "@/data/brands";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { SectionHeading } from "@/components/SectionHeading";

// Brand cards slide in from the left in sequence, so the row of partner logos
// appears to flow left → right. Re-fires every time the grid scrolls into view.
const gridWrap: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const gridCard: Variants = {
  hidden: { opacity: 0, x: -48, filter: "blur(8px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

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
    // bg-pure (literal white) — NOT bg-white, which flips to near-ink in the
    // light theme and would hide the dark brand artwork (GEDORE, GESIPA…). A
    // constant white chip keeps every logo fully visible in BOTH themes.
    <span className="inline-flex h-12 max-w-[170px] items-center justify-center rounded-xl bg-pure px-3.5 py-2 shadow-sm ring-1 ring-black/10">
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

/**
 * Logo variant for the scrolling marquee strip — a wider white tile sized for
 * the band. Falls back to the wordmark if the logo file is missing (e.g. PFERD
 * until its logo is supplied), so the strip never shows a broken image.
 */
function MarqueeLogo({ brand }: { brand: Brand }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <Wordmark name={brand.name} color={brand.color} />;
  return (
    // Constant white chip (see BrandLogo) so logos read in both themes.
    <span className="inline-flex h-12 max-w-[200px] items-center justify-center rounded-xl bg-pure px-4 py-2 shadow-sm ring-1 ring-black/10 sm:h-14">
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
                className="group flex items-center gap-5 px-4"
                style={{ ["--brand" as string]: b.color }}
              >
                <MarqueeLogo brand={b} />
                <span className="h-1.5 w-1.5 rounded-full bg-neo-600" />
              </div>
            ))}
          </Marquee>
        </div>
      </Reveal>

      {/* Brand cards */}
      <div className="container-px">
        <motion.div
          variants={gridWrap}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, margin: "-60px" }}
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {brands.map((b) => (
            <motion.div key={b.id} variants={gridCard}>
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
                  viewport={{ once: false }}
                  transition={{ duration: 0.8 }}
                />
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
