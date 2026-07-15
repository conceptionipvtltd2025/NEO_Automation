import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  X,
  ArrowUpRight,
  CornerDownLeft,
  Package,
  Layers,
  Tag,
  Factory,
  FileText,
  Hash,
  Scale,
  SearchX,
  type LucideIcon,
} from "lucide-react";
import { useCatalog } from "@/store/useCatalog";
import {
  buildSearchIndex,
  searchSite,
  groupResults,
  type SearchGroup,
} from "@/lib/search";
import { safeImg, onImgError } from "@/lib/image";
import { cn } from "@/lib/utils";

// Full-site search: an icon button that opens an animated command-palette-style
// panel. Typing live-searches products, categories, brands, industries AND every
// static page/section, grouped with auto-suggestion. Arrow keys move the
// highlight, Enter opens it; a footer action runs a full catalogue search.
const MAX_RESULTS = 8;

const GROUP_ICON: Record<SearchGroup, LucideIcon> = {
  Product: Package,
  Category: Layers,
  Brand: Tag,
  Industry: Factory,
  Page: FileText,
  Section: Hash,
  Legal: Scale,
};

const GROUP_LABEL: Record<SearchGroup, string> = {
  Product: "Products",
  Category: "Categories",
  Brand: "Brands",
  Industry: "Industries",
  Page: "Pages",
  Section: "Sections",
  Legal: "Legal",
};

