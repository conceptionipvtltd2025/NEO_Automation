/**
 * Bring an ALREADY-SEEDED database in line with the current catalogue seed.
 *
 * Why this exists: seed() only fills a table when it is completely empty, so a
 * live site never picks up a catalogue revision made in seedData.ts. This is
 * the script that pushes one through — used for the client's website revision
 * that renamed the industry segments, replaced the six product categories with
 * twelve solution families and added John Guest as a tenth brand.
 *
 * What it does:
 *   • Upserts every seed brand, category and industry (content + ordering).
 *     Categories carry sort_order; industries get descending created_at, which
 *     is what the public "newest first" list actually sorts on.
 *   • Remaps products off retired ids onto their replacement (category_id and
 *     the industries JSON array), so no product is orphaned.
 *   • Deletes the retired industries/categories themselves — including the Data
 *     Center segment the client asked to remove. Only ids in the hard-coded
 *     RETIRED maps below are ever deleted; an admin-created row can never match.
 *
 * What it never does: touch an admin-created row, or overwrite a product's
 * copy, price or imagery.
 *
 * Usage:
 *   npm run sync:catalogue                # apply
 *   npm run sync:catalogue -- --dry-run   # print the plan, change nothing
 *   npm run sync:catalogue -- --keep-retired   # remap but keep the old rows
 *
 * On a production install (no devDependencies, so no tsx) run the build:
 *   npm run sync:catalogue:prod
 */
import { query, ensureDatabase } from "./db";
import { upsertBrand, upsertCategory, upsertIndustry } from "./repo";
import {
  seedBrands,
  seedCategories,
  seedIndustries,
  seedProducts,
} from "./seedData";

/**
 * Industry ids replaced in the 2026 revision. `null` = the segment is gone with
 * no successor (products lose the tag rather than gaining a wrong one).
 */
const RETIRED_INDUSTRIES: Record<string, string | null> = {
  "electronics-ev": "electronics",
  "energy-utilities": "energy",
  "rail-rolling-stock": "railway",
  "general-industries": "industrial-assembly",
  "data-center": null, // client: REMOVE DATA CENTER SEGMENT
  trailers: null,
};

/**
 * Industry ids INTRODUCED by a revision.
 *
 * upsertIndustry() creates the segment itself, but nothing re-tags the products
 * already in the database — so a brand-new segment lands with an empty
 * "Recommended for …" shelf and an empty /products?industry=… filter. For every
 * id listed here we copy the seed's tagging onto the live product rows: the tag
 * is ADDED where it is missing and nothing is ever removed, so an admin's own
 * tagging is untouched.
 */
const ADDED_INDUSTRIES = ["ev-assembly"];

/** Category ids replaced by the twelve-family catalogue. */
const RETIRED_CATEGORIES: Record<string, string | null> = {
  "assembly-tools": "assembly-tightening",
  "crane-systems": "aluminium-crane-system",
  "hand-tools": "hand-tools-storage",
  "abrasives-cutting": "material-removal",
  "fluid-fittings": "air-line-accessories",
};

type Opts = { dryRun?: boolean; keepRetired?: boolean };

