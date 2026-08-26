import { cn } from "@/lib/utils";
import { asset } from "@/lib/asset";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "logo-mark h-[3.75rem] w-[3.75rem] shrink-0 lg:h-[4.15rem] lg:w-[4.15rem] xl:h-[4.75rem] xl:w-[4.75rem]",
        className
      )}
    >
      <img
        src={asset("images/logo.png")}
        alt="NEO Automation"
        className="h-full w-full object-contain"
      />
    </span>
  );
}

export function Logo({
  className,
  showWord = true,
  compact = false,
}: {
  className?: string;
  showWord?: boolean;
  /**
   * Smaller lockup for narrow containers. The full-size one is tuned for the
   * marketing header and overflows a 16rem admin sidebar — the wide letter
   * spacing on "AUTOMATION" alone is ~123px before the mark and gap.
   */
  compact?: boolean;
}) {
  return (
    <span
      className={cn(
        "logo-lockup group flex min-w-0 items-center",
        compact ? "gap-2.5" : "gap-3.5 xl:gap-4",
        className
      )}
    >
      <LogoMark className={compact ? "h-11 w-11 xl:h-11 xl:w-11" : undefined} />
      {showWord && (
        <span className="flex min-w-0 flex-col leading-none">
          <span
            className={cn(
              "font-display font-bold leading-none tracking-tight text-white",
              compact ? "text-[1.35rem]" : "text-[1.95rem] lg:text-[2.15rem] xl:text-[2.4rem]"
            )}
          >
            N<span className="text-neo-500">E</span><span>O</span>
          </span>
          <span
            className={cn(
              "truncate font-semibold uppercase text-steel-400 transition-colors duration-300 group-hover:text-steel-300",
              compact
                ? "mt-1 text-[11px] tracking-[0.24em]"
                : "mt-1.5 text-[11.5px] tracking-[0.32em] lg:text-[12.5px] xl:mt-2 xl:text-[13px] xl:tracking-[0.3em]"
            )}
          >
            Automation
          </span>
        </span>
      )}
    </span>
  );
}