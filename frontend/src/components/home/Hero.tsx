import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Linkedin, Instagram, Facebook } from "lucide-react";
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

// X (Twitter) has no non-deprecated lucide glyph, so we inline the mark — same
// approach as the footer so the hero social row matches the rest of the site.
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

// Same links/order as the footer (site.social) so the two stay in sync.
// `color` is the brand hover-fill; `fg` is the icon colour on that fill so it
// always stays legible (X fills black, everything else fills its bright brand hue).
const socials = [
  { icon: Linkedin, href: site.social.linkedin, label: "LinkedIn", color: "#0a66c2", fg: "#ffffff" },
  { icon: Facebook, href: site.social.facebook, label: "Facebook", color: "#1877f2", fg: "#ffffff" },
  { icon: Instagram, href: site.social.instagram, label: "Instagram", color: "#e1306c", fg: "#ffffff" },
  { icon: XIcon, href: site.social.twitter, label: "X", color: "#000000", fg: "#ffffff" },
];


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
        if (entry.isIntersecting) v.play().catch(() => { });
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
            e.currentTarget.play().catch(() => { });
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
                  className="inline-block text-white"
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
                className="inline-block text-white"
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
            Delivering innovative solutions that improve{" "}
            <span className="font-medium text-neo-500">Productivity, Quality, Safety</span>,
            and <span className="font-medium text-neo-500">Traceability</span> in manufacturing operations.
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
            className="mt-12 grid max-w-2xl grid-cols-2 items-start gap-x-6 gap-y-6 sm:grid-cols-4"
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
                <div className="mt-1.5 text-[12.5px] uppercase leading-snug tracking-wider text-steel-300">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Social links — mirrors the footer's set (site.social). Each tile
              carries a soft brand tint at rest and fills with its brand colour on
              hover, with a glow + shine sweep for an eye-catching finish. */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1 }}
            className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-4"
          >
            <span className="flex items-center gap-3">
              <span className="bg-gradient-to-r from-white to-steel-400 bg-clip-text text-[13px] font-semibold uppercase tracking-[0.3em] text-transparent">
                Follow us
              </span>
              <span className="h-px w-10 bg-gradient-to-r from-neo-500 to-transparent" />
            </span>
            <div className="flex items-center gap-3">
              {socials.map((s, i) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  initial={{ opacity: 0, scale: 0.5, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 18,
                    delay: 1.05 + i * 0.09,
                  }}
                  whileHover={{ y: -5, scale: 1.06 }}
                  whileTap={{ scale: 0.92 }}
                  style={{ "--brand": s.color, "--fg": s.fg } as React.CSSProperties}
                  className="group relative grid h-11 w-11 place-items-center overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md transition-[border-color,box-shadow] duration-300 hover:border-[color:var(--brand)] hover:shadow-[0_14px_34px_-10px_var(--brand),inset_0_1px_0_rgba(255,255,255,0.25)]"
                >
                  {/* resting brand tint — subtle so the row reads coloured, not gray */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-300 group-hover:opacity-0"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 120%, color-mix(in srgb, var(--brand) 30%, transparent), transparent 75%)",
                    }}
                  />
                  {/* full brand fill that rises in on hover */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 translate-y-full transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0"
                    style={{
                      background:
                        "linear-gradient(160deg, color-mix(in srgb, var(--brand) 92%, white) 0%, var(--brand) 100%)",
                    }}
                  />
                  {/* diagonal shine sweep */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-full"
                  />
                  <s.icon
                    className="relative h-[18px] w-[18px] drop-shadow-sm transition-transform duration-300 group-hover:scale-110"
                    style={{ color: "var(--fg)" }}
                  />
                </motion.a>
              ))}
            </div>
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
