import type { Brand } from "@/data/brands";
import type { Product } from "@/data/products";
import type { Category } from "@/data/categories";
import type { Industry } from "@/data/industries";

// Full-site search. Unifies STATIC entries (fixed pages + notable sections) with
// DYNAMIC entries pulled live from the catalog store — products, categories,
// industries and brands (brands carry their admin-editable product lines, which
// are indexed too). Matching is field-weighted so a name hit outranks a
// description hit, and results group by type for the auto-suggest dropdown.

export type SearchGroup =
  | "Product"
  | "Category"
  | "Brand"
  | "Industry"
  | "Page"
  | "Section"
  | "Legal";

export const GROUP_ORDER: SearchGroup[] = [
  "Product",
  "Category",
  "Brand",
  "Industry",
  "Page",
  "Section",
  "Legal",
];

export type SearchEntry = {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  group: SearchGroup;
  /** Extra searchable text (brand, description, features…), not shown directly. */
  keywords?: string;
  /** Optional thumbnail (products). */
  image?: string;
};

type IndexedEntry = SearchEntry & { _t: string; _s: string; _k: string };

// ── Static pages & sections ────────────────────────────────────────────────
// hrefs already include any in-page hash so results deep-link to the section.
const STATIC_ENTRIES: SearchEntry[] = [
  // Pages
  { id: "page:home", title: "Home", subtitle: "Engineering Tomorrow's Industry", href: "/", group: "Page", keywords: "home neo automation productivity quality safety traceability industrial tools distributor" },
  { id: "page:products", title: "Products", subtitle: "Full catalogue with search & filters", href: "/products", group: "Page", keywords: "catalogue shop browse tools buy filter category brand industry" },
  { id: "page:industries", title: "Industries", subtitle: "Sectors we power", href: "/industries", group: "Page", keywords: "industries sectors applications automotive manufacturing ev assembly battery industrial assembly aerospace energy oil gas wind electronic electronics home appliances white goods metal fabrication welding heavy equipment machinery excavator semiconductor wafer fab cleanroom railway rail rolling stock trains" },
  { id: "page:service", title: "Service", subtitle: "Neo Service Workshop — nut runners restored & certified", href: "/nsw", group: "Page", keywords: "nsw neo service workshop repair calibration service nut runner hydraulic tools tensioner amc spares" },
  { id: "page:about", title: "About Neo", subtitle: "Precision is our heritage", href: "/about", group: "Page", keywords: "about company history baldev solanki ahmedabad 2007 heritage" },
  { id: "page:safety", title: "Safety", subtitle: "Safety is engineered, not enforced", href: "/safety", group: "Page", keywords: "safety ehs hse operator ergonomics torque reaction kickback vde insulated 1000v high voltage hv ev battery compressed air safety coupling blow gun abrasive guard ppe hard hat lifting load test calibration traceability poka yoke error proofing risk hazard control training competence occupational health" },
  { id: "page:contact", title: "Contact", subtitle: "We'd love to hear from you", href: "/contact", group: "Page", keywords: "contact address phone email hours map directions location get in touch" },
  { id: "page:inquiry", title: "Get a Quote", subtitle: "Tell us what you need", href: "/inquiry", group: "Page", keywords: "quote inquiry enquiry pricing request availability recommendation" },

  { id: "page:sustainability", title: "Sustainability", subtitle: "Our environmental and responsibility commitments", href: "/sustainability", group: "Page", keywords: "sustainability environment responsible sourcing circularity esg community green csr recycling" },

  // Safety sections
  { id: "sec:safety-disciplines", title: "Four Safety Disciplines", subtitle: "Operator, process, electrical and site", href: "/safety#disciplines", group: "Section", keywords: "operator safety process safety electrical safety vde site workshop safety ergonomics" },
  { id: "sec:safety-hazards", title: "Hazard & Control", subtitle: "Seven risks we design out of the station", href: "/safety#hazards", group: "Section", keywords: "torque reaction kickback manual handling strain live electrical hv ev compressed air abrasive rotating undocumented torque suspended loads" },
  { id: "sec:safety-service", title: "Safety Through Service", subtitle: "A tool stays safe only if it is kept safe", href: "/safety#in-service", group: "Section", keywords: "certified genuine spares oem trained preventive maintenance amc calibration" },
  { id: "sec:safety-training", title: "Safety Training & Standards", subtitle: "Training, competence and accountability", href: "/safety#training", group: "Section", keywords: "training competence handover standards accountability iso 45001 audit ehs" },

  // Home sections
  { id: "sec:brands", title: "Our Brands", subtitle: "The world's finest brands, delivered by Neo", href: "/#brands", group: "Section", keywords: "authorised distribution atlas copco gesipa gedore pferd cejn partners logos" },
  { id: "sec:home-industries", title: "Industries We Power", subtitle: "Built for the floors that build the world", href: "/#industries", group: "Section", keywords: "automotive ev assembly industrial assembly aerospace energy electronic home appliances metal fabrication heavy equipment semiconductor railway" },
  { id: "sec:catalogue", title: "Our Catalogue", subtitle: "Precision tools for every process", href: "/#products", group: "Section", keywords: "catalogue categories assembly tightening riveting dispensing gluing material removal air line accessories air motors process software sockets fixtures spm aluminium crane compressed air piping hand tools storage agv amr" },
  { id: "sec:brand-index", title: "Shop by Brand", subtitle: "All ten ranges we distribute", href: "/products#brands", group: "Section", keywords: "brands atlas copco gesipa eepos cejn legris transair john guest jg hoffmann gedore pferd" },
  { id: "sec:special", title: "Special Products", subtitle: "Special products, built to outperform", href: "/#special-products", group: "Section", keywords: "signature flagship 3d showpiece special" },
  { id: "sec:process", title: "How We Work", subtitle: "A proven path from enquiry to uptime", href: "/#process", group: "Section", keywords: "process consult specify deploy support engagement" },
  { id: "sec:capabilities", title: "What We Do", subtitle: "End-to-end engineering, not just a supplier", href: "/#capabilities", group: "Section", keywords: "distribution system integration calibration training spares consumables" },
  { id: "sec:video", title: "Watch Neo in Action", subtitle: "See Neo Automation in action", href: "/#video", group: "Section", keywords: "showreel video watch" },

  // Service sections
  { id: "sec:what-we-service", title: "What We Service", subtitle: "Every nut runner, fully restored", href: "/nsw#what-we-service", group: "Section", keywords: "pneumatic battery electric torque service offerings" },
  { id: "sec:torque-calibration", title: "Torque Calibration", subtitle: "Documented calibration & certification", href: "/nsw#torque-calibration", group: "Section", keywords: "calibration torque certificate audit report" },
  { id: "sec:hydraulic-tools", title: "Hydraulic Tools", subtitle: "Wrenches, tensioners & pumps — service and re-certification", href: "/nsw#hydraulic-tools", group: "Section", keywords: "hydraulic torque wrench bolt tensioner pump seal kit pressure test service" },
  { id: "sec:repair-spares", title: "Repair & Genuine Spares", subtitle: "Genuine spares, fast turnaround", href: "/nsw#repair-spares", group: "Section", keywords: "repair spares genuine overhaul" },
  { id: "sec:inside-workshop", title: "Inside the Workshop", subtitle: "Our Atlas Copco-inaugurated service workshop", href: "/nsw#inside-the-workshop", group: "Section", keywords: "workshop gallery facility atlas copco inauguration" },
  { id: "sec:service-promise", title: "The Service Promise", subtitle: "A workshop built around your uptime", href: "/nsw#service-promise", group: "Section", keywords: "guarantee oem-trained in-house amc uptime" },

  // About sections
  { id: "sec:story", title: "Our Story", subtitle: "Founded 2007 in Ahmedabad, Gujarat", href: "/about#story", group: "Section", keywords: "story founder history origin stats baldev solanki" },
  { id: "sec:mission-vision", title: "Mission & Vision", subtitle: "Our mission and vision", href: "/about#mission-vision", group: "Section", keywords: "mission vision precision traceable industry 4.0 safety" },
  { id: "sec:timeline", title: "Our Journey", subtitle: "Built milestone by milestone", href: "/about#timeline", group: "Section", keywords: "timeline milestones journey history" },
  { id: "sec:values", title: "Core Values", subtitle: "What drives us", href: "/about#values", group: "Section", keywords: "integrity precision partnership excellence values" },
  { id: "sec:credentials", title: "Credentials & Partnerships", subtitle: "Authorised, trained & accountable", href: "/about#credentials", group: "Section", keywords: "authorised distributor oem-trained credentials genuine equipment partnerships" },
  { id: "sec:message", title: "Send a Message", subtitle: "We'll get back within one business day", href: "/contact#message-form", group: "Section", keywords: "message form enquiry contact form" },

  // Legal
  { id: "legal:terms", title: "Terms of Use", subtitle: "Products, quotations & governing terms", href: "/terms", group: "Legal", keywords: "terms conditions liability governing law quotations legal" },
  { id: "legal:privacy", title: "Privacy Policy", subtitle: "How we collect and protect your data", href: "/privacy", group: "Legal", keywords: "privacy data cookies security rights legal" },
];

