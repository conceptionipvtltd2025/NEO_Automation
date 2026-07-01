import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Wind, BatteryCharging, Plug, Gauge } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { nswHero } from "@/data/nswGallery";
import { asset } from "@/lib/asset";

const pillars = [
  {
    icon: Wind,
    title: "Pneumatic Nut Runners",
    desc: "Air-motor overhaul, seal kits and full servicing.",
    bg: asset("images/nsw/workshop-tool-bench-thumb.jpg"),
  },
  {
    icon: BatteryCharging,
    title: "Battery Nut Runners",
    desc: "Cordless repair, battery health & diagnostics.",
    bg: asset("images/nsw/workshop-alture-thumb.jpg"),
  },
  {
    icon: Plug,
    title: "Electric Nut Runners",
    desc: "DC/transducerised tool service & fault-finding.",
    bg: asset("images/nsw/tool-handover-thumb.jpg"),
  },
  {
    icon: Gauge,
    title: "Torque Calibration",
    desc: "ISO 6789 calibration with certified reports.",
    bg: asset("images/nsw/workshop-storage-thumb.jpg"),
  },
];

export function NSWSection() {
  return (
    <section className="relative overflow-hidden py-16">
      <div className="container-px">
        <div className="force-dark relative overflow-hidden rounded-[2rem] border border-white/10">
          {/* bg */}
          <div className="absolute inset-0">
            <img
              src={nswHero}
              alt="Neo Automation Nuclear Service Workshop"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/90 to-ink-950/50" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(237,28,36,0.32),transparent_55%)]" />
          </div>

          <div className="relative grid gap-10 p-8 sm:p-12 lg:grid-cols-[1.1fr_0.9fr] lg:p-16">
            <div>
              <Reveal>
                <span className="eyebrow">Neo Service Workshop · NSW</span>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="mt-6 font-display text-[clamp(2rem,4.5vw,3.4rem)] font-bold leading-[1.04] text-pure">
                  Nut runners,{" "}
                  <span className="text-gradient-neo">restored & certified.</span>
                </h2>
              </Reveal>
              <Reveal delay={0.18}>
                <p className="mt-5 max-w-lg text-base leading-relaxed text-steel-300">
                  An all tools & tackles equipped service workshop for servicing
                  all types of Pneumatic, Battery and Electric nut runners — with
                  genuine spares, ISO-certified calibration and fast turnaround.
                </p>
              </Reveal>

              <Reveal delay={0.26}>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link to="/nsw" className="btn-primary">
                    Explore NSW <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link to="/contact" className="btn-ghost">
                    Book a service
                  </Link>
                </div>
              </Reveal>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {pillars.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 p-5 transition hover:border-neo-600/40"
                >
                  {/* photo background */}
                  <img
                    src={p.bg}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover opacity-40 transition duration-500 group-hover:scale-105 group-hover:opacity-55"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/85 to-ink-950/55" />

                  <div className="relative">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-neo-600/20 text-neo-300 ring-1 ring-inset ring-white/10 backdrop-blur-sm">
                      <p.icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 font-display text-base font-semibold text-pure">
                      {p.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-steel-300">
                      {p.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
