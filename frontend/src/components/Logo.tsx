import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span className={cn("logo-medallion h-[4.5rem] w-[4.5rem] shrink-0", className)}>
      <img
        src="/images/logo.png"
        alt="NEO Logo"
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
    <span className={cn("flex items-center gap-3", className)}>
      <LogoMark />
      {showWord && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-2xl font-bold tracking-tight text-white">
            NE<span className="text-neo-600">O</span>
          </span>
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.38em] text-steel-400">
            Automation
          </span>
        </span>
      )}
    </span>
  );
}