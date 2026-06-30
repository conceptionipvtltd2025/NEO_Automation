import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  X,
  PackageOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ProductsHeaderArt } from "@/components/ui/HeaderArt";
import { ProductCard } from "@/components/ProductCard";
import { useCatalog } from "@/store/useCatalog";
import { brands } from "@/data/brands";
import { cn } from "@/lib/utils";

type Sort = "featured" | "price-asc" | "price-desc" | "rating";

const PAGE_SIZE = 8;

export default function Products() {
  const [params, setParams] = useSearchParams();
  const allProducts = useCatalog((s) => s.products);
  const categories = useCatalog((s) => s.categories);
  const industries = useCatalog((s) => s.industries);

  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState(params.get("brand") ?? "all");
  const [category, setCategory] = useState(params.get("category") ?? "all");
  const [industry, setIndustry] = useState(params.get("industry") ?? "all");
  const [sort, setSort] = useState<Sort>("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const next: Record<string, string> = {};
    if (brand !== "all") next.brand = brand;
    if (category !== "all") next.category = category;
    if (industry !== "all") next.industry = industry;
    setParams(next, { replace: true });
  }, [brand, category, industry, setParams]);

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
    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      default:
        list = [...list].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    }
    return list;
  }, [data, brand, category, industry, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage]
  );

  // Reset to first page whenever the result set changes
  useEffect(() => {
    setPage(1);
  }, [brand, category, industry, search, sort]);

  const goToPage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeFilters = [brand, category, industry].filter((f) => f !== "all").length;
  const reset = () => {
    setBrand("all");
    setCategory("all");
    setIndustry("all");
    setSearch("");
  };

  return (
    <>
      <PageHeader
        eyebrow="Catalogue"
        title="Industrial tools & automation products"
        subtitle="Explore our complete range — filter by brand, category or the industry you operate in."
        crumbs={[{ label: "Products" }]}
        media={<ProductsHeaderArt />}
      />

      <section className="container-px pb-24">
        {/* Toolbar */}
        <div className="sticky top-20 z-20 mb-8 rounded-2xl border border-white/10 bg-ink-900/80 p-3 backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, brands…"
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-steel-600 focus:border-neo-600/50"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-xl border border-white/10 bg-ink-850 px-4 py-2.5 text-sm text-white outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="rating">Top rated</option>
            </select>
            <button
              onClick={() => setShowFilters((s) => !s)}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition",
                showFilters || activeFilters
                  ? "border-neo-600/50 bg-neo-600/10 text-white"
                  : "border-white/10 text-steel-300 hover:text-white"
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilters > 0 && (
                <span className="grid h-5 w-5 place-items-center rounded-full bg-neo-600 text-[11px] text-pure">
                  {activeFilters}
                </span>
              )}
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 space-y-3 border-t border-white/10 pt-4">
                  <FilterRow
                    label="Brand"
                    value={brand}
                    onChange={setBrand}
                    options={[
                      { id: "all", name: "All brands" },
                      ...brands.map((b) => ({ id: b.id, name: b.name })),
                    ]}
                  />
                  <FilterRow
                    label="Category"
                    value={category}
                    onChange={setCategory}
                    options={[
                      { id: "all", name: "All categories" },
                      ...categories.map((c) => ({ id: c.id, name: c.name })),
                    ]}
                  />
                  <FilterRow
                    label="Industry"
                    value={industry}
                    onChange={setIndustry}
                    options={[
                      { id: "all", name: "All industries" },
                      ...industries.map((i) => ({ id: i.id, name: i.name })),
                    ]}
                  />
                  {activeFilters > 0 && (
                    <button
                      onClick={reset}
                      className="inline-flex items-center gap-1 text-xs text-neo-400 hover:text-neo-300"
                    >
                      <X className="h-3 w-3" /> Clear all filters
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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

function FilterRow({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { id: string; name: string }[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-20 shrink-0 text-xs font-semibold uppercase tracking-wider text-steel-500">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition",
              value === o.id
                ? "border-neo-600/50 bg-neo-600/15 text-white"
                : "border-white/10 text-steel-300 hover:border-white/20 hover:text-white"
            )}
          >
            {o.name}
          </button>
        ))}
      </div>
    </div>
  );
}
