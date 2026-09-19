import { useState } from "react";
import type { Brand } from "@/data/brands";
import { brandLogo } from "@/lib/asset";
import { cn } from "@/lib/utils";

/**
 * A brand logo on a fixed-size white plate.
 *
 * Why a PLATE and not just a height: the logos run from PFERD at 1.19:1
 * (almost square) to Hoffmann Group at 7.13:1 (a long wordmark) — a 6× spread.
 * Constraining only the height made the square logos render a third of the
 * width of the wide ones and look shrunken. Every logo is instead scaled with
 * `object-contain` into the same box, so each occupies a comparable optical
 * area and a row of them reads as one set.
 *
 * The plate is `bg-pure` (literal white), never `bg-white` — that token flips
 * to near-ink in the light theme and would swallow the dark brand artwork.
 */
const SIZES = {
  /** Marquee strip / compact rows. */
  sm: "h-14 w-[124px] p-2.5",
  /** Brand cards, the /products brand strip. */
  md: "h-20 w-[164px] p-3.5",
  /** Larger surfaces. */
  lg: "h-28 w-[248px] p-6",
  /** Brand page hero — the plate IS the hero graphic, so it carries the size. */
  xl: "h-36 w-[300px] p-7",
} as const;

/**
 * Wordmark sizing for a brand with no logo file (the `<img>` 404s, or the
 * record has no `logo` at all).
 *
 * These step UP from a small base rather than starting at the nominal size,
 * because the plate is not always its nominal size: callers legitimately
 * shrink it through `className` (the home Brands grid renders the `md` plate
 * at `h-14 … p-2.5` in the 2-up phone column). The font must follow the plate
 * that is actually rendered, not the one the `size` prop names, or the
 * wordmark wraps to two lines and is clipped by the plate's `overflow-hidden`.
 *
 * Measured: "John Guest" at 17.44px/28.8px needs 61.6px in a 104px-wide,
 * 56px-tall plate — 5.6px taller than the plate. The base steps here keep the
 * two-line case inside the box at every width we ship.
 */
const FALLBACK_TEXT = {
  sm: "text-[11px] xs:text-[14.5px]",
  md: "text-[12px] xs:text-sm sm:text-base",
  lg: "text-lg sm:text-2xl",
  xl: "text-xl sm:text-3xl",
} as const;

export function BrandLogoPlate({
  brand,
  size = "md",
  className,
}: {
  brand: Brand;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-pure shadow-sm ring-1 ring-black/10",
        SIZES[size],
        className
      )}
    >
      {failed || !brand.logo ? (
        // Constant dark ink on the constant white plate — the brand hex is used
        // for the rule underneath, where contrast doesn't matter. Several brand
        // colours (Atlas Copco #a5c532, GESIPA #2ed658) are unreadable on white.
        <span
          className={cn(
            // `max-w-full` + `leading-tight` keep a wrapped two-word wordmark
            // ("John Guest") inside the plate instead of overflowing it: the
            // plate is `overflow-hidden`, so any overflow is a hard clip
            // through the glyphs rather than a scroll.
            "max-w-full border-b-2 pb-0.5 text-center font-display font-bold leading-tight tracking-tight text-[#12141a]",
            FALLBACK_TEXT[size]
          )}
          style={{ borderColor: brand.color }}
        >
          {brand.name}
        </span>
      ) : (
        <img
          src={brandLogo(brand.logo)}
          alt={`${brand.name} logo`}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-contain"
        />
      )}
    </span>
  );
}
