import { useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SpotlightCard({
  children,
  className,
  spotColor = "rgba(237,28,36,0.18)",
}: {
  children: ReactNode;
  className?: string;
  spotColor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-ink-850/60 backdrop-blur-md transition-all duration-500 will-change-transform hover:-translate-y-1.5 hover:border-neo-600/40 hover:shadow-[0_28px_60px_-26px_rgba(237,28,36,0.45)]",
        className
      )}
    >
      {/* cursor-tracking spotlight */}
      <div
        className="pointer-events-none absolute -inset-px z-[1] opacity-0 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(440px circle at ${pos.x}px ${pos.y}px, ${spotColor}, transparent 46%)`,
        }}
      />
      {/* soft accent rim that fades in on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(130deg, rgba(237,28,36,0.10), transparent 40%, rgba(34,184,255,0.08))",
        }}
      />
      {children}
    </div>
  );
}
