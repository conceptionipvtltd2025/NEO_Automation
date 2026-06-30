import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Clock } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

// YouTube video shown on the homepage. Swap the ID to change the clip.
const YT_ID = "dDjZkJ9iWHI";
// High-res industrial poster (welding/sparks) — same image used on the old SWF band.
const POSTER =
  "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=2000&q=80";

// Caption shown over the poster (edit to taste).
const VIDEO_TITLE = "Engineering Tomorrow's Industry";
const VIDEO_META = "Watch the showreel";

export function VideoSection() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="relative py-16">
      <div className="pointer-events-none absolute inset-0 bg-radial-glow opacity-40" />
      <div className="container-px relative">
        <SectionHeading
          align="center"
          eyebrow="Watch"
          title="See Neo Automation in action"
          subtitle="A quick look at the precision tooling, smart tightening and service expertise behind every installation we deliver."
        />

        <Reveal delay={0.1}>
          <div className="group relative mx-auto mt-14 h-[360px] w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 shadow-card sm:h-[440px] lg:h-[520px]">
            {/* crisp inner edge */}
            <div className="pointer-events-none absolute inset-0 z-20 rounded-3xl ring-1 ring-inset ring-white/10" />

            {playing ? (
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${YT_ID}?autoplay=1&rel=0&modestbranding=1`}
                title="Neo Automation video"
                allow="accelerated-fullscreen; autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                aria-label="Play video"
                className="absolute inset-0 h-full w-full text-left"
              >
                {/* Poster */}
                <img
                  src={POSTER}
                  alt="Neo Automation video thumbnail"
                  loading="lazy"
                  className="h-full w-full scale-105 object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-110"
                />

                {/* Cinematic darkening — makes the play button + caption pop and
                    mutes any text baked into the YouTube thumbnail. */}
                <div className="absolute inset-0 bg-ink-950/45" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/25 to-ink-950/15" />
                <div className="absolute inset-0 bg-gradient-to-r from-ink-950/55 via-transparent to-ink-950/35" />

                {/* Play button with double pulse ring */}
                <span className="absolute left-1/2 top-1/2 z-10 grid -translate-x-1/2 -translate-y-1/2 place-items-center">
                  <motion.span
                    aria-hidden
                    animate={{ scale: [1, 1.6, 1], opacity: [0.45, 0, 0.45] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
                    className="absolute h-24 w-24 rounded-full bg-neo-600/40"
                  />
                  <motion.span
                    aria-hidden
                    animate={{ scale: [1, 1.35, 1], opacity: [0.35, 0, 0.35] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
                    className="absolute h-24 w-24 rounded-full bg-neo-600/40"
                  />
                  <span className="relative grid h-24 w-24 place-items-center rounded-full bg-neo-600 text-pure shadow-[0_10px_50px_-6px_rgba(237,28,36,0.85)] transition-transform duration-300 group-hover:scale-110">
                    <Play className="ml-1.5 h-10 w-10 fill-current" />
                  </span>
                </span>

                {/* Caption — bottom-left, SWF style */}
                <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-9">
                  <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">
                    {VIDEO_TITLE}
                  </h3>
                  <p className="mt-1.5 flex items-center gap-2 text-sm text-steel-300">
                    <Clock className="h-3.5 w-3.5" /> {VIDEO_META}
                  </p>
                </div>
              </button>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