export function NavSearch({
  className,
  onOpenChange,
}: {
  className?: string;
  onOpenChange?: (open: boolean) => void;
}) {
  const products = useCatalog((s) => s.products);
  const categories = useCatalog((s) => s.categories);
  const industries = useCatalog((s) => s.industries);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const index = useMemo(
    () => buildSearchIndex(products, categories, industries),
    [products, categories, industries]
  );
  const results = useMemo(
    () => searchSite(index, query, MAX_RESULTS),
    [index, query]
  );
  const groups = useMemo(() => groupResults(results), [results]);
  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);
  const flatIndex = useMemo(() => {
    const m = new Map<string, number>();
    flat.forEach((r, i) => m.set(r.id, i));
    return m;
  }, [flat]);

  const q = query.trim();

  // Reset the highlight whenever the result set changes.
  useEffect(() => setActive(0), [query]);

  // Focus the field as soon as the panel opens.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Let the navbar know so it can drop its over-hero dark chrome while the
  // panel is open, keeping the (now theme-aware) dropdown legible.
  useEffect(() => {
    onOpenChange?.(open);
  }, [open]);

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    setQuery("");
    setActive(0);
  };

  const go = (href: string) => {
    navigate(href);
    close();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q) return;
    if (flat.length > 0 && active >= 0 && active < flat.length) {
      go(flat[active].href);
    } else {
      go(`/products?q=${encodeURIComponent(q)}`);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!flat.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % flat.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + flat.length) % flat.length);
    }
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Search the site"
        aria-expanded={open}
        title="Search the site"
        className="group grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-steel-200 transition-colors hover:border-neo-600/40 hover:text-white"
      >
        {open ? <X className="h-[18px] w-[18px]" /> : <Search className="h-[18px] w-[18px]" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-[calc(100%+0.6rem)] z-50 w-[min(94vw,30rem)] overflow-hidden rounded-2xl border border-white/10 bg-ink-900/95 shadow-card backdrop-blur-xl"
          >
            <form onSubmit={submit} className="relative border-b border-white/10 p-3">
              <Search className="pointer-events-none absolute left-6 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-500" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search products, industries, pages…"
                aria-label="Search the site"
                role="combobox"
                aria-expanded={flat.length > 0}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-9 text-sm text-white outline-none transition placeholder:text-steel-600 focus:border-neo-600/50"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className="absolute right-5 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg text-steel-400 transition hover:bg-white/[0.06] hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </form>

            {!q ? (
              <div className="px-4 py-6 text-center">
                <p className="text-xs text-steel-400">
                  Search the entire site — products, brands, industries,
                  services and pages.
                </p>
                <p className="mt-2 text-[11px] text-steel-600">
                  Try “tensor”, “aerospace”, “calibration” or “sustainability”.
                </p>
              </div>
            ) : flat.length > 0 ? (
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {groups.map((grp) => {
                  const Icon = GROUP_ICON[grp.group];
                  return (
                    <div key={grp.group} className="mb-1.5 last:mb-0">
                      <p className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-steel-600">
                        {GROUP_LABEL[grp.group]}
                      </p>
                      <ul className="space-y-0.5">
                        {grp.items.map((r) => {
                          const i = flatIndex.get(r.id) ?? -1;
                          const isActive = i === active;
                          return (
                            <li key={r.id}>
                              <Link
                                to={r.href}
                                onClick={close}
                                onMouseEnter={() => setActive(i)}
                                ref={
                                  isActive
                                    ? (el) =>
                                        el?.scrollIntoView({ block: "nearest" })
                                    : undefined
                                }
                                className={cn(
                                  "group flex items-center gap-3 rounded-xl p-2 transition",
                                  isActive
                                    ? "bg-white/[0.07]"
                                    : "hover:bg-white/[0.04]"
                                )}
                              >
                                <span className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg border border-white/10 bg-ink-800 text-steel-300">
                                  {r.group === "Product" && r.image ? (
                                    <img
                                      src={safeImg(r.image)}
                                      onError={onImgError}
                                      alt=""
                                      loading="lazy"
                                      className="h-full w-full object-cover opacity-90"
                                    />
                                  ) : (
                                    <Icon className="h-[18px] w-[18px]" />
                                  )}
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span
                                    className={cn(
                                      "block truncate text-sm font-medium transition-colors",
                                      isActive
                                        ? "text-neo-300"
                                        : "text-white group-hover:text-neo-300"
                                    )}
                                  >
                                    {r.title}
                                  </span>
                                  {r.subtitle && (
                                    <span className="block truncate text-[11px] text-steel-500">
                                      {r.subtitle}
                                    </span>
                                  )}
                                </span>
                                <ArrowUpRight
                                  className={cn(
                                    "h-4 w-4 shrink-0 transition",
                                    isActive
                                      ? "text-neo-400"
                                      : "text-steel-600 group-hover:text-neo-400"
                                  )}
                                />
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}

                <Link
                  to={`/products?q=${encodeURIComponent(q)}`}
                  onClick={close}
                  className="mt-1.5 flex items-center justify-center gap-1.5 rounded-xl border border-white/10 px-3 py-2.5 text-xs font-medium text-steel-300 transition hover:border-neo-600/40 hover:text-neo-300"
                >
                  Search the full catalogue for “{q}”
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              <div className="px-4 py-8 text-center">
                <SearchX className="mx-auto h-7 w-7 text-steel-600" />
                <p className="mt-2 text-xs text-steel-400">
                  Nothing matches “{q}”.
                </p>
                <Link
                  to={`/products?q=${encodeURIComponent(q)}`}
                  onClick={close}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-neo-400 transition hover:text-neo-300"
                >
                  Search the catalogue instead
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}

            {q && flat.length > 0 && (
              <div className="flex items-center justify-between border-t border-white/10 px-3 py-2 text-[10px] text-steel-600">
                <span className="flex items-center gap-1.5">
                  <kbd className="rounded border border-white/10 bg-white/[0.03] px-1.5 py-0.5">↑</kbd>
                  <kbd className="rounded border border-white/10 bg-white/[0.03] px-1.5 py-0.5">↓</kbd>
                  to navigate
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="rounded border border-white/10 bg-white/[0.03] px-1 py-0.5">
                    <CornerDownLeft className="h-2.5 w-2.5" />
                  </kbd>
                  to open
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
