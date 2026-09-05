import type { Product } from "@/data/products";
import type { Category } from "@/data/categories";

/**
 * Home page product selection.
 *
 * Both home sections used to read the frozen seed array in `data/products.ts`,
 * so the flags an admin set in the panel never reached the page. Everything
 * here works off the live catalogue (`useCatalog`, which is DB-backed) instead,
 * and shares one set of rules.
 *
 * There are two ways to put a product on the home page, and they stack:
 *
 *  1. **Category tag** — tick "Show on home page" on a category and every
 *     visible product in that family becomes a candidate. The bulk switch.
 *  2. **Product tag** — tick "Our Catalogue grid" on a single product to add
 *     it regardless of its category. The exception, layered on top.
 *
 * Individually-tagged products always come first, so a hand-picked hero never
 * gets buried under a whole tagged family. Within each group `homeOrder`
 * decides the sequence (unranked sorts last), so an admin only has to number
 * the few they care about. Hidden products never appear, whatever is ticked.
 */

/**
 * How many items each home section renders. These live here, beside the
 * selection logic, because three places need them in step: the section itself,
 * the admin "Home Page" manager (which dims anything past the cut), and the
 * product form's hint. They drifted apart once already.
 */
export const HOME_GRID_LIMIT = 8;
export const HOME_SIGNATURE_LIMIT = 6;

/** Ascending `homeOrder`, unranked last, name as the final tie-break. */
export function byHomeOrder(a: Product, b: Product): number {
  const ao = a.homeOrder;
  const bo = b.homeOrder;
  const aRanked = typeof ao === "number" && Number.isFinite(ao);
  const bRanked = typeof bo === "number" && Number.isFinite(bo);
  if (aRanked && bRanked && ao !== bo) return ao! - bo!;
  if (aRanked !== bRanked) return aRanked ? -1 : 1;
  return a.name.localeCompare(b.name);
}

export const visibleProducts = (products: Product[]): Product[] =>
  products.filter((p) => p.visible !== false);

/** Ids of the categories an admin has pinned to the home page. */
export const homeCategoryIds = (categories: Category[]): Set<string> =>
  new Set(categories.filter((c) => c.showOnHome).map((c) => c.id));

/** Does anything at all opt this product into the "Our Catalogue" grid? */
export const isHomeProduct = (p: Product, catIds: Set<string>): boolean =>
  !!p.featured || catIds.has(p.categoryId);

/**
 * The effective home-grid rank of a product: its own `homeOrder` if it carries
 * one, otherwise the `homeOrder` of the category that put it on the page.
 *
 * This is what lets a single hand-picked product sit at position 1 with a whole
 * family following at 2. The two sources previously rendered as separate
 * blocks — every individually-tagged product, then every category-tagged one —
 * so a category could never be interleaved between tagged products, whatever
 * numbers were set.
 */
function homeRank(p: Product, cats: Map<string, number>): number | undefined {
  if (typeof p.homeOrder === "number" && Number.isFinite(p.homeOrder)) return p.homeOrder;
  return cats.get(p.categoryId);
}

/** Categories pinned to the home page, mapped to their rank (unranked omitted). */
function rankedCategories(categories: Category[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const c of categories) {
    if (c.showOnHome && typeof c.homeOrder === "number" && Number.isFinite(c.homeOrder)) {
      m.set(c.id, c.homeOrder);
    }
  }
  return m;
}

/**
 * "Our Catalogue" grid.
 *
 * Everything opted in — by its own `featured` flag or by its category's
 * `showOnHome` — competes on ONE ordering scale, so product and category ranks
 * interleave. Ties break in favour of the individually-tagged product (a
 * deliberate pick outranks a bulk one), then by name. Anything unranked follows,
 * and the rest of the catalogue backfills so the grid is never ragged.
 */
export function homeFeatured(
  products: Product[],
  categories: Category[] = [],
  limit = 8
): Product[] {
  const live = visibleProducts(products);
  const catIds = homeCategoryIds(categories);
  const catRanks = rankedCategories(categories);

  const picked = live
    .filter((p) => isHomeProduct(p, catIds))
    .sort((a, b) => {
      const ra = homeRank(a, catRanks);
      const rb = homeRank(b, catRanks);
      if (ra !== undefined && rb !== undefined && ra !== rb) return ra - rb;
      // Ranked always beats unranked.
      if ((ra !== undefined) !== (rb !== undefined)) return ra !== undefined ? -1 : 1;
      // Same rank: the hand-picked product leads its category's products.
      if (!!a.featured !== !!b.featured) return a.featured ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

  if (picked.length >= limit) return picked.slice(0, limit);

  const chosen = new Set(picked.map((p) => p.id));
  const filler = live.filter((p) => !chosen.has(p.id)).sort(byHomeOrder);
  return [...picked, ...filler].slice(0, limit);
}

/**
 * "Signature Engineering" rail — the hand-picked flagship list beside the 3D
 * showpiece. Deliberately product-only: a whole category of flagships would
 * defeat the point of the section.
 */
export function homeSpecial(products: Product[], limit = 4): Product[] {
  const live = visibleProducts(products);
  const flagged = live.filter((p) => p.special).sort(byHomeOrder);
  if (flagged.length >= limit) return flagged.slice(0, limit);

  const chosen = new Set(flagged.map((p) => p.id));
  const filler = live.filter((p) => !chosen.has(p.id)).sort(byHomeOrder);
  return [...flagged, ...filler].slice(0, limit);
}
