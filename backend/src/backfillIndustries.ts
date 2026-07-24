/**
 * One-off maintenance: bring an ALREADY-SEEDED database up to date with the
 * current industry seed.
 *
 * SUPERSEDED for the 2026 catalogue revision — use `npm run sync:catalogue`
 * instead. That script covers industries *and* categories/brands, remaps
 * products off retired ids and removes the segments the client dropped (Data
 * Center); this one only ever adds and re-stamps industries.
 *
 * Why this exists: seed() only fills a table when it's completely empty, so a
 * site that was first seeded with the original six industries never picks up
 * verticals added to seedData.ts later. This script closes that gap without the
 * blunt instrument of truncating the table.
 *
 * What it does, and what it deliberately does NOT do:
 *   • INSERTs seed industries whose id is missing. Existing rows keep every
 *     field they have, so admin edits are never clobbered.
 *   • Restamps created_at on seed rows so the public "newest first" ordering
 *     reproduces seedIndustries' curated order. (Only this column is touched.)
 *   • Leaves admin-created industries — anything not in the seed — completely
 *     alone, including their position at the top of the list.
 *   • With --fix-visuals, repairs rows still carrying a superseded seed *look*:
 *     the retired photo (one original now resolves to a stock roll of banknotes
 *     on the Unsplash CDN) and the pre-redesign accent colour. Both are matched
 *     against the exact old value, so a visual an admin chose is never touched.
 *
 * Usage:
 *   npm run backfill:industries                  # add missing + fix ordering
 *   npm run backfill:industries -- --fix-visuals # also repair retired photos + accents
 *   npm run backfill:industries -- --dry-run     # print the plan, change nothing
 *
 * On a production install (no devDependencies, so no tsx) run the compiled build:
 *   npm run backfill:industries:prod -- --fix-visuals
 */
import { query, ensureDatabase } from "./db";
import { listIndustries, upsertIndustry } from "./repo";
import { seedIndustries } from "./seedData";

/**
 * Seed photos that have gone bad on the CDN, mapped to their replacement.
 * Keyed by the Unsplash photo id embedded in the URL.
 */
const RETIRED_IMAGES: Record<string, string> = {
  // Resolves to a roll of ₹100 notes — was on "General Industries".
  "1565514020179-026b92b84bb6": "1717386255773-1e3037c81788",
  // Consumer-view shots replaced with manufacturing equivalents.
  "1565043666747-69f6646db940": "1589320012458-ce28bd1c86b1",
  "1436491865332-7a61a109cc05": "1712179355181-cd9add37f76a",
};

/**
 * Pre-redesign accent per industry id. The Titanium & Pastel palette retired the
 * legacy red/cyan accents, but a row that already exists keeps whatever it was
 * seeded with — leaving a half-red, half-pastel grid once new rows land.
 *
 * We only overwrite an accent that still *exactly* equals the value below, so a
 * colour an admin picked in the panel is left alone.
 */
const LEGACY_ACCENTS: Record<string, string> = {
  automotive: "#ed1c24",
  aerospace: "#22b8ff",
  "electronics-ev": "#22b8ff",
  "energy-utilities": "#ed1c24",
  "data-center": "#5ed6ff",
  "general-industries": "#ff5d5d",
};

export async function backfillIndustries(opts: {
  fixVisuals?: boolean;
  dryRun?: boolean;
} = {}) {
  const { fixVisuals = false, dryRun = false } = opts;
  const existing = await listIndustries();
  const have = new Map(existing.map((i) => [i.id, i]));

  // The site sorts created_at descending, so walking the curated seed array and
  // stepping the timestamp *down* makes the array order the on-site order.
  const base = Date.now();
  const stamp = (idx: number) => base - idx * 1000;

  const added: string[] = [];
  const restamped: string[] = [];
  const repointed: string[] = [];
  const recoloured: string[] = [];

  for (const [idx, seedRow] of seedIndustries.entries()) {
    const createdAt = stamp(idx);
    const current = have.get(seedRow.id);

    if (!current) {
      if (!dryRun) await upsertIndustry({ ...seedRow, createdAt });
      added.push(seedRow.id);
      continue;
    }

    // Row exists: only nudge ordering metadata, never content.
    if (current.createdAt !== createdAt) {
      if (!dryRun) {
        await query(`UPDATE industries SET created_at = ? WHERE id = ?`, [
          createdAt,
          seedRow.id,
        ]);
      }
      restamped.push(seedRow.id);
    }

    if (fixVisuals) {
      const hit = Object.keys(RETIRED_IMAGES).find((old) =>
        (current.image ?? "").includes(old)
      );
      if (hit) {
        const fixed = (current.image as string).replace(hit, RETIRED_IMAGES[hit]);
        if (!dryRun) {
          await query(`UPDATE industries SET image = ? WHERE id = ?`, [
            fixed,
            seedRow.id,
          ]);
        }
        repointed.push(seedRow.id);
      }

      // Only when the row still carries the exact pre-redesign accent — an
      // admin-chosen colour won't match, so it survives.
      const legacy = LEGACY_ACCENTS[seedRow.id];
      if (legacy && current.accent === legacy && seedRow.accent !== legacy) {
        if (!dryRun) {
          await query(`UPDATE industries SET accent = ? WHERE id = ?`, [
            seedRow.accent,
            seedRow.id,
          ]);
        }
        recoloured.push(seedRow.id);
      }
    }
  }

  const prefix = dryRun ? "[dry-run] would" : "";
  console.log(`${prefix} add ${added.length} industries${added.length ? ": " + added.join(", ") : ""}`);
  console.log(`${prefix} restamp order on ${restamped.length} rows`);
  if (fixVisuals) {
    console.log(`${prefix} repoint ${repointed.length} retired images${repointed.length ? ": " + repointed.join(", ") : ""}`);
    console.log(`${prefix} recolour ${recoloured.length} legacy accents${recoloured.length ? ": " + recoloured.join(", ") : ""}`);
  } else {
    const stale = existing.filter(
      (i) =>
        Object.keys(RETIRED_IMAGES).some((old) => (i.image ?? "").includes(old)) ||
        (LEGACY_ACCENTS[i.id] && i.accent === LEGACY_ACCENTS[i.id])
    );
    if (stale.length) {
      console.log(
        `note: ${stale.length} rows still carry a retired photo or pre-redesign accent — ` +
          "re-run with --fix-visuals to repair them"
      );
    }
  }
  return { added, restamped, repointed, recoloured };
}

if (require.main === module) {
  (async () => {
    const dotenv = await import("dotenv");
    dotenv.config();
    await ensureDatabase();
    const { migrate } = await import("./schema");
    await migrate();
    await backfillIndustries({
      // --fix-images kept as an alias: it was the flag's original name.
      fixVisuals:
        process.argv.includes("--fix-visuals") || process.argv.includes("--fix-images"),
      dryRun: process.argv.includes("--dry-run"),
    });
    console.log("Backfill complete.");
    process.exit(0);
  })().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
