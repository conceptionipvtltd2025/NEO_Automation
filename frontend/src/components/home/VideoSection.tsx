import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Clock } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { asset } from "@/lib/asset";

// YouTube video shown on the homepage. Swap the ID to change the clip.
// Currently: Atlas Copco — "Smart Integrated Assembly | Realizing the potential
// of Industry 4.0"  →  youtube.com/watch?v=vqNblg2TgPU
const YT_ID = "vqNblg2TgPU";
// The poster is the video's OWN thumbnail, taken straight from the YouTube CDN
// and keyed off YT_ID — so changing the ID above changes the cover with it, no
// second edit and no stale frame from a previous clip.
// `maxresdefault` only exists for videos uploaded in HD; onError below steps
// down to `hqdefault` (always present) and finally to our local brand frame, so
// the card can never render broken.
const POSTER = `https://i.ytimg.com/vi/${YT_ID}/maxresdefault.jpg`;
const POSTER_FALLBACK = `https://i.ytimg.com/vi/${YT_ID}/hqdefault.jpg`;
const POSTER_LOCAL = asset("images/showreel-poster.jpg");

// Caption shown over the poster. It names the actual film and credits the brand
// that made it — this is a partner's corporate video, not a Neo showreel, and
// captioning it as ours would be a claim we can't make. It sits TOP-left: this
// thumbnail carries the Atlas Copco logo and its own two-line title along the
// bottom edge, which is where the caption used to be.
const VIDEO_TITLE = "Smart Integrated Assembly";
const VIDEO_META = "Industry 4.0 · Atlas Copco";

export function VideoSection() {
  const [playing, setPlaying] = useState(false);

  return (
    <section id="video" className="relative py-16">
      <div className="pointer-events-none absolute inset-0 bg-radial-glow opacity-40" />
      <div className="container-px relative">
        <SectionHeading
          align="center"
          eyebrow="Watch"
          title="See Neo Automation in action"
          subtitle="A quick look at the precision tooling, smart tightening and service expertise behind every installation we deliver."
        />

        <Reveal delay={0.1}>
          {/* force-dark pins the dark token set inside the card. Without it the
              "cinematic darkening" scrims below become cinematic *lightening*
              in the light theme (ink-950 flips to pale platinum), which bleached
              the poster to near-white and turned the white caption near-black. */}
          <div className="force-dark group relative mx-auto mt-14 h-[360px] w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 shadow-card sm:h-[440px] lg:h-[520px]">
            {/* crisp inner edge */}
            <div className="pointer-events-none absolute inset-0 z-20 rounded-3xl ring-1 ring-inset ring-white/10" />

            {playing ? (
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${YT_ID}?autoplay=1&rel=0&modestbranding=1`}
                title={`${VIDEO_TITLE} — ${VIDEO_META}`}
                // "accelerated-fullscreen" is not a real Permissions-Policy
                // token; the one that actually grants an embed fullscreen is
                // "fullscreen" (alongside the allowFullScreen attribute).
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                aria-label="Play video"
                className="absolute inset-0 h-full w-full text-left"
              >
                {/* Poster — the video's own thumbnail, with two graceful
                    step-downs if YouTube doesn't hold that size. */}
                <img
                  src={POSTER}
                  alt={`${VIDEO_TITLE} — video thumbnail`}
                  loading="lazy"
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (img.dataset.step === "local") return;
                    if (img.dataset.step === "hq") {
                      img.dataset.step = "local";
                      img.src = POSTER_LOCAL;
                    } else {
                      img.dataset.step = "hq";
                      img.src = POSTER_FALLBACK;
                    }
                  }}
                  className="h-full w-full scale-105 object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-110"
                />

                {/* A restrained vignette, not the old blanket dimming: the
                    thumbnail is the point now, so it only needs enough contrast
                    for the play button and the top-left caption to read. */}
                <div className="absolute inset-0 bg-ink-950/25" />
                <div className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-transparent to-ink-950/45" />

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

                {/* Caption — TOP-left, clear of the logo and title burned into
                    the bottom of the YouTube thumbnail. */}
                <div className="absolute inset-x-0 top-0 z-10 p-6 sm:p-8">
                  <h3 className="font-display text-xl font-bold text-white sm:text-2xl">
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
