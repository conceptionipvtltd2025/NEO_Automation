import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Magnetic } from "@/components/ui/Magnetic";
import { Counter } from "@/components/ui/Counter";
import { GridBackground } from "@/components/ui/Backgrounds";
import { site } from "@/data/site";
import { asset } from "@/lib/asset";

// Self-hosted brand showreel — a short, lean, muted/looped industrial b-roll clip.
// Streamed directly (faststart MP4) so the first frame paints instantly and it never
// buffers mid-play or at the loop. Source: youtu.be/dDjZkJ9iWHI (trimmed to 12s b-roll).
// ?v=4 cache-busts the browser's media cache so a stale older encode is never replayed.
// asset() prefixes the deploy base so these resolve under /neo-website/ on the server.
const HERO_VIDEO_SRC = asset("video/hero-banner.mp4?v=4");
const HERO_POSTER = asset("video/hero-poster.jpg?v=4"); // the clip's exact first frame (seamless hand-off)


export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Only play the banner while it's actually on screen — pausing it when scrolled
  // away frees the GPU/decoder for the rest of the page (and vice-versa).
  useEffect(() => {
    const section = ref.current;
    const v = videoRef.current;
    if (!section || !v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.1 }
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="force-dark relative flex min-h-[100svh] items-center overflow-hidden pb-24 pt-36"
    >
      {/* Background media — static (no scroll-driven scale) so the GPU never
          re-rasterizes the decoded video frame while scrolling = no lag. */}
      <div className="absolute inset-0 bg-ink-950">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover [backface-visibility:hidden] [transform:translateZ(0)]"
          src={HERO_VIDEO_SRC}
          poster={HERO_POSTER}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          aria-hidden="true"
          onLoadedMetadata={(e) => {
            e.currentTarget.muted = true;
            e.currentTarget.play().catch(() => {});
          }}
        />
        {/* legibility gradients — kept light so the footage stays visible; content sits on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/95 via-ink-950/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/75 via-transparent to-ink-950/25" />
      </div>

      <GridBackground className="opacity-40" />

      {/* Content — gentle parallax drift only; no scroll-driven opacity fade
          so the heading, buttons and stats stay fully crisp while scrolling. */}
      <motion.div
        style={{ y }}
        className="container-px relative z-10 grid w-full items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]"
      >
        <div>
          <h1 className="font-display text-[clamp(2.6rem,7vw,5.4rem)] font-bold leading-[0.98] tracking-tight">
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
            GESIPA, GEDORE, CEJN, Hoffmann Group, Legris &amp; more.
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
              <Link to="/contact" className="btn-ghost">
                Get a Quote <ArrowUpRight className="h-4 w-4" />
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
