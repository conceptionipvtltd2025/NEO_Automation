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
            <p className="mt-2.5 text-[14px] leading-relaxed text-steel-400 sm:mt-4 sm:text-base">
              {subtitle}
            </p>
          </Reveal>
        )}
      </div>
      {action && !centered && <Reveal delay={0.15}>{action}</Reveal>}
    </div>
  );
}
