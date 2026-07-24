import { useMemo, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Search,
  X,
  PackageOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ProductsHeaderArt } from "@/components/ui/HeaderArt";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { useCatalog } from "@/store/useCatalog";
import { type Brand, type BrandLine } from "@/data/brands";
import { BrandLogoPlate } from "@/components/BrandLogoPlate";
import { categoryIcon } from "@/lib/categoryIcons";
import { lineImage } from "@/lib/lineImage";
import { brandLogo } from "@/lib/asset";
import { onImgError } from "@/lib/image";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 8;

export default function Products() {
  const [params, setParams] = useSearchParams();
  const allProducts = useCatalog((s) => s.products);
  const categories = useCatalog((s) => s.categories);
  const industries = useCatalog((s) => s.industries);
  // Brands (and their product lines) are admin-editable, so they come from the
  // store rather than the static seed module.
  const brands = useCatalog((s) => s.brands);

  const [search, setSearch] = useState(params.get("q") ?? "");
  const [brand, setBrand] = useState(params.get("brand") ?? "all");
  const [line, setLine] = useState(params.get("line") ?? "all");
  const [category, setCategory] = useState(params.get("category") ?? "all");
  const [industry, setIndustry] = useState(params.get("industry") ?? "all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const next: Record<string, string> = {};
    if (brand !== "all") next.brand = brand;
    if (brand !== "all" && line !== "all") next.line = line;
    if (category !== "all") next.category = category;
    if (industry !== "all") next.industry = industry;
    setParams(next, { replace: true });
  }, [brand, line, category, industry, setParams]);

  // …and the other direction. State is seeded from the URL only on mount, so a
  // link that lands on /products while already on /products (the mega-menu's
  // "Shop by Category" items, the footer, a line card on a brand page) changed
  // the address bar and nothing else. Only assign on a real difference, so this
  // can't ping-pong with the effect above.
  const paramBrand = params.get("brand") ?? "all";
  const paramLine = params.get("line") ?? "all";
  const paramCategory = params.get("category") ?? "all";
  const paramIndustry = params.get("industry") ?? "all";
  useEffect(() => {
    if (paramBrand !== brand) setBrand(paramBrand);
    if (paramLine !== line) setLine(paramLine);
    if (paramCategory !== category) setCategory(paramCategory);
    if (paramIndustry !== industry) setIndustry(paramIndustry);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramBrand, paramLine, paramCategory, paramIndustry]);

  // The line filter only means anything inside a brand, so switching brand
  // (or going back to "All brands") drops it.
  const selectBrand = (id: string) => {
    setBrand(id);
    setLine("all");
  };

  const activeBrand: Brand | undefined =
    brand === "all" ? undefined : brands.find((b) => b.id === brand);

  // Counts shown against each line in the dropdown. Deliberately computed from
  // the brand's visible products only — NOT from `filtered` — so the numbers
  // stay stable as the user moves between lines instead of collapsing to 0.
  const brandProducts = useMemo(
    () =>
      activeBrand
        ? allProducts.filter(
            (p) => p.brandId === activeBrand.id && p.visible !== false
          )
        : [],
    [allProducts, activeBrand]
  );
  const lineOptions: (BrandLine & { count: number })[] = useMemo(
    () =>
      (activeBrand?.lines ?? []).map((l) => ({
        ...l,
        count: brandProducts.filter((p) => p.line === l.id).length,
      })),
    [activeBrand, brandProducts]
  );

  // A `?line=` that doesn't exist on this brand (a stale bookmark, or a line an
  // admin renamed/removed) would filter the grid to nothing with no tile
  // showing as selected. Fall back to "all" rather than leaving a dead end.
  useEffect(() => {
    if (line === "all") return;
    const known = (activeBrand?.lines ?? []).some((l) => l.id === line);
    if (!known) setLine("all");
  }, [line, activeBrand]);

  // Simulated async load via TanStack Query (drives loading skeletons)
  const { data, isLoading } = useQuery({
    queryKey: ["products", allProducts.length],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 550));
      return allProducts;
    },
    initialData: undefined,
  });

  const filtered = useMemo(() => {
    let list = (data ?? []).filter((p) => p.visible !== false);
    if (brand !== "all") list = list.filter((p) => p.brandId === brand);
    if (brand !== "all" && line !== "all")
      list = list.filter((p) => p.line === line);
    if (category !== "all") list = list.filter((p) => p.categoryId === category);
    if (industry !== "all")
      list = list.filter((p) => p.industries.includes(industry));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.shortDesc.toLowerCase().includes(q)
      );
    }
    // Featured first. There is no sort control any more, and this is the order
    // the catalogue is curated in.
    return [...list].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  }, [data, brand, line, category, industry, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage]
  );

  // Reset to first page whenever the result set changes
  useEffect(() => {
    setPage(1);
  }, [brand, line, category, industry, search]);

  const goToPage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => {
    setBrand("all");
    setLine("all");
    setCategory("all");
    setIndustry("all");
    setSearch("");
  };

  // Removable chips for whatever is currently narrowing the grid. Brand and
  // line have their own visible controls (the strip and the tiles), so only the
  // ones with no on-page control of their own are listed here.
  const activeFilterChips = [
    category !== "all" && {
      key: "category",
      label: categories.find((c) => c.id === category)?.name ?? category,
      clear: () => setCategory("all"),
    },
    industry !== "all" && {
      key: "industry",
      label: industries.find((i) => i.id === industry)?.name ?? industry,
      clear: () => setIndustry("all"),
    },
    search.trim() && {
      key: "search",
      label: `“${search.trim()}”`,
      clear: () => setSearch(""),
    },
  ].filter(Boolean) as { key: string; label: string; clear: () => void }[];

  return (
    <>
      <PageHeader
        eyebrow="Catalogue"
        title="Industrial tools & automation products"
        subtitle="Explore our complete range — filter by brand, category or the industry you operate in."
        crumbs={[{ label: "Products" }]}
        media={<ProductsHeaderArt />}
      />

      {/* Brands first — the client-approved sequence, each linking to its own
          range page (Atlas Copco → Electric Assembly Tools → …). */}
      <section id="brands" className="container-px scroll-mt-28 pb-4">
        <SectionHeading
          eyebrow="Our Brands"
          title={`${brands.length} global ranges, one partner`}
          subtitle="We are the authorised distributor for each of these manufacturers. Open a brand to see its full product range, with a short brief on every line."
        />
        <StaggerGroup className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {brands.map((b) => (
            <StaggerItem key={b.id}>
              <BrandTile brand={b} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* Then the catalogue */}
      <section id="catalogue" className="container-px scroll-mt-28 py-14">
        <SectionHeading
          eyebrow="Our Catalogue"
          title={`${categories.length} solution families`}
          subtitle="From tightening and riveting to crane systems, air piping and AGV/AMR — the complete Neo Automation offering."
        />
        <StaggerGroup className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => {
            const Icon = categoryIcon(c.icon);
            const active = category === c.id;
            return (
              <StaggerItem key={c.id}>
                <button
                  type="button"
                  onClick={() => {
                    setCategory(active ? "all" : c.id);
                    document
                      .getElementById("catalogue-results")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={cn(
                    "group flex h-full w-full items-start gap-4 rounded-2xl border p-5 text-left transition",
                    active
                      ? "border-neo-600/50 bg-neo-600/10"
                      : "border-white/10 bg-white/[0.02] hover:border-neo-600/30 hover:bg-white/[0.04]"
                  )}
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-neo-600/15 text-neo-400 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-display text-[15px] font-semibold text-white">
                      {c.name}
                    </span>
                    <span className="mt-1.5 block text-[13px] leading-relaxed text-steel-400">
                      {c.description}
                    </span>
                  </span>
                </button>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </section>

      <section id="catalogue-results" className="container-px scroll-mt-24 pb-24">
        {/* Toolbar — search only. The sort select and the Filters panel were
            removed: brands are chosen from the strip above, categories from the
            catalogue grid, and lines from the picture tiles, so the panel was a
            third way to do the same thing. Any filter still arriving by URL (a
            mega-menu or footer link) surfaces as a removable chip below. */}
        <div className="sticky top-20 z-20 mb-6 rounded-2xl border border-white/10 bg-ink-900/80 p-3 backdrop-blur-xl">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, brands…"
              aria-label="Search products"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-steel-600 focus:border-neo-600/50"
            />
          </div>
        </div>

        {/* Active filters — the only way to see and clear a category/industry
            that came in from a link now that the Filters panel is gone. */}
        {activeFilterChips.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-steel-500">
              Filtered by
            </span>
            {activeFilterChips.map((f) => (
              <button
                key={f.key}
                onClick={f.clear}
                className="inline-flex items-center gap-1.5 rounded-full border border-neo-600/40 bg-neo-600/10 px-3 py-1.5 text-xs font-medium text-white transition hover:border-neo-600/70"
              >
                {f.label}
                <X className="h-3 w-3 text-neo-400" />
              </button>
            ))}
            {activeFilterChips.length > 1 && (
              <button
                onClick={reset}
                className="text-xs text-neo-400 transition hover:text-neo-300"
              >
                Clear all
              </button>
            )}
          </div>
        )}

        {/* Brand tabs — one-click filtering by brand, in the approved sequence */}
        <div
          className="mb-6 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <BrandTab
            label="All Brands"
            active={brand === "all"}
            onClick={() => selectBrand("all")}
          />
          {brands.map((b) => (
            <BrandTab
              key={b.id}
              label={b.name}
              active={brand === b.id}
              color={b.color}
              onClick={() => selectBrand(b.id)}
            />
          ))}
        </div>

        {/* Product lines within the selected brand — picture tiles, so a range
            is recognisable at a glance rather than being one row of text in a
            menu. Each tile's photo comes from lineImage() (admin upload →
            a product in the line → the catalogue family's photo). */}
        {activeBrand && activeBrand.lines.length > 0 && (
          <Reveal className="mb-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-display text-sm font-semibold text-white">
                    {activeBrand.name} product lines
                  </p>
                  <p className="mt-1 text-[13px] text-steel-400">
                    {activeBrand.category} · {activeBrand.lines.length} ranges
                  </p>
                </div>
                <Link
                  to={`/brands/${activeBrand.id}`}
                  className="btn-ghost text-[13px]"
                >
                  Full {activeBrand.name} range
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-4 border-t border-white/10 pt-4">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  <LineTile
                    label="All lines"
                    count={brandProducts.length}
                    image={activeBrand.logo}
                    logo
                    accent={activeBrand.color}
                    active={line === "all"}
                    onClick={() => setLine("all")}
                  />
                  {lineOptions.map((l) => (
                    <LineTile
                      key={l.id}
                      label={l.name}
                      count={l.count}
                      image={lineImage(l, allProducts, activeBrand.id)}
                      accent={activeBrand.color}
                      active={line === l.id}
                      onClick={() => setLine(l.id)}
                    />
                  ))}
                </div>

                {/* The chosen line explains itself without a second click. */}
                <p
                  key={line}
                  className="mt-4 max-w-3xl text-[13px] leading-relaxed text-steel-400"
                >
                  {line === "all"
                    ? activeBrand.blurb
                    : activeBrand.lines.find((l) => l.id === line)?.brief}
                </p>
              </div>
            </div>
          </Reveal>
        )}

        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-steel-400">
            {isLoading
              ? "Loading…"
              : filtered.length === 0
              ? "0 products"
              : `Showing ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(
                  currentPage * PAGE_SIZE,
                  filtered.length
                )} of ${filtered.length} products`}
          </p>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-2xl border border-white/5 bg-white/[0.02]"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] py-24 text-center">
            <PackageOpen className="h-12 w-12 text-steel-600" />
            <h3 className="mt-4 font-display text-lg font-semibold text-white">
              No products match
            </h3>
            <p className="mt-1 text-sm text-steel-400">
              Try adjusting your filters or search.
            </p>
            <button onClick={reset} className="btn-ghost mt-5 text-[13px]">
              Reset filters
            </button>
          </div>
        ) : (
          <>
            <motion.div
              layout
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {paginated.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </motion.div>

            {totalPages > 1 && (
              <Pagination
                page={currentPage}
                totalPages={totalPages}
                onChange={goToPage}
              />
            )}
          </>
        )}
      </section>
    </>
  );
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  // Build a compact page list with ellipses, e.g. 1 … 4 5 6 … 12
  const pages: (number | "…")[] = [];
  const push = (p: number | "…") => pages.push(p);
  const window = 1; // neighbors on each side of current
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || (p >= page - window && p <= page + window)) {
      push(p);
    } else if (pages[pages.length - 1] !== "…") {
      push("…");
    }
  }

  return (
    <nav
      aria-label="Pagination"
      className="mt-12 flex items-center justify-center gap-2"
    >
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-steel-300 transition hover:border-neo-600/50 hover:text-white disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span
            key={`gap-${i}`}
            className="grid h-10 w-10 place-items-center text-sm text-steel-600"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "grid h-10 min-w-10 place-items-center rounded-xl border px-3 text-sm font-medium transition",
              p === page
                ? "border-neo-600/50 bg-neo-600/15 text-white"
                : "border-white/10 text-steel-300 hover:border-white/20 hover:text-white"
            )}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
        className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-steel-300 transition hover:border-neo-600/50 hover:text-white disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}

