import { motion } from "framer-motion";
import { ShieldCheck, Sparkles } from "lucide-react";

/**
 * Generic branded banner shown on the right of every PageHeader when a page
 * doesn't supply its own `media`. Pure CSS/SVG — no images to manage — so it
 * stays crisp, fast and on-brand on any page (About, Contact, Legal, …).
 */
export function DefaultHeaderArt() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-sm">
      {/* Soft brand glow */}
      <div className="pointer-events-none absolute inset-8 rounded-full bg-neo-600/20 blur-3xl" />

      {/* Concentric rings */}
      {[100, 78, 56].map((size, i) => (
        <motion.div
          key={size}
          aria-hidden
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
          style={{ width: `${size}%`, height: `${size}%` }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 40 + i * 12, repeat: Infinity, ease: "linear" }}
        >
          {/* a dot riding on each ring */}
          <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neo-500 shadow-[0_0_12px_2px_rgba(237,28,36,0.6)]" />
        </motion.div>
      ))}

      {/* Center emblem */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-1/2 grid h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-3xl border border-white/10 bg-ink-900/80 shadow-2xl shadow-black/50 backdrop-blur-md"
      >
        <span className="font-display text-[clamp(1.5rem,3.5vw,2.4rem)] font-bold tracking-tight text-white">
          NE<span className="text-neo-500">O</span>
        </span>
      </motion.div>

      {/* Floating accent chips */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-1 top-6 flex items-center gap-2 rounded-2xl border border-white/10 bg-ink-900/90 px-3.5 py-2.5 shadow-xl shadow-black/40 backdrop-blur-md"
      >
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-neo-600/15 text-neo-400">
          <ShieldCheck className="h-4 w-4" />
        </span>
        <div className="leading-tight">
          <p className="text-xs font-semibold text-white">Authorised</p>
          <p className="text-[10px] text-steel-400">Distributor</p>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        className="absolute -right-1 bottom-8 flex items-center gap-2 rounded-2xl border border-white/10 bg-ink-900/90 px-3.5 py-2.5 shadow-xl shadow-black/40 backdrop-blur-md"
      >
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-volt-500/15 text-volt-400">
          <Sparkles className="h-4 w-4" />
        </span>
        <div className="leading-tight">
          <p className="text-xs font-semibold text-white">19+ Years</p>
          <p className="text-[10px] text-steel-400">Engineering</p>
        </div>
      </motion.div>
    </div>
  );
}
