import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { vibrationComparison } from "@/data/safetyInsights";
import { cn } from "@/lib/utils";

/**
 * Hand-arm vibration value vs Vibration Peak Magnitude (VPM), per tool type —
 * the figures from Atlas Copco's "New Vibration Standard" article.
 *
 * Chart rules: HAV and VPM are two measures on very different scales, so they
 * are NEVER on a shared axis — two small-multiple bar panels, same tool order,
 * one series (one colour) each, so no legend box: each panel's title names its
 * series. Values sit at the bar tips in text tokens, and hovering/focusing a
 * tool in either panel highlights it in both, with a readout line and a real
 * data table as the non-hover route to every number.
 *
 * Used by the /safety "Vibration, explained" card and by the insight article
 * pages (block type "vpm-chart").
 */

const nf = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 });
const fmt1 = (n: number) => n.toFixed(1);

type Panel = {
  key: "hav" | "vpm";
  title: string;
  max: number;
  ticks: number[];
  format: (n: number) => string;
  /** One series per panel → one bar colour, stepped per theme. */
  bar: string;
};

const panels: Panel[] = [
  {
    key: "hav",
    title: "Hand-arm vibration value (m/s²)",
    max: 7,
    ticks: [0, 2, 4, 6],
    format: fmt1,
    bar: "bg-volt-600 [.light_&]:bg-[#1f86c8]",
  },
  {
    key: "vpm",
    title: "Vibration peak magnitude, VPM (m/s²)",
    max: 1800,
    ticks: [0, 500, 1000, 1500],
    format: (n) => nf.format(n),
    bar: "bg-iris-500 [.light_&]:bg-iris-600",
  },
];