/**
 * Picture tile for one product line. The photo fills the tile with a dark scrim
 * so the label always reads; hovering lifts it, zooms the photo and lights the
 * rim in the brand colour. The active tile keeps a solid brand-coloured rim and
 * a check.
 */
function LineTile({
  label,
  count,
  image,
  accent,
  active,
  logo = false,
  onClick,
}: {
  label: string;
  count: number;
  image: string;
  accent: string;
  active: boolean;
  /** Render the image as a contained logo on white rather than a cover photo. */
  logo?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        // force-dark pins the dark token set inside the tile. Without it the
        // ink-950 scrim flips to light platinum in the light theme and the
        // white label lands on a near-white gradient — the same reason the
        // MegaMenu image tiles carry it.
        "force-dark group relative isolate flex h-28 flex-col justify-end overflow-hidden rounded-xl border p-3 text-left transition-all duration-300 hover:-translate-y-1",
        // Selection is carried by a WHITE ring, not the brand colour: several
        // brands are navy or near-black (Legris #0a3d91, GEDORE #1e4d9b) and an
        // accent-coloured border on a dark photo is invisible. The accent still
        // appears as the tint and the check, but never alone.
        active
          ? "border-white/70 shadow-card ring-2 ring-white/60"
          : "border-white/10 hover:border-white/30"
      )}
    >
      {logo ? (
        // "All lines" uses the brand logo — contained on a constant white chip,
        // never cropped like a photo.
        <span className="absolute inset-0 -z-10 grid place-items-center bg-pure p-4">
          <img
            src={brandLogo(image)}
            alt=""
            onError={onImgError}
            className="max-h-full max-w-full object-contain opacity-90"
          />
        </span>
      ) : (
        <img
          src={image}
          alt=""
          loading="lazy"
          onError={onImgError}
          className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}

      {/* Scrim — keeps the label legible on any photo, in either theme. The
          logo variant needs a HEAVIER foot than the photo one: white text over
          a white logo chip has no contrast of its own to fall back on. */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 -z-10 transition-opacity duration-300",
          logo
            ? "bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/10"
            : "bg-gradient-to-t from-ink-950/90 via-ink-950/45 to-ink-950/20 group-hover:from-ink-950/85"
        )}
      />
      {active && (
        <span
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{ background: `${accent}26` }}
        />
      )}

      <span className="flex items-start justify-between gap-1.5">
        <span
          title={label}
          className="line-clamp-2 text-[11.5px] font-semibold leading-tight text-pure drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
        >
          {label}
        </span>
        {active && (
          // White check, brand colour only as a fill hint — see the ring note
          // above: the accent alone is invisible for the navy brands.
          <Check className="mt-px h-3.5 w-3.5 shrink-0 text-pure drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]" />
        )}
      </span>
      <span className="mt-1 text-[10px] font-medium uppercase tracking-wider text-pure/70">
        {count} {count === 1 ? "product" : "products"}
      </span>
    </button>
  );
}

/** Logo tile in the "Our Brands" strip — same plate as the homepage cards, so
 *  the ten logos read as one set rather than ten different sizes. */
function BrandTile({ brand }: { brand: Brand }) {
  return (
    <Link
      to={`/brands/${brand.id}`}
      className="group flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-neo-600/30 hover:bg-white/[0.04]"
    >
      <BrandLogoPlate brand={brand} size="md" className="w-full" />
      <span className="text-[11px] leading-tight text-steel-400 transition group-hover:text-white">
        {brand.category}
      </span>
    </Link>
  );
}

function BrandTab({
  label,
  active,
  color,
  onClick,
}: {
  label: string;
  active: boolean;
  color?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={active && color ? { borderColor: color, color } : undefined}
      className={cn(
        "shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition",
        active
          ? "border-neo-600/60 bg-neo-600/10 text-white"
          : "border-white/10 text-steel-300 hover:border-white/25 hover:text-white"
      )}
    >
      {label}
    </button>
  );
}
