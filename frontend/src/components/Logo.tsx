import { cn } from "@/lib/utils";
import { asset } from "@/lib/asset";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span className={cn("logo-mark h-14 w-14 shrink-0", className)}>
      <img
        src={asset("images/logo.png")}
        alt="NEO Automation"
        className="h-full w-full object-cover"
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
    <span className={cn("logo-lockup group flex items-center gap-3.5", className)}>
      <LogoMark />
      {showWord && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[1.7rem] font-bold leading-none tracking-tight text-white">
            NE<span className="text-neo-500">O</span>
          </span>
          <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.42em] text-steel-400 transition-colors duration-300 group-hover:text-steel-300">
            Automation
          </span>
        </span>
      )}
    </span>
  );
}