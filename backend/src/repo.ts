import { query } from "./db";

/* ───────────────────────── helpers ───────────────────────── */

/** mysql2 returns JSON columns already parsed, but stay defensive for TEXT/strings. */
function parseJson<T>(value: any, fallback: T): T {
  if (value == null) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}

const bool = (v: any) => v === 1 || v === true || v === "1";

/* ───────────────────────── mappers (row -> frontend shape) ───────────────────────── */

export function mapBrand(r: any) {
  return {
    id: r.id,
    name: r.name,
    color: r.color ?? "",
    category: r.category ?? "",
    blurb: r.blurb ?? "",
    logo: r.logo ?? "",
  };
}

export function mapCategory(r: any) {
  return {
    id: r.id,
    name: r.name,
    description: r.description ?? "",
    icon: r.icon ?? "Tags",
  };
}

export function mapIndustry(r: any) {
  return {
    id: r.id,
    name: r.name,
    short: r.short ?? "",
    tagline: r.tagline ?? "",
    description: r.description ?? "",
    image: r.image ?? "",
    icon: r.icon ?? "Factory",
    accent: r.accent ?? "#ed1c24",
    capabilities: parseJson<string[]>(r.capabilities, []),
    stat: parseJson<{ value: string; label: string }>(r.stat, { value: "", label: "" }),
    visible: r.visible == null ? true : bool(r.visible),
    createdAt: Number(r.created_at ?? 0),
  };
}

export function mapProduct(r: any) {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    brandId: r.brand_id ?? "",
    brand: r.brand ?? "",
    categoryId: r.category_id ?? "",
    industries: parseJson<string[]>(r.industries, []),
    price: Number(r.price ?? 0),
    rating: Number(r.rating ?? 0),
    shortDesc: r.short_desc ?? "",
    description: r.description ?? "",
    features: parseJson<string[]>(r.features, []),
    specs: parseJson<{ label: string; value: string }[]>(r.specs, []),
    images: parseJson<string[]>(r.images, []),
    featured: bool(r.featured),
    special: bool(r.special),
    badge: r.badge ?? undefined,
    visible: bool(r.visible),
  };
}

export function mapInquiry(r: any) {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone ?? "",
    address: r.address ?? undefined,
    message: r.message ?? "",
    productId: r.product_id ?? undefined,
    productName: r.product_name ?? undefined,
    status: r.status,
    createdAt: Number(r.created_at),
  };
}

/* ───────────────────────── brands ───────────────────────── */

export async function listBrands() {
  const rows = await query(`SELECT * FROM brands ORDER BY name`);
  return rows.map(mapBrand);
}

export async function upsertBrand(b: any) {
  await query(
    `INSERT INTO brands (id, name, color, category, blurb, logo)
     VALUES (?,?,?,?,?,?)
     ON DUPLICATE KEY UPDATE
       name=VALUES(name), color=VALUES(color), category=VALUES(category),
       blurb=VALUES(blurb), logo=VALUES(logo)`,
    [b.id, b.name, b.color ?? null, b.category ?? null, b.blurb ?? null, b.logo ?? null]
  );
  const rows = await query(`SELECT * FROM brands WHERE id=?`, [b.id]);
  return mapBrand(rows[0]);
}

export async function deleteBrand(id: string) {
  await query(`DELETE FROM brands WHERE id=?`, [id]);
}

/* ───────────────────────── categories ───────────────────────── */

export async function listCategories() {
  const rows = await query(`SELECT * FROM categories ORDER BY name`);
  return rows.map(mapCategory);
}

export async function upsertCategory(c: any) {
  await query(
    `INSERT INTO categories (id, name, description, icon)
     VALUES (?,?,?,?)
     ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description), icon=VALUES(icon)`,
    [c.id, c.name, c.description ?? null, c.icon ?? "Tags"]
  );
  const rows = await query(`SELECT * FROM categories WHERE id=?`, [c.id]);
  return mapCategory(rows[0]);
}

export async function deleteCategory(id: string) {
  await query(`DELETE FROM categories WHERE id=?`, [id]);
}

/* ───────────────────────── industries ───────────────────────── */

export async function listIndustries() {
  const rows = await query(`SELECT * FROM industries ORDER BY name`);
  return rows.map(mapIndustry);
}

