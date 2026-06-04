import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Play, ShieldCheck, Star, Activity } from "lucide-react";
import { Magnetic } from "@/components/ui/Magnetic";
import { Counter } from "@/components/ui/Counter";
import { Aurora, GridBackground } from "@/components/ui/Backgrounds";
import { site } from "@/data/site";

const HERO_VIDEO =
  "https://videos.pexels.com/video-files/3209828/3209828-uhd_2560_1440_25fps.mp4";


export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [videoOk, setVideoOk] = useState(true);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section
      ref={ref}
      className="force-dark relative flex min-h-[100svh] items-center overflow-hidden pt-28"
    >
      {/* Background media */}
      <motion.div style={{ scale }} className="absolute inset-0">
        {videoOk && (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={HERO_VIDEO}
            autoPlay
            muted
            loop
            playsInline
            onError={() => setVideoOk(false)}
          />
        )}
        {/* legibility gradients — content sits on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/70" />
      </motion.div>

      <GridBackground className="opacity-60" />
      <Aurora />

      {/* Content */}
      <motion.div
        style={{ y, opacity }}
        className="container-px relative z-10 grid w-full items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]"
      >
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="eyebrow"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neo-500/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-neo-500" />
            </span>
            Authorised Distribution Partner
          </motion.div>

          <h1 className="mt-6 font-display text-[clamp(2.6rem,7vw,5.4rem)] font-bold leading-[0.98] tracking-tight">
            {["Engineering", "Tomorrow's"].map((word, i) => (
              <span key={i} className="block overflow-hidden">
                <motion.span
                  className="inline-block text-gradient"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
            <span className="block overflow-hidden">
              <motion.span
                className="inline-block text-gradient-neo"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
              >
                Industry
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-steel-300 sm:text-lg"
          >
            Precision automation tools, smart tightening systems and material
            handling — backed by the world's finest brands including{" "}
            <span className="font-medium text-white">Atlas Copco</span>,
            GESIPA, eepos, GEDORE, PFERD &amp; John Guest.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.62 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Magnetic>
              <Link to="/products" className="btn-primary">
                Explore Products <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Magnetic>
            <Magnetic strength={0.25}>
              <Link to="/swf" className="btn-ghost">
                <Play className="h-4 w-4" /> Discover SWF
              </Link>
            </Magnetic>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="mt-12 grid max-w-lg grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4"
          >
            {site.stats.map((s) => (
              <div key={s.label}>
                <div className="font-display text-2xl font-bold text-white sm:text-3xl">
                  <Counter
                    value={s.value}
                    suffix={s.suffix}
                    decimals={s.value % 1 !== 0 ? 1 : 0}
                  />
                </div>
                <div className="mt-1 text-[11px] uppercase tracking-wider text-steel-400">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        
      </motion.div>

      {/* scroll cue */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-white/20 p-1.5">
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="h-1.5 w-1.5 rounded-full bg-neo-500"
          />
        </div>
      </motion.div>
    </section>
  );
}
