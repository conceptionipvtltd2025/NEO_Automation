import { cn } from "@/lib/utils";
import { asset } from "@/lib/asset";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "logo-mark h-[4.5rem] w-[4.5rem] shrink-0 xl:h-[5.25rem] xl:w-[5.25rem]",
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
}: {
  className?: string;
  showWord?: boolean;
}) {
  return (
    <span className={cn("logo-lockup group flex items-center gap-4 xl:gap-5", className)}>
      <LogoMark />
      {showWord && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[2.3rem] font-bold leading-none tracking-tight text-white xl:text-[2.65rem]">
            N<span className="text-neo-500">E</span><span>O</span>
          </span>
          <span className="mt-2 text-[12px] font-semibold uppercase tracking-[0.4em] text-steel-400 transition-colors duration-300 group-hover:text-steel-300 xl:mt-2.5 xl:text-[13px] xl:tracking-[0.36em]">
            Automation
          </span>
        </span>
      )}
    </span>
  );
}