export async function upsertIndustry(i: any) {
  await query(
    `INSERT INTO industries
       (id, name, short, tagline, description, image, icon, accent, capabilities, stat, visible, created_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
     ON DUPLICATE KEY UPDATE
       name=VALUES(name), short=VALUES(short), tagline=VALUES(tagline),
       description=VALUES(description), image=VALUES(image), icon=VALUES(icon),
       accent=VALUES(accent), capabilities=VALUES(capabilities), stat=VALUES(stat),
       visible=VALUES(visible)`,
    [
      i.id,
      i.name,
      i.short ?? null,
      i.tagline ?? null,
      i.description ?? null,
      i.image ?? null,
      i.icon ?? "Factory",
      i.accent ?? "#ed1c24",
      JSON.stringify(i.capabilities ?? []),
      JSON.stringify(i.stat ?? { value: "", label: "" }),
      i.visible === false ? 0 : 1,
      Number(i.createdAt) || Date.now(),
    ]
  );
  const rows = await query(`SELECT * FROM industries WHERE id=?`, [i.id]);
  return mapIndustry(rows[0]);
}

export async function toggleIndustry(id: string) {
  await query(`UPDATE industries SET visible = IF(visible=1,0,1) WHERE id=?`, [id]);
  const rows = await query(`SELECT * FROM industries WHERE id=?`, [id]);
  return rows[0] ? mapIndustry(rows[0]) : null;
}

export async function deleteIndustry(id: string) {
  await query(`DELETE FROM industries WHERE id=?`, [id]);
}

/* ───────────────────────── products ───────────────────────── */

export async function listProducts() {
  const rows = await query(`SELECT * FROM products ORDER BY name`);
  return rows.map(mapProduct);
}

export async function getProduct(id: string) {
  const rows = await query(`SELECT * FROM products WHERE id=?`, [id]);
  return rows[0] ? mapProduct(rows[0]) : null;
}

export async function upsertProduct(p: any) {
  await query(
    `INSERT INTO products
       (id, slug, name, brand_id, brand, category_id, industries, price, rating,
        short_desc, description, features, specs, images, featured, special, badge, visible)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
     ON DUPLICATE KEY UPDATE
       slug=VALUES(slug), name=VALUES(name), brand_id=VALUES(brand_id), brand=VALUES(brand),
       category_id=VALUES(category_id), industries=VALUES(industries), price=VALUES(price),
       rating=VALUES(rating), short_desc=VALUES(short_desc), description=VALUES(description),
       features=VALUES(features), specs=VALUES(specs), images=VALUES(images),
       featured=VALUES(featured), special=VALUES(special), badge=VALUES(badge), visible=VALUES(visible)`,
    [
      p.id,
      p.slug,
      p.name,
      p.brandId ?? null,
      p.brand ?? null,
      p.categoryId ?? null,
      JSON.stringify(p.industries ?? []),
      Number(p.price ?? 0),
      Number(p.rating ?? 0),
      p.shortDesc ?? null,
      p.description ?? null,
      JSON.stringify(p.features ?? []),
      JSON.stringify(p.specs ?? []),
      JSON.stringify(p.images ?? []),
      p.featured ? 1 : 0,
      p.special ? 1 : 0,
      p.badge ?? null,
      p.visible === false ? 0 : 1,
    ]
  );
  return getProduct(p.id);
}

export async function deleteProduct(id: string) {
  await query(`DELETE FROM products WHERE id=?`, [id]);
}

export async function toggleProduct(id: string) {
  await query(`UPDATE products SET visible = IF(visible=1,0,1) WHERE id=?`, [id]);
  return getProduct(id);
}

/* ───────────────────────── inquiries ───────────────────────── */

export async function listInquiries() {
  const rows = await query(`SELECT * FROM inquiries ORDER BY created_at DESC`);
  return rows.map(mapInquiry);
}

export async function createInquiry(data: any) {
  const id =
    data.id ||
    `inq-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const createdAt = data.createdAt || Date.now();
  const status = data.status || "new";
  await query(
    `INSERT INTO inquiries
       (id, name, email, phone, address, message, product_id, product_name, status, created_at)
     VALUES (?,?,?,?,?,?,?,?,?,?)`,
    [
      id,
      data.name,
      data.email,
      data.phone ?? null,
      data.address ?? null,
      data.message ?? null,
      data.productId ?? null,
      data.productName ?? null,
      status,
      createdAt,
    ]
  );
  const rows = await query(`SELECT * FROM inquiries WHERE id=?`, [id]);
  return mapInquiry(rows[0]);
}

export async function setInquiryStatus(id: string, status: string) {
  await query(`UPDATE inquiries SET status=? WHERE id=?`, [status, id]);
  const rows = await query(`SELECT * FROM inquiries WHERE id=?`, [id]);
  return rows[0] ? mapInquiry(rows[0]) : null;
}

export async function deleteInquiry(id: string) {
  await query(`DELETE FROM inquiries WHERE id=?`, [id]);
}

/* ───────────────────────── counts (for seeding) ───────────────────────── */

export async function tableCount(table: string): Promise<number> {
  const rows = await query<{ c: number }>(`SELECT COUNT(*) AS c FROM \`${table}\``);
  return Number(rows[0]?.c ?? 0);
}
