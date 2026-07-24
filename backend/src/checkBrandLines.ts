/**
 * End-to-end check that brand product lines (and their images) really survive a
 * round-trip through MySQL.
 *
 * Why this exists: `lines` is a JSON column holding an array of
 * { id, name, brief, models[], categoryId, image }. Everything the admin panel
 * edits goes through it, so a silent truncation, a missing column on an older
 * database, or a mapper that drops a field would only show up as "my edit
 * didn't save". This proves the whole path in one command:
 *
 *     npm run check:brands
 *
 * It writes a throwaway brand (id `__selftest_brand`), reads it back, compares
 * every field, then deletes it. Nothing else in the database is touched.
 */
import { query, ensureDatabase } from "./db";
import { listBrands, upsertBrand, deleteBrand } from "./repo";
import { migrate } from "./schema";

const TEST_ID = "__selftest_brand";

const sample = {
  id: TEST_ID,
  name: "Self Test Brand",
  color: "#4fb6f0",
  category: "Diagnostics",
  blurb: "Temporary record written by check:brands. Safe to delete.",
  logo: "/images/brands/atlas-copco.png",
  sortOrder: 999,
  lines: [
    {
      id: "line-one",
      name: "Line One",
      brief: "First line with an image and models.",
      models: ["Model A", "Model B"],
      categoryId: "assembly-tightening",
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837",
    },
    {
      id: "line-two",
      name: "Line Two — ünïcode & symbols © ±2%",
      brief: "Second line, no image, to prove the optional field stays optional.",
      models: [],
      categoryId: "riveting-systems",
    },
  ],
  resources: [{ label: "Guide (PDF)", href: "https://example.com/guide.pdf" }],
};

function fail(msg: string): never {
  console.error(`\n❌  ${msg}`);
  process.exit(1);
}

export async function checkBrandLines() {
  console.log("Checking brand → product line persistence…");

  // 1. Column present? (An older database predates the lines/resources columns.)
  const cols: any[] = await query(`SHOW COLUMNS FROM brands`);
  const names = cols.map((c) => c.Field);
  for (const needed of ["lines", "resources", "sort_order"]) {
    if (!names.includes(needed)) {
      fail(
        `brands.${needed} column is missing — run the server once (or \`npm run sync:catalogue\`) so migrate() can add it.`
      );
    }
  }
  console.log("  ✓ columns present: lines, resources, sort_order");

  // 2. Write.
  await upsertBrand(sample);
  console.log("  ✓ wrote test brand");

  // 3. Read back through the same mapper the API uses.
  const all = await listBrands();
  const got: any = all.find((b: any) => b.id === TEST_ID);
  if (!got) fail("test brand was written but did not come back from listBrands()");

  // 4. Compare every field that matters.
  const problems: string[] = [];
  if (got.name !== sample.name) problems.push("name");
  if (got.color !== sample.color) problems.push("color");
  if (got.logo !== sample.logo) problems.push("logo");
  if (Number(got.sortOrder) !== sample.sortOrder) problems.push("sortOrder");
  if (JSON.stringify(got.lines) !== JSON.stringify(sample.lines)) {
    problems.push("lines");
    console.error("    expected:", JSON.stringify(sample.lines));
    console.error("    got     :", JSON.stringify(got.lines));
  }
  if (JSON.stringify(got.resources) !== JSON.stringify(sample.resources)) {
    problems.push("resources");
  }

  // 5. Clean up before reporting, so a failure doesn't leave the row behind.
  await deleteBrand(TEST_ID);
  const stillThere = (await listBrands()).some((b: any) => b.id === TEST_ID);
  if (stillThere) fail("test brand could not be deleted");

  if (problems.length) fail(`these fields did not survive the round-trip: ${problems.join(", ")}`);

  console.log("  ✓ read back identical (lines, models, image, categoryId, resources)");
  console.log("  ✓ cleaned up test row");
  console.log("\n✅  Brand product lines persist correctly to MySQL.");
}

if (require.main === module) {
  (async () => {
    const dotenv = await import("dotenv");
    dotenv.config();
    await ensureDatabase();
    await migrate();
    await checkBrandLines();
    process.exit(0);
  })().catch((e) => {
    console.error("\n❌  Check failed to run.");
    if (e?.code === "ECONNREFUSED") {
      console.error("    MySQL is not running — start it first (net start MySQL80).");
    } else if (e?.code === "ER_ACCESS_DENIED_ERROR") {
      console.error("    MySQL rejected the credentials in backend/.env (DB_USER / DB_PASSWORD).");
    }
    console.error(e);
    process.exit(1);
  });
}
