import { Link } from "react-router-dom";
import { ArrowUpRight, PhoneCall } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Magnetic } from "@/components/ui/Magnetic";
import { Aurora, GridBackground } from "@/components/ui/Backgrounds";
import { site } from "@/data/site";

export function CTABand() {
  return (
    <section className="container-px py-12">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-ink-900 px-8 py-16 text-center sm:px-12 sm:py-20">
          <GridBackground className="opacity-50" />
          <Aurora />
          <div className="relative z-10 mx-auto max-w-2xl">
            <span className="eyebrow">
              <span className="h-1 w-1 rounded-full bg-neo-500" /> Ready when you are
            </span>
            <h2 className="mt-6 font-display text-[clamp(2rem,5vw,3.6rem)] font-bold leading-[1.04] text-gradient">
              Let's build your most reliable line yet.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-base text-steel-400">
              Partner with Neo Automation for genuine tools, expert engineering
              and support that keeps you running.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Magnetic>
                <Link to="/inquiry" className="btn-primary">
                  Get a Quote <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Magnetic>
              <a href={`tel:${site.phone}`} className="btn-ghost">
                <PhoneCall className="h-4 w-4" /> {site.phone}
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
