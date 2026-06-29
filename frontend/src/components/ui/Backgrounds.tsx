import { cn } from "@/lib/utils";

export function GridBackground({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 bg-grid-dark [background-size:44px_44px] mask-fade-b",
        className
      )}
    />
  );
}

export function Aurora({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="absolute -top-1/3 left-1/4 h-[60vh] w-[60vh] rounded-full bg-neo-600/20 blur-[120px] animate-pulse-glow" />
      <div className="absolute top-1/4 right-1/4 h-[50vh] w-[50vh] rounded-full bg-volt-500/10 blur-[120px] animate-pulse-glow [animation-delay:1.4s]" />
      <div className="absolute bottom-0 left-1/2 h-[40vh] w-[70vh] -translate-x-1/2 rounded-full bg-neo-700/10 blur-[120px]" />
    </div>
  );
}

/**
 * Site-wide animated colour field. Fixed behind all content; its drifting
 * brand-coloured blobs show through transparent sections so the whole page
 * breathes colour in both themes. Strength is theme-tuned in index.css via
 * `--ambient-opacity`. Honors prefers-reduced-motion (animations disabled).
 */
export function AmbientBackground() {
  return (
    <div aria-hidden className="ambient-mesh">
      <span className="ambient-blob-1" />
      <span className="ambient-blob-2" />
      <span className="ambient-blob-3" />
    </div>
  );
}

export function NoiseOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] opacity-[0.035] mix-blend-overlay"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}

export function SectionGlow({
  color = "237,28,36",
  className,
}: {
  color?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute left-1/2 top-0 h-[1px] w-2/3 -translate-x-1/2",
        className
      )}
      style={{
        background: `linear-gradient(90deg, transparent, rgba(${color},0.7), transparent)`,
      }}
    />
  );
}