export function VpmChart({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = !!useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const hovered = active === null ? null : vibrationComparison[active];

  return (
    <div ref={ref} className={cn("relative min-w-0", className)}>
      <div
        className="relative grid gap-7 md:grid-cols-2 md:gap-6"
        onPointerLeave={() => setActive(null)}
      >
        {panels.map((p) => (
          <BarPanel
            key={p.key}
            panel={p}
            animate={inView || reduce}
            reduce={reduce}
            active={active}
            setActive={setActive}
          />
        ))}
      </div>

      {/* Shared readout — the hover/focus "tooltip", pinned so it can never
          overflow its card at narrow widths. */}
      <p
        className="relative mt-4 min-h-[2.75rem] rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-[13px] leading-snug text-steel-400"
        aria-hidden
      >
        {hovered ? (
          <>
            <span className="font-semibold text-white">{hovered.tool}</span>
            <span className="mx-1.5 text-steel-500">·</span>
            <span className="tabular-nums text-steel-200">
              {fmt1(hovered.hav)} m/s² hand-arm
            </span>
            <span className="mx-1.5 text-steel-500">·</span>
            <span className="tabular-nums text-steel-200">
              {nf.format(hovered.vpm)} m/s² VPM
            </span>
          </>
        ) : (
          "Hover or tap a bar to compare one tool across both panels."
        )}
      </p>

      <details className="group/details relative mt-4 rounded-xl border border-white/10 bg-white/[0.02]">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3.5 py-2.5 text-[13px] font-semibold text-steel-200 transition-colors hover:text-white [&::-webkit-details-marker]:hidden">
          View the data as a table
          <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open/details:rotate-180" />
        </summary>
        <div className="overflow-x-auto px-3.5 pb-3">
          <table className="w-full min-w-[16rem] text-left text-[13px]">
            <caption className="sr-only">
              Hand-arm vibration value and Vibration Peak Magnitude by tool type, in m/s²
            </caption>
            <thead>
              <tr className="border-b border-white/10 text-steel-500">
                <th scope="col" className="py-2 pr-3 font-semibold">Tool</th>
                <th scope="col" className="py-2 pr-3 text-right font-semibold">Hand-arm (m/s²)</th>
                <th scope="col" className="py-2 text-right font-semibold">VPM (m/s²)</th>
              </tr>
            </thead>
            <tbody>
              {vibrationComparison.map((r) => (
                <tr key={r.tool} className="border-b border-white/[0.06] last:border-0">
                  <th scope="row" className="py-2 pr-3 font-medium text-steel-300">{r.tool}</th>
                  <td className="py-2 pr-3 text-right tabular-nums text-white">{fmt1(r.hav)}</td>
                  <td className="py-2 text-right tabular-nums text-white">{nf.format(r.vpm)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

function BarPanel({
  panel,
  animate,
  reduce,
  active,
  setActive,
}: {
  panel: Panel;
  animate: boolean;
  reduce: boolean;
  active: number | null;
  setActive: (i: number | null) => void;
}) {
  const pct = (v: number) => (v / panel.max) * 100;

  return (
    <figure className="min-w-0">
      <figcaption className="text-[13px] font-semibold text-white">{panel.title}</figcaption>

      {/* The track is inset from the right so a label at the tip of the longest
          bar still has room; gridlines and ticks live inside the same track. */}
      <div className="mr-11 mt-3">
        <div className="relative">
          {/* gridlines — span the bar rows only, never the tick labels */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            {panel.ticks.map((t) => (
              <span
                key={t}
                className={cn(
                  "absolute inset-y-0 w-px",
                  t === 0 ? "bg-white/25" : "bg-white/[0.08]"
                )}
                style={{ left: `${pct(t)}%` }}
              />
            ))}
          </div>

          <ul className="relative space-y-2.5">
            {vibrationComparison.map((row, i) => {
              const v = row[panel.key];
              const label = `${row.tool} — ${panel.format(v)} m/s²`;
              const dim = active !== null && active !== i;
              return (
                <li
                  key={row.tool}
                  tabIndex={0}
                  aria-label={label}
                  title={label}
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  className={cn(
                    "-mx-1 cursor-default rounded-md px-1 py-0.5 outline-none transition-opacity duration-200 focus-visible:ring-2 focus-visible:ring-volt-400/70",
                    dim && "opacity-40"
                  )}
                >
                  <span className="block pl-2 text-[12.5px] leading-snug text-steel-300">
                    {row.tool}
                  </span>
                  <span className="relative mt-1 flex h-3.5 items-center">
                    <motion.span
                      aria-hidden
                      className={cn(
                        "block h-3 origin-left rounded-r-[4px] transition-[filter] duration-200",
                        panel.bar,
                        active === i && "brightness-110"
                      )}
                      style={{ width: `${pct(v)}%` }}
                      initial={reduce ? false : { scaleX: 0 }}
                      animate={animate ? { scaleX: 1 } : { scaleX: 0 }}
                      transition={{
                        duration: reduce ? 0 : 0.9,
                        delay: reduce ? 0 : 0.15 + i * 0.08,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    />
                    <motion.span
                      aria-hidden
                      className={cn(
                        "absolute whitespace-nowrap pl-1.5 text-[12px] font-semibold tabular-nums",
                        active === i ? "text-white" : "text-steel-200"
                      )}
                      style={{ left: `${pct(v)}%` }}
                      initial={reduce ? false : { opacity: 0 }}
                      animate={animate ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : 0.6 + i * 0.08 }}
                    >
                      {panel.format(v)}
                    </motion.span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* tick labels */}
        <div aria-hidden className="relative mt-2 h-4">
          {panel.ticks.map((t) => (
            <span
              key={t}
              className={cn(
                "absolute top-0 text-[11px] tabular-nums text-steel-500",
                t === 0 ? "" : "-translate-x-1/2"
              )}
              style={{ left: `${pct(t)}%` }}
            >
              {panel.key === "hav" ? t : nf.format(t)}
            </span>
          ))}
        </div>
      </div>
    </figure>
  );
}
