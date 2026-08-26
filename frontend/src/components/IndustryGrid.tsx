import type { Industry } from "@/data/industries";
import { IndustryTile } from "@/components/IndustryTile";
import { cn } from "@/lib/utils";

/**
 * The one layout every industry list on the site uses — the home showcase, the
 * /industries page and any future placement.
 *
 * Why flex-wrap and not a CSS grid: the list is admin-driven, so its length is
 * unknown. A 3-column grid with, say, 11 industries leaves a ragged half-empty
 * final row hanging on the left. Wrapping flex items with `justify-center`
 * instead means the last row is always centred, so ANY count reads as
 * deliberate. The widths are `calc(% - gap-share)` so the columns still line up
 * pixel-for-pixel with a grid.
 *
 * Every tile carries a fixed 4:3 photo (see IndustryTile), so rows align
 * regardless of how tall a name or tagline runs.
 */
export function IndustryGrid({
  industries,
  className,
  /** Offsets the entrance stagger when the grid follows a featured card. */
  indexOffset = 0,
}: {
  industries: Industry[];
  className?: string;
  indexOffset?: number;
}) {
  if (industries.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap justify-center gap-5", className)}>
      {industries.map((ind, i) => (
        <div
          key={ind.id}
          // gap-5 = 1.25rem → subtract each item's share of the gaps so 2-up and
          // 3-up rows sit exactly where a grid would put them.
          className="w-full sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.3333%-0.8334rem)]"
        >
          <IndustryTile industry={ind} index={i + indexOffset} />
        </div>
      ))}
    </div>
  );
}
