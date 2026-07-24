import type { BrandLine } from "@/data/brands";
import type { Product } from "@/data/products";
import { safeImg } from "@/lib/image";

/**
 * Artwork for a product line, resolved in priority order:
 *   1. the image an admin attached to the line
 *   2. the first image of a product that belongs to the line
 *   3. the catalogue family's stock photo (so the picture still matches the
 *      kind of tooling the line covers)
 *   4. a neutral placeholder, via safeImg()
 *
 * Written as a resolver rather than a stored field so a line is never
 * pictureless: adding the first product to a line gives it a real photo for
 * free, and uploading one in the admin overrides it.
 */

// Only photo ids already proven to render correctly in this catalogue are used
// here — an unseen Unsplash id can resolve to anything (one seeded photo turned
// out to be a roll of banknotes).
const p = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;

const CATEGORY_IMAGE: Record<string, string> = {
  "assembly-tightening": p("1581092160562-40aa08e78837"),
  "riveting-systems": p("1530124566582-a618bc2615dc"),
  "dispensing-gluing": p("1504917595217-d4dc5ebe6122"),
  "material-removal": p("1572981779307-38b8cabb2407"),
  "air-line-accessories": p("1558494949-ef010cbdcc31"),
  "air-motors": p("1504328345606-18bbc8c9d7d1"),
  "process-software": p("1518770660439-4636190af475"),
  "sockets-fixtures-spm": p("1581091226825-a6a2a5aee158"),
  "aluminium-crane-system": p("1504917595217-d4dc5ebe6122"),
  "compressed-air-piping": p("1558494949-ef010cbdcc31"),
  "hand-tools-storage": p("1504328345606-18bbc8c9d7d1"),
  "agv-amr": p("1518770660439-4636190af475"),
};

export function lineImage(
  line: BrandLine,
  products: Product[] = [],
  /**
   * Scope the product lookup to one brand. Line ids are only unique *within* a
   * brand — two brands can both have a "manual-tools" line — so without this a
   * line can borrow another brand's photo.
   */
  brandId?: string
): string {
  if (line.image?.trim()) return safeImg(line.image);

  const fromProduct = products.find(
    (pr) =>
      pr.line === line.id &&
      (!brandId || pr.brandId === brandId) &&
      pr.visible !== false &&
      pr.images?.[0]
  );
  if (fromProduct) return safeImg(fromProduct.images[0]);

  const byCategory = line.categoryId && CATEGORY_IMAGE[line.categoryId];
  // safeImg() turns an empty string into the neutral placeholder.
  return safeImg(byCategory || "");
}
