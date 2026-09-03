import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useCatalog } from "@/store/useCatalog";
import { BrandLogoPlate } from "@/components/BrandLogoPlate";
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

// Logo rendering (plate sizing, white-chip reasoning, wordmark fallback) lives
// in components/BrandLogoPlate.tsx — shared with the /products brand strip and
// the brand page so the set stays visually consistent.

export function Brands() {
  // Live from the catalogue store — brands and their product lines are
  // admin-editable, with the seed array as the offline fallback.
  const brands = useCatalog((s) => s.brands);

  return (
    <section id="brands" className="relative py-10 sm:py-16">
      <div className="container-px">
        <SectionHeading
          eyebrow="Authorised Distribution"
          title="The world's finest brands, delivered by Neo"
          subtitle="We partner with global engineering leaders to bring certified, original equipment and consumables to Indian industry."
        />
      </div>

      {/* Marquee strip */}
      <Reveal className="mt-7 sm:mt-12">
        <div className="relative border-y border-white/10 bg-white/[0.015] py-5 sm:py-8">
          <Marquee speed={26}>
            {brands.map((b) => (
              <div
                key={b.id}
                className="group flex items-center gap-5 px-4"
                style={{ ["--brand" as string]: b.color }}
              >
                <BrandLogoPlate brand={b} size="sm" />
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
          className="mt-8 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-5 lg:grid-cols-3"
        >
          {brands.map((b) => (
            <motion.div key={b.id} variants={gridCard}>
              <SpotlightCard
                className="flex h-full flex-col p-3.5 sm:p-6"
                spotColor={`${b.color}26`}
              >
                {/* Logo on its own line: the plate is a fixed size for every
                    brand, so cramming a category pill alongside it squeezed the
                    taller logos. The pill sits under it, where it can breathe. */}
                <BrandLogoPlate
                  brand={b}
                  size="md"
                  // `md` is a fixed 164px plate; in the 2-up phone grid the
                  // column is ~165px total, so it is scaled down there.
                  className="h-14 w-full max-w-[124px] p-2.5 sm:h-20 sm:w-[164px] sm:max-w-none sm:p-3.5"
                />

                <span className="mt-3 inline-flex w-fit max-w-full items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-steel-200 sm:mt-4 sm:gap-2 sm:px-3 sm:py-1 sm:text-[12px]">
                  {/* Brand colour as a dot rather than the label colour — the
                      navy brands (Legris, GEDORE) are unreadable as text on a
                      dark card. */}
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: b.color }}
                  />
                  {b.category}
                </span>

                <p className="mt-3 line-clamp-3 text-[12.5px] leading-relaxed text-steel-400 sm:mt-4 sm:line-clamp-none sm:text-sm">
                  {b.blurb}
                </p>

                {/* mt-auto pins the link to the bottom so every card in the row
                    lines up regardless of blurb length. */}
                <Link
                  to={`/brands/${b.id}`}
                  className="mt-auto inline-flex items-center gap-1 pt-3 text-[12px] font-medium text-white/80 transition hover:text-white sm:pt-5 sm:text-sm"
                >
                  <span className="truncate">View {b.name} range</span>
                  <ArrowUpRight className="h-4 w-4 text-neo-500" />
                </Link>
                <motion.div
                  className="mt-3 h-px w-full origin-left sm:mt-5"
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
