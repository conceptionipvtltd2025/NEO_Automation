import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { nswHero } from "@/data/nswGallery";
import { asset } from "@/lib/asset";

// Pure image tiles — just the workshop photography, no overlaid content.
const pillars = [
  {
    title: "Pneumatic Nut Runners",
    bg: asset("images/nsw/workshop-tool-bench-thumb.jpg"),
  },
  {
    title: "Battery Nut Runners",
    bg: asset("images/nsw/workshop-alture-thumb.jpg"),
  },
  {
    title: "Electric Nut Runners",
    bg: asset("images/nsw/tool-handover-thumb.jpg"),
  },
  {
    title: "Torque Calibration",
    bg: asset("images/nsw/workshop-storage-thumb.jpg"),
  },
];

export function NSWSection() {
  return (
    <section className="relative overflow-hidden py-10 sm:py-16">
      <div className="container-px">
        <div className="force-dark relative overflow-hidden rounded-[2rem] border border-white/10">
          {/* bg */}
          <div className="absolute inset-0">
            <img
              src={nswHero}
              alt="Neo Automation Service Workshop"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/90 to-ink-950/50" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(237,28,36,0.32),transparent_55%)]" />
          </div>

          <div className="relative grid gap-6 p-5 sm:gap-10 sm:p-12 lg:grid-cols-[1.1fr_0.9fr] lg:p-16">
            <div>
              <Reveal>
                <span className="eyebrow">Neo Service Workshop</span>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="mt-4 font-display text-[clamp(1.6rem,5.5vw,3.4rem)] font-bold leading-[1.06] text-pure sm:mt-6">
                  Nut runners,{" "}
                  <span className="text-gradient-neo">restored & certified.</span>
                </h2>
              </Reveal>
              <Reveal delay={0.18}>
                <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-steel-300 sm:mt-5 sm:text-base">
                  An all tools & tackles equipped service workshop for servicing
                  all types of Pneumatic, Battery and Electric nut runners — with
                  genuine spares, documented calibration and fast turnaround.
                </p>
              </Reveal>

              <Reveal delay={0.26}>
                <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8">
                  <Link to="/nsw" className="btn-primary">
                    Explore Service <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link to="/contact" className="btn-ghost">
                    Book a service
                  </Link>
                </div>
              </Reveal>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {pillars.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 transition hover:border-neo-600/40"
                >
                  {/* pure photo tile — fully visible, no overlay/gradient */}
                  <img
                    src={p.bg}
                    alt={p.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