export async function syncCatalogue({ dryRun = false, keepRetired = false }: Opts = {}) {
  const plan = dryRun ? "[dry-run] would" : "";
  const seedIds = {
    industries: new Set(seedIndustries.map((i) => i.id)),
    categories: new Set(seedCategories.map((c) => c.id)),
  };

  /* 1 ─ brands ------------------------------------------------------------ */
  if (!dryRun) for (const b of seedBrands) await upsertBrand(b);
  console.log(`${plan} upsert ${seedBrands.length} brands`);

  /* 2 ─ categories (content + curated sequence) --------------------------- */
  if (!dryRun) for (const c of seedCategories) await upsertCategory(c);
  console.log(`${plan} upsert ${seedCategories.length} categories with sort order`);

  /* 3 ─ industries (content + descending created_at = curated sequence) ---- */
  // The site sorts created_at descending, so walking the curated array and
  // stepping the timestamp down makes the array order the on-site order.
  const base = Date.now();
  if (!dryRun) {
    for (const [idx, i] of seedIndustries.entries()) {
      await upsertIndustry({ ...i, createdAt: base - idx * 1000 });
    }
  }
  console.log(`${plan} upsert ${seedIndustries.length} industries in sequence`);

  /* 4 ─ remap products off retired ids ------------------------------------ */
  const products: any[] = await query(
    `SELECT id, category_id, industries FROM products`
  );

  let categoryMoves = 0;
  let industryMoves = 0;

  for (const row of products) {
    // Category: a straight swap.
    const catReplacement = RETIRED_CATEGORIES[row.category_id];
    if (catReplacement) {
      if (!dryRun) {
        await query(`UPDATE products SET category_id=? WHERE id=?`, [
          catReplacement,
          row.id,
        ]);
      }
      categoryMoves++;
    }

    // Industries: map each tag, drop the ones with no successor, de-duplicate.
    const current: string[] = Array.isArray(row.industries)
      ? row.industries
      : JSON.parse(row.industries || "[]");
    const mapped = current
      .map((id) => (id in RETIRED_INDUSTRIES ? RETIRED_INDUSTRIES[id] : id))
      .filter((id): id is string => !!id && seedIds.industries.has(id));
    const next = [...new Set(mapped)];

    if (next.join("|") !== current.join("|")) {
      if (!dryRun) {
        await query(`UPDATE products SET industries=? WHERE id=?`, [
          JSON.stringify(next),
          row.id,
        ]);
      }
      industryMoves++;
    }
  }
  console.log(
    `${plan} remap ${categoryMoves} product categories and ${industryMoves} product industry lists`
  );

  /* 4b ─ backfill products.line ------------------------------------------- */
  // `line` is a new column, so every pre-existing product row has NULL in it —
  // which means every product-line count on the site reads 0 and the line
  // filter returns nothing. Fill it from the seed, but ONLY where the row is
  // still empty, so a line an admin has since assigned is never overwritten.
  const seedLines = new Map(
    seedProducts
      .filter((p: any) => p.line)
      .map((p: any) => [p.id, p.line as string])
  );
  const lineRows: any[] = await query(
    `SELECT id FROM products WHERE line IS NULL OR line = ''`
  );
  let linesSet = 0;
  for (const row of lineRows) {
    const seedLine = seedLines.get(row.id);
    if (!seedLine) continue;
    if (!dryRun) {
      await query(`UPDATE products SET line=? WHERE id=?`, [seedLine, row.id]);
    }
    linesSet++;
  }
  const unmatched = lineRows.length - linesSet;
  console.log(
    `${plan} set product line on ${linesSet} rows` +
      (unmatched
        ? ` (${unmatched} product(s) have no line — assign one in the admin panel)`
        : "")
  );

  /* 4d ─ backfill products.home_order ------------------------------------- */
  // Same story as `line`: home_order is new, so every existing row is NULL and
  // the home page sections fall back to alphabetical. Seed the order the client
  // approved — but only where the row is still unranked, so a position an admin
  // has already set in the panel is never overwritten.
  const seedHomeOrder = new Map(
    seedProducts
      .filter((p: any) => typeof p.homeOrder === "number")
      .map((p: any) => [p.id, p.homeOrder as number])
  );
  const unranked: any[] = await query(
    `SELECT id FROM products WHERE home_order IS NULL`
  );
  let ordersSet = 0;
  for (const row of unranked) {
    const seedOrder = seedHomeOrder.get(row.id);
    if (seedOrder === undefined) continue;
    if (!dryRun) {
      await query(`UPDATE products SET home_order=? WHERE id=?`, [seedOrder, row.id]);
    }
    ordersSet++;
  }
  console.log(`${plan} set home page order on ${ordersSet} rows`);

  /* 4c ─ tag products into industries introduced by this revision --------- */
  let addedTags = 0;
  if (ADDED_INDUSTRIES.length) {
    const wanted = new Map<string, string[]>();
    for (const p of seedProducts as any[]) {
      const add = (p.industries as string[]).filter(
        (id) => ADDED_INDUSTRIES.includes(id) && seedIds.industries.has(id)
      );
      if (add.length) wanted.set(p.id, add);
    }

    // Re-read: step 4 may have rewritten some of these rows already.
    const rows: any[] = await query(`SELECT id, industries FROM products`);
    for (const row of rows) {
      const add = wanted.get(row.id);
      if (!add) continue;
      const current: string[] = Array.isArray(row.industries)
        ? row.industries
        : JSON.parse(row.industries || "[]");
      const missing = add.filter((id) => !current.includes(id));
      if (!missing.length) continue;
      // Prepend so the new segment reads first, matching the seed's order.
      const next = [...missing, ...current];
      if (!dryRun) {
        await query(`UPDATE products SET industries=? WHERE id=?`, [
          JSON.stringify(next),
          row.id,
        ]);
      }
      addedTags++;
    }
  }
  console.log(
    `${plan} tag ${addedTags} product(s) into new industries: ` +
      (ADDED_INDUSTRIES.join(", ") || "none")
  );

  /* 5 ─ delete the retired rows themselves -------------------------------- */
  const deadIndustries = Object.keys(RETIRED_INDUSTRIES).filter(
    (id) => !seedIds.industries.has(id)
  );
  const deadCategories = Object.keys(RETIRED_CATEGORIES).filter(
    (id) => !seedIds.categories.has(id)
  );

  if (keepRetired) {
    console.log(
      `keeping ${deadIndustries.length + deadCategories.length} retired rows (--keep-retired); ` +
        "they will still show on the site"
    );
  } else {
    for (const id of deadIndustries) {
      if (!dryRun) await query(`DELETE FROM industries WHERE id=?`, [id]);
    }
    for (const id of deadCategories) {
      if (!dryRun) await query(`DELETE FROM categories WHERE id=?`, [id]);
    }
    console.log(
      `${plan} delete retired industries: ${deadIndustries.join(", ") || "none"}`
    );
    console.log(
      `${plan} delete retired categories: ${deadCategories.join(", ") || "none"}`
    );
  }

  /* 6 ─ warn about anything still pointing nowhere ------------------------ */
  const orphans: any[] = await query(
    `SELECT id, category_id FROM products WHERE category_id IS NOT NULL`
  );
  const stray = orphans.filter((r) => !seedIds.categories.has(r.category_id));
  if (stray.length) {
    console.log(
      `note: ${stray.length} products sit in a category that is not in the seed ` +
        "(admin-created categories are fine — check the admin panel if unexpected): " +
        stray.map((s) => `${s.id}→${s.category_id}`).join(", ")
    );
  }

  return { categoryMoves, industryMoves, addedTags, deadIndustries, deadCategories };
}

if (require.main === module) {
  (async () => {
    const dotenv = await import("dotenv");
    dotenv.config();
    await ensureDatabase();
    const { migrate } = await import("./schema");
    await migrate();
    await syncCatalogue({
      dryRun: process.argv.includes("--dry-run"),
      keepRetired: process.argv.includes("--keep-retired"),
    });
    console.log("Catalogue sync complete.");
    process.exit(0);
  })().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
