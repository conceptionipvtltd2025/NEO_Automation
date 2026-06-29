import { query, ensureDatabase } from "./db";
import { hashPassword } from "./auth";
import {
  upsertBrand,
  upsertCategory,
  upsertIndustry,
  upsertProduct,
  createInquiry,
  tableCount,
} from "./repo";
import {
  seedBrands,
  seedCategories,
  seedIndustries,
  seedProducts,
  seedInquiries,
} from "./seedData";

/**
 * Seeds each table only when it's empty, so admin edits are never clobbered.
 * Safe to run on every boot.
 */
export async function seed() {
  // Admin account
  if ((await tableCount("admins")) === 0) {
    const username = process.env.SEED_ADMIN_USER || "admin";
    const password = process.env.SEED_ADMIN_PASSWORD || "neo@2026";
    const hash = await hashPassword(password);
    await query(
      `INSERT INTO admins (username, password_hash, created_at) VALUES (?,?,?)`,
      [username, hash, Date.now()]
    );
    console.log(`  • seeded admin "${username}"`);
  }

  if ((await tableCount("brands")) === 0) {
    for (const b of seedBrands) await upsertBrand(b);
    console.log(`  • seeded ${seedBrands.length} brands`);
  }

  if ((await tableCount("categories")) === 0) {
    for (const c of seedCategories) await upsertCategory(c);
    console.log(`  • seeded ${seedCategories.length} categories`);
  }

  if ((await tableCount("industries")) === 0) {
    for (const i of seedIndustries) await upsertIndustry(i);
    console.log(`  • seeded ${seedIndustries.length} industries`);
  }

  if ((await tableCount("products")) === 0) {
    for (const pr of seedProducts) await upsertProduct(pr);
    console.log(`  • seeded ${seedProducts.length} products`);
  }

  if ((await tableCount("inquiries")) === 0) {
    const now = Date.now();
    for (const inq of seedInquiries) {
      const { createdAtOffset, ...rest } = inq as any;
      await createInquiry({ ...rest, createdAt: now - (createdAtOffset ?? 0) });
    }
    console.log(`  • seeded ${seedInquiries.length} inquiries`);
  }
}

// Allow `npm run seed` to run it standalone.
if (require.main === module) {
  (async () => {
    const dotenv = await import("dotenv");
    dotenv.config();
    await ensureDatabase();
    const { migrate } = await import("./schema");
    await migrate();
    await seed();
    console.log("Seed complete.");
    process.exit(0);
  })().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
