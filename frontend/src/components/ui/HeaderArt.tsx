import { motion } from "framer-motion";
import {
  Package,
  Wrench,
  Cpu,
  Factory,
  Car,
  Plane,
  Server,
  MapPin,
  Cog,
  Settings,
  FileText,
  ShieldCheck,
  Quote,
  Send,
} from "lucide-react";

/**
 * Per-page animated header art. Each PageHeader can pass one of these as its
 * `media` so every page gets a distinct, on-brand motif. All are pure CSS/SVG +
 * framer-motion — no images, so nothing can 404 and they stay crisp at any size.
 *
 * Shared shell keeps sizing/positioning consistent across variants.
 */
function Stage({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-sm">
      <div className="pointer-events-none absolute inset-10 rounded-full bg-neo-600/20 blur-3xl" />
      {children}
    </div>
  );
}

/* ───────────────────────── Products — drifting tool cards ───────────────────────── */
export function ProductsHeaderArt() {
  const cards = [
    { icon: Package, label: "Tools", x: "8%", y: "12%", d: 0, accent: "text-neo-400 bg-neo-600/15" },
    { icon: Wrench, label: "Tackles", x: "52%", y: "30%", d: 0.6, accent: "text-volt-400 bg-volt-500/15" },
    { icon: Cpu, label: "Smart", x: "20%", y: "58%", d: 1.1, accent: "text-amber-400 bg-amber-500/15" },
  ];
  return (
    <Stage>
      {cards.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [0, i % 2 ? 12 : -12, 0] }}
          transition={{
            opacity: { duration: 0.5, delay: c.d },
            y: { duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: c.d },
          }}
          style={{ left: c.x, top: c.y }}
          className="absolute flex w-40 items-center gap-3 rounded-2xl border border-white/10 bg-ink-900/90 px-4 py-3 shadow-xl shadow-black/40 backdrop-blur-md"
        >
          <span className={`grid h-10 w-10 place-items-center rounded-xl ${c.accent}`}>
            <c.icon className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-white">{c.label}</p>
            <p className="text-[10px] text-steel-400">Catalogue</p>
          </div>
        </motion.div>
      ))}
    </Stage>
  );
}

/* ───────────────────────── Industries — orbiting sector icons ───────────────────────── */
export function IndustriesHeaderArt() {
  const orbit = [Car, Plane, Server, Factory];
  return (
    <Stage>
      {/* center hub */}
      <motion.div
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl border border-white/10 bg-ink-900/85 shadow-2xl shadow-black/50 backdrop-blur-md"
      >
        <Factory className="h-9 w-9 text-neo-500" />
      </motion.div>

      {/* rotating ring carrying the sector icons */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/10"
      >
        {orbit.map((Icon, i) => {
          const angle = (i / orbit.length) * 360;
          return (
            <div
              key={i}
              className="absolute left-1/2 top-1/2"
              style={{ transform: `rotate(${angle}deg) translateY(-50%) translateX(-50%)` }}
            >
              {/* counter-rotate so each icon stays upright */}
              <motion.span
                animate={{ rotate: -360 }}
                transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
                className="grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-ink-900/90 text-steel-200 shadow-lg backdrop-blur-md"
              >
                <Icon className="h-5 w-5" />
              </motion.span>
            </div>
          );
        })}
      </motion.div>
    </Stage>
  );
}

/* ───────────────────────── Contact — pulsing map pin + radar ───────────────────────── */
export function ContactHeaderArt() {
  return (
    <Stage>
      {/* radar rings */}
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-neo-500/30"
          initial={{ width: 60, height: 60, opacity: 0.7 }}
          animate={{ width: 260, height: 260, opacity: 0 }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: i }}
        />
      ))}
      {/* pin */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-neo-600 text-pure shadow-[0_8px_30px_-6px_rgba(237,28,36,0.7)]"
      >
        <MapPin className="h-8 w-8" />
      </motion.div>
    </Stage>
  );
}

/* ───────────────────────── NSW — meshing service gears ───────────────────────── */
export function NSWHeaderArt() {
  return (
    <Stage>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute left-[30%] top-[34%] grid h-32 w-32 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-ink-900/70 text-neo-400 shadow-2xl shadow-black/50 backdrop-blur-md"
      >
        <Cog className="h-24 w-24" strokeWidth={1} />
      </motion.div>
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        className="absolute left-[62%] top-[62%] grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-ink-900/70 text-volt-400 shadow-2xl shadow-black/50 backdrop-blur-md"
      >
        <Settings className="h-16 w-16" strokeWidth={1} />
      </motion.div>
    </Stage>
  );
}

/* ───────────────────────── About — concentric brand rings + emblem ───────────────────────── */
export function AboutHeaderArt() {
  return (
    <Stage>
      {[100, 76, 52].map((size, i) => (
        <motion.div
          key={size}
          aria-hidden
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
          style={{ width: `${size}%`, height: `${size}%` }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 38 + i * 10, repeat: Infinity, ease: "linear" }}
        >
          <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neo-500 shadow-[0_0_12px_2px_rgba(237,28,36,0.6)]" />
        </motion.div>
      ))}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-1/2 grid h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-3xl border border-white/10 bg-ink-900/80 shadow-2xl shadow-black/50 backdrop-blur-md"
      >
        <span className="font-display text-[clamp(2rem,4.5vw,3.2rem)] font-bold tracking-tight text-white">
          NE<span className="text-neo-500">O</span>
        </span>
      </motion.div>
    </Stage>
  );
}

/* ───────────────────────── Inquiry — floating quote card + send ───────────────────────── */
export function InquiryHeaderArt() {
  return (
    <Stage>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: [0, -10, 0] }}
        transition={{ opacity: { duration: 0.5 }, y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
        className="absolute left-1/2 top-1/2 w-56 -translate-x-1/2 -translate-y-1/2 space-y-3 rounded-2xl border border-white/10 bg-ink-900/90 p-5 shadow-2xl shadow-black/50 backdrop-blur-md"
      >
        <Quote className="h-6 w-6 text-neo-500" />
        <div className="space-y-2">
          <div className="h-2.5 w-full rounded-full bg-white/10" />
          <div className="h-2.5 w-4/5 rounded-full bg-white/10" />
          <div className="h-2.5 w-2/3 rounded-full bg-white/10" />
        </div>
        <div className="flex items-center justify-end">
          <span className="flex items-center gap-1.5 rounded-full bg-neo-600 px-3 py-1.5 text-[11px] font-semibold text-pure">
            Send <Send className="h-3 w-3" />
          </span>
        </div>
      </motion.div>
    </Stage>
  );
}

/* ───────────────────────── Legal — shield + document lines ───────────────────────── */
export function LegalHeaderArt() {
  return (
    <Stage>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
        transition={{ opacity: { duration: 0.5 }, y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
        className="absolute left-1/2 top-1/2 w-52 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-ink-900/90 p-6 shadow-2xl shadow-black/50 backdrop-blur-md"
      >
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-neo-600/15 text-neo-400">
          <FileText className="h-6 w-6" />
        </div>
        <div className="mt-5 space-y-2.5">
          {[100, 85, 92, 70].map((w, i) => (
            <div key={i} className="h-2 rounded-full bg-white/10" style={{ width: `${w}%` }} />
          ))}
        </div>
      </motion.div>
      {/* floating shield seal */}
      <motion.span
        animate={{ rotate: [0, 8, 0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-2 top-6 grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-ink-900/90 text-emerald-400 shadow-xl backdrop-blur-md"
      >
        <ShieldCheck className="h-6 w-6" />
      </motion.span>
    </Stage>
  );
}