const prepare = (e: SearchEntry): IndexedEntry => ({
  ...e,
  _t: e.title.toLowerCase(),
  _s: (e.subtitle ?? "").toLowerCase(),
  _k: (e.keywords ?? "").toLowerCase(),
});

/** Build the merged index from live catalog data + static entries + brands. */
export function buildSearchIndex(
  products: Product[],
  categories: Category[],
  industries: Industry[],
  brands: Brand[]
): IndexedEntry[] {
  const dynamic: SearchEntry[] = [];

  for (const p of products) {
    if (p.visible === false) continue;
    dynamic.push({
      id: "product:" + p.id,
      title: p.name,
      subtitle: p.brand + (p.shortDesc ? " — " + p.shortDesc : ""),
      href: `/products/${p.slug}`,
      group: "Product",
      image: p.images?.[0],
      keywords: [p.brand, p.badge, p.shortDesc, ...(p.features ?? [])]
        .filter(Boolean)
        .join(" "),
    });
  }

  for (const c of categories) {
    dynamic.push({
      id: "category:" + c.id,
      title: c.name,
      subtitle: c.description,
      href: `/products?category=${c.id}`,
      group: "Category",
      keywords: c.description,
    });
  }

  for (const b of brands) {
    dynamic.push({
      id: "brand:" + b.id,
      title: b.name,
      subtitle: b.category,
      href: `/brands/${b.id}`,
      group: "Brand",
      // Line names make a search for "electric assembly tools" or "nut insert"
      // land on the brand page that actually documents that range.
      keywords: [
        b.blurb,
        ...(b.lines ?? []).flatMap((l) => [l.name, ...(l.models ?? [])]),
      ].join(" "),
    });
  }

  for (const i of industries) {
    if (i.visible === false) continue;
    dynamic.push({
      id: "industry:" + i.id,
      title: i.name,
      subtitle: i.tagline || i.short,
      href: `/industries/${i.id}`,
      group: "Industry",
      keywords: [i.short, i.tagline, i.description, ...(i.capabilities ?? [])]
        .filter(Boolean)
        .join(" "),
    });
  }

  return [...dynamic, ...STATIC_ENTRIES].map(prepare);
}

