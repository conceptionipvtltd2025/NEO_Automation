import { type ReactNode } from "react";
import { WordsReveal, Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  action?: ReactNode;
}) {
  const centered = align === "center";
  return (
    <div
      className={cn(
        "flex flex-col gap-3.5 sm:gap-5",
        centered && "items-center text-center",
        !centered && action && "md:flex-row md:items-end md:justify-between",
        className
      )}
    >
      <div className={cn("max-w-2xl", centered && "mx-auto")}>
        {eyebrow && (
          <Reveal>
            <span className="eyebrow">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neo-500/70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-neo-500" />
              </span>
              {eyebrow}
            </span>
          </Reveal>
        )}
        <h2 className="mt-3.5 font-display text-[clamp(1.55rem,5.2vw,3.1rem)] font-bold leading-[1.08] tracking-tight text-gradient sm:mt-5">
          <WordsReveal text={title} />
        </h2>
        {subtitle && (
          <Reveal delay={0.1}>
            {/* The section sub-heading is the first real sentence a visitor
                reads, so it is set as intro copy rather than a caption:
                15/17.5px (was 14/16) on steel-200 (was steel-400). The old
                grey sat around 6:1 on the site's tinted section bands — legible
                by the letter of AA but visibly washed out, and the first thing
                anyone reading at arm's length complains about. max-w-prose
                caps the measure so a long subtitle does not run to a
                hard-to-track 100+ characters per line. */}
            <p className={cn(
                "mt-2.5 max-w-prose text-[15px] leading-relaxed text-steel-200 sm:mt-4 sm:text-[17.5px]",
                centered && "mx-auto"
              )}>
              {subtitle}
            </p>
          </Reveal>
        )}
      </div>
      {action && !centered && <Reveal delay={0.15}>{action}</Reveal>}
    </div>
  );
}
