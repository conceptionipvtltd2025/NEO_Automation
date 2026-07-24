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

const FALLBACK_TEXT = {
  sm: "text-[13px]",
  md: "text-base",
  lg: "text-2xl",
  xl: "text-3xl",
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
            "border-b-2 pb-0.5 font-display font-bold tracking-tight text-[#12141a]",
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