function scoreEntry(e: IndexedEntry, q: string, terms: string[]): number {
  let score = 0;

  if (e._t === q) score += 200;
  else if (e._t.startsWith(q)) score += 120;
  else if (e._t.includes(q)) score += 70;
  if (e._s.includes(q)) score += 28;
  if (e._k.includes(q)) score += 16;

  // Multi-word queries require every term to appear somewhere (AND semantics).
  if (terms.length > 1) {
    for (const t of terms) {
      const inT = e._t.includes(t);
      const inS = e._s.includes(t);
      const inK = e._k.includes(t);
      if (!inT && !inS && !inK) return 0;
      score += inT ? 12 : inS ? 6 : 3;
    }
  }

  return score;
}

/** Ranked, de-duplicated results for a query (empty query → []). */
export function searchSite(
  index: IndexedEntry[],
  query: string,
  limit = 8
): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);

  const scored: { e: IndexedEntry; score: number }[] = [];
  for (const e of index) {
    const score = scoreEntry(e, q, terms);
    if (score > 0) scored.push({ e, score });
  }

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const g = GROUP_ORDER.indexOf(a.e.group) - GROUP_ORDER.indexOf(b.e.group);
    if (g !== 0) return g;
    return a.e.title.length - b.e.title.length;
  });

  return scored.slice(0, limit).map((s) => s.e);
}

/** Group ranked results by type, preserving the display group order. */
export function groupResults(
  results: SearchEntry[]
): { group: SearchGroup; items: SearchEntry[] }[] {
  const map = new Map<SearchGroup, SearchEntry[]>();
  for (const r of results) {
    const list = map.get(r.group);
    if (list) list.push(r);
    else map.set(r.group, [r]);
  }
  return GROUP_ORDER.filter((g) => map.has(g)).map((g) => ({
    group: g,
    items: map.get(g)!,
  }));
}
