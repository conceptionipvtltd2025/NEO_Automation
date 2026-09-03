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
 * "Our Catalogue" grid. Product-tagged first, then category-tagged, then — only
 * if the two together still don't fill the grid — the rest of the catalogue, so
 * a half-configured site never renders a ragged row.
 */
export function homeFeatured(
  products: Product[],
  categories: Category[] = [],
  limit = 8
): Product[] {
  const live = visibleProducts(products);
  const catIds = homeCategoryIds(categories);

  const tagged = live.filter((p) => p.featured).sort(byHomeOrder);
  const byCategory = live
    .filter((p) => !p.featured && catIds.has(p.categoryId))
    .sort(byHomeOrder);

  const picked = [...tagged, ...byCategory];
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
