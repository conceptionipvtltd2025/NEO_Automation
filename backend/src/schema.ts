import { query } from "./db";

/**
 * Idempotent table definitions. Each runs as its own statement so we don't need
 * multipleStatements on the pool. JSON columns hold the array/object fields that
 * the frontend types expect (industries, features, specs, images, capabilities, stat).
 */
const TABLES: string[] = [
  `CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(64) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at BIGINT NOT NULL
  ) ENGINE=InnoDB`,

  `CREATE TABLE IF NOT EXISTS brands (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    color VARCHAR(16),
    category VARCHAR(128),
    blurb TEXT,
    logo VARCHAR(255),
    -- LINES is a MySQL reserved word (LOAD DATA … LINES TERMINATED BY), so the
    -- identifier must be back-quoted everywhere it appears in SQL.
    \`lines\` JSON,
    resources JSON,
    sort_order INT DEFAULT 0
  ) ENGINE=InnoDB`,

  `CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    description TEXT,
    icon VARCHAR(64),
    sort_order INT DEFAULT 0
  ) ENGINE=InnoDB`,

  `CREATE TABLE IF NOT EXISTS industries (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    short VARCHAR(255),
    tagline VARCHAR(255),
    description TEXT,
    image TEXT,
    icon VARCHAR(64),
    accent VARCHAR(16),
    capabilities JSON,
    stat JSON,
    visible TINYINT(1) DEFAULT 1,
    created_at BIGINT DEFAULT 0
  ) ENGINE=InnoDB`,

  `CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(96) PRIMARY KEY,
    slug VARCHAR(160) NOT NULL,
    name VARCHAR(200) NOT NULL,
    brand_id VARCHAR(64),
    brand VARCHAR(128),
    category_id VARCHAR(64),
    line VARCHAR(64),
    industries JSON,
    price BIGINT DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 0,
    short_desc TEXT,
    description MEDIUMTEXT,
    features JSON,
    specs JSON,
    images JSON,
    featured TINYINT(1) DEFAULT 0,
    special TINYINT(1) DEFAULT 0,
    badge VARCHAR(96),
    visible TINYINT(1) DEFAULT 1,
    KEY idx_products_slug (slug),
    KEY idx_products_category (category_id),
    KEY idx_products_brand (brand_id)
  ) ENGINE=InnoDB`,

  `CREATE TABLE IF NOT EXISTS inquiries (
    id VARCHAR(96) PRIMARY KEY,
    name VARCHAR(160) NOT NULL,
    email VARCHAR(200) NOT NULL,
    phone VARCHAR(64),
    address VARCHAR(255),
    message TEXT,
    product_id VARCHAR(96),
    product_name VARCHAR(200),
    status ENUM('new','read','responded','closed') NOT NULL DEFAULT 'new',
    created_at BIGINT NOT NULL,
    KEY idx_inquiries_status (status),
    KEY idx_inquiries_created (created_at)
  ) ENGINE=InnoDB`,
];

// Additive migrations for databases created before a column existed. Each is
// idempotent: a "duplicate column" error means it's already applied, so ignore.
const ALTERS: string[] = [
  `ALTER TABLE industries ADD COLUMN visible TINYINT(1) DEFAULT 1`,
  `ALTER TABLE industries ADD COLUMN created_at BIGINT DEFAULT 0`,
  // Catalogue sequence is client-specified content, not alphabetical — the
  // twelve solution families must list in the order given in seedData.
  `ALTER TABLE categories ADD COLUMN sort_order INT DEFAULT 0`,
  // Second-level catalogue: which brand product line a product belongs to
  // (e.g. Atlas Copco → electric-assembly-tools).
  `ALTER TABLE products ADD COLUMN line VARCHAR(64)`,
  // Brand product lines moved out of the frontend source file and into the DB
  // so the admin panel can add/edit/reorder them. `lines` holds the array of
  // { id, name, brief, models[], categoryId, image }; `resources` the
  // literature links. Note the back-quotes: LINES is a MySQL reserved word.
  "ALTER TABLE brands ADD COLUMN `lines` JSON",
  `ALTER TABLE brands ADD COLUMN resources JSON`,
  `ALTER TABLE brands ADD COLUMN sort_order INT DEFAULT 0`,
];

export async function migrate() {
  for (const sql of TABLES) {
    await query(sql);
  }
  for (const sql of ALTERS) {
    try {
      await query(sql);
    } catch (e: any) {
      // ER_DUP_FIELDNAME (1060) — column already exists; safe to skip.
      if (e?.errno !== 1060) throw e;
    }
  }
}
