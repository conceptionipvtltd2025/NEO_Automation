import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Target, Eye, Award, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { asset } from "@/lib/asset";

const SM_UP = "(min-width: 640px)";

/** True from Tailwind's `sm` up: the badges only float over the photo there. */
function useSmUp() {
  const [match, setMatch] = useState(
    () => typeof window !== "undefined" && window.matchMedia(SM_UP).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(SM_UP);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return match;
}

export function AboutTeaser() {
  const reduce = useReducedMotion();
  const smUp = useSmUp();
  return (
    <section className="relative py-10 sm:py-16">
      <div className="container-px grid items-center gap-12 lg:grid-cols-2">
        {/* Visual */}
        <Reveal>
          <div className="relative">
            <div className="force-dark relative overflow-hidden rounded-3xl border border-white/10 shadow-card">
              <img
                src={asset("images/team/founder-baldev-solanki-wide.jpg")}
                alt="Mr. Baldev Solanki, founder of Neo Automation"
                width={1066}
                height={800}
                className="aspect-[4/3] w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 to-transparent" />
              <div className="absolute bottom-5 left-5 sm:bottom-6 sm:left-6">
                <p className="font-display text-base font-semibold text-pure sm:text-lg">
                  Mr. Baldev Solanki
                </p>
                <p className="text-[13px] text-pure/70">Founder, Neo Automation</p>
              </div>
            </div>

            {/* Phones: the two badges sit in a row UNDER the photo — floated
                over its corner they covered the founder's name caption.
                From sm they float over the frame again (`sm:contents` lets
                them position against the wrapper above). */}
            <div className="mt-4 grid grid-cols-2 gap-3 sm:contents">
              <motion.div
                animate={reduce || !smUp ? { y: 0 } : { y: [0, -10, 0] }}
                transition={reduce || !smUp ? { duration: 0.3 } : { duration: 5, repeat: Infinity }}
                className="glass-strong min-w-0 rounded-2xl p-4 shadow-card sm:absolute sm:-bottom-6 sm:-right-6 sm:p-5"
              >
                <div className="flex items-center gap-3">
                  <Award className="h-7 w-7 shrink-0 text-neo-500 sm:h-8 sm:w-8" />
                  <div className="min-w-0">
                    <p className="font-display text-xl font-bold text-white sm:text-2xl">
                      <Counter value={19} suffix="+" />
                    </p>
                    <p className="text-xs text-steel-400">Years of excellence</p>
                  </div>
                </div>
              </motion.div>

              <div className="min-w-0 rounded-2xl border border-white/10 bg-ink-900/80 p-4 backdrop-blur-xl sm:absolute sm:-left-4 sm:top-8 sm:px-4 sm:py-3">
                <p className="font-display text-xl font-bold text-white">Genuine</p>
                <p className="text-xs text-steel-400 sm:text-[13px]">Authorised distribution</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Text */}
        <div>
          <Reveal>
            <span className="eyebrow">
              <span className="h-1 w-1 rounded-full bg-neo-500" /> Who We Are
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-display text-[clamp(1.9rem,4vw,3rem)] font-bold leading-[1.06] text-gradient">
              A Partner Engineered for Precision &amp; Trust
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-5 text-base leading-relaxed text-steel-400">
              Neo Automation brings world-class industrial tools and automation
              solutions to the Indian manufacturing industry. As an authorised
              distributor of leading global brands, we provide genuine equipment
              backed by expert engineering support, on-site service, and rapid
              spare-parts availability.
            </p>
          </Reveal>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              { icon: Target, title: "Our Mission", text: "Empower every factory floor with precision, traceable tooling." },
              { icon: Eye, title: "Our Vision", text: "To be India's most trusted automation solutions partner." },
            ].map((m, i) => (
              <Reveal key={m.title} delay={0.2 + i * 0.08}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-neo-600/15 text-neo-400">
                    <m.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-semibold text-white">
                    {m.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-steel-400">
                    {m.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.36}>
            <Link to="/about" className="btn-ghost mt-8 text-[14.5px]">
              More about Neo <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
