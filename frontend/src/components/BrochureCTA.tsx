import { Download, FileText, ArrowUpRight } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { Magnetic } from "@/components/ui/Magnetic";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/utils";

// ── Single source of truth for the print catalogue ─────────────────────────
// The full print catalogue, served straight from public/docs. asset() prefixes
// the deploy base so it resolves under /neo-website/ in production.
export const BROCHURE_HREF = asset("docs/neo-brochure-2025.pdf");
// 17,346,688 bytes. Quoted in decimal MB (÷1e6), which is how a browser's own
// download UI reports it — 16.5 would be the MiB figure and reads as a mismatch.
// It's a heavy file, so every entry point states the format and weight up front
// rather than ambushing a visitor on mobile data.
export const BROCHURE_META = "PDF · 17 MB";
export const BROCHURE_LABEL = "NEO 2025 Catalogue";
export const BROCHURE_PAGES = 24;
/** Spoken form of the meta, for the aria-label — "PDF · 17 MB" reads badly. */
const BROCHURE_A11Y = `Download the ${BROCHURE_LABEL} — PDF, 17 MB`;

/**
 * The one brochure anchor, reused at every entry point (home CTA band, the
 * products band, anywhere else it is needed) so the path, the weight and the
 * download attributes can never drift apart between placements.
 *
 * `variant` only swaps the existing .btn-primary / .btn-ghost class — the two
 * share identical geometry (inline-flex, gap-2, rounded-full, px-7 py-3.5,
 * text-sm), so either one sits flush on the same baseline as a sibling pill.
 */
export function BrochureButton({
  variant = "ghost",
  className,
}: {
  variant?: "primary" | "ghost";
  className?: string;
}) {
  return (
    <a
      href={BROCHURE_HREF}
      download
      target="_blank"
      rel="noreferrer"
      aria-label={BROCHURE_A11Y}
      className={cn(
        variant === "primary" ? "btn-primary" : "btn-ghost",
        "group",
        className
      )}
    >
      <Download className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
      {BROCHURE_LABEL}
      <span
        aria-hidden
        className={cn(
          "text-[12.5px] font-medium tracking-wide transition-colors duration-300",
          variant === "primary"
            ? "text-white/70 group-hover:text-white/90"
            : "text-steel-400 group-hover:text-steel-300"
        )}
      >
        {BROCHURE_META}
      </span>
    </a>
  );
}

// What is actually inside the PDF. Stated as contents, not as claims — these
// are the brands and families the catalogue's own pages cover, verified page by
// page against the file in public/docs (24 pages, brand lockup on each header):
//   pp. 2–15, 17–18  Atlas Copco   p. 16  CEJN        p. 17  GESIPA
//   pp. 18–19 eepos  p. 20  John Guest Speedfit       p. 21  Transair
//   p. 22  Legris/Parker           p. 23  Hoffmann Group (Garant/Holex) & GEDORE
// PFERD is the one brand on the website that the catalogue does NOT cover — it
// has no page and is absent from the back-cover partner strip. Do not describe
// this file as the "complete" range, and do not count brands from data/brands.ts.
const INSIDE = [
  "Atlas Copco tightening, material removal & air motors",
  "GESIPA riveting systems",
  "CEJN quick-connect couplings",
  "Transair & Legris compressed air piping and fittings",
  "John Guest Speedfit plumbing connectors",
  "eepos aluminium crane systems",
  "GEDORE & Hoffmann Group hand tools",
];

/**
 * Full-width editorial band that frames the catalogue as an object rather than
 * a link: what it is on the left, what is inside it on the right. Used on the
 * Products page, where someone is already browsing the range and is the most
 * likely person on the site to want the printed version of it.
 */
export function BrochureBand({ className }: { className?: string }) {
  return (
    <section className={cn("container-px py-16", className)}>
      <Reveal>
        <div className="grid items-center gap-10 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <SectionHeading
              eyebrow="The print catalogue"
              title="Take the whole range with you."
              subtitle={`Our ${BROCHURE_PAGES}-page 2025 catalogue spans tightening, riveting, material removal, air piping, crane systems and hand tools. One file, offline, ready to share with your team.`}
            />
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Magnetic>
                <BrochureButton variant="primary" />
              </Magnetic>
            </div>
          </div>

          {/* Decorative side: the catalogue as a stack of pages, with its
              contents listed on the cover face. */}
          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-[radial-gradient(60%_60%_at_70%_30%,rgb(var(--neo)/0.14),transparent_70%)]"
            />
            <div className="relative rounded-2xl border border-white/10 bg-ink-900/60 p-6">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-neo-600/15 text-neo-400">
                  <FileText className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-display text-[16px] font-semibold text-white">
                    {BROCHURE_LABEL}
                  </span>
                  <span className="mt-0.5 block text-[13px] text-steel-400">
                    {BROCHURE_PAGES} pages · {BROCHURE_META}
                  </span>
                </span>
              </div>
              <StaggerGroup className="mt-6 space-y-3 border-t border-white/10 pt-6">
                {INSIDE.map((line) => (
                  <StaggerItem key={line}>
                    <p className="flex items-start gap-2.5 text-[14.5px] leading-relaxed text-steel-300">
                      <ArrowUpRight className="mt-1 h-3.5 w-3.5 shrink-0 text-neo-400" />
                      {line}
                    </p>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
