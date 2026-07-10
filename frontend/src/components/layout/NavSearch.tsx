import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, ArrowUpRight, PackageOpen } from "lucide-react";
import { useCatalog } from "@/store/useCatalog";
import { safeImg, onImgError } from "@/lib/image";
import { cn } from "@/lib/utils";

// Navbar search: an icon button that opens a dropdown panel with a live-results
// search field. Typing filters products (name / brand / description); picking a
// result routes to its detail page. Available on every page via the navbar.
const MAX_RESULTS = 6;

export function NavSearch({ className }: { className?: string }) {
  const products = useCatalog((s) => s.products);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const q = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!q) return [];
    return products
      .filter((p) => p.visible !== false)
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.shortDesc.toLowerCase().includes(q)
      )
      .slice(0, MAX_RESULTS);
  }, [products, q]);

  // Focus the field as soon as the panel opens.
  useEffect(() => {
    if (open) inputRef.current?.focus();
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
  };

  // Enter → jump to the full catalogue with the query applied.
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/products?q=${encodeURIComponent(query.trim())}`);
    close();
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Search products"
        aria-expanded={open}
        title="Search products"
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
            className="force-dark absolute right-0 top-[calc(100%+0.6rem)] z-50 w-[min(92vw,24rem)] overflow-hidden rounded-2xl border border-white/10 bg-ink-900/95 shadow-card backdrop-blur-xl"
          >
            <form onSubmit={submit} className="relative border-b border-white/10 p-3">
              <Search className="pointer-events-none absolute left-6 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-500" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, brands…"
                aria-label="Search products"
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-9 text-sm text-white outline-none transition placeholder:text-steel-600 focus:border-neo-600/50"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-5 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg text-steel-400 transition hover:bg-white/[0.06] hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </form>

            {q && (
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {results.length > 0 ? (
                  <>
                    <ul className="space-y-1">
                      {results.map((p) => (
                        <li key={p.id}>
                          <Link
                            to={`/products/${p.slug}`}
                            onClick={close}
                            className="group flex items-center gap-3 rounded-xl p-2 transition hover:bg-white/[0.05]"
                          >
                            <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-ink-800">
                              <img
                                src={safeImg(p.images[0])}
                                onError={onImgError}
                                alt={p.name}
                                loading="lazy"
                                className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
                              />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-[10px] font-medium uppercase tracking-wider text-steel-500">
                                {p.brand}
                              </span>
                              <span className="block truncate text-sm font-medium text-white transition-colors group-hover:text-neo-300">
                                {p.name}
                              </span>
                            </span>
                            <ArrowUpRight className="h-4 w-4 shrink-0 text-steel-500 transition group-hover:text-neo-400" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link
                      to={`/products?q=${encodeURIComponent(query.trim())}`}
                      onClick={close}
                      className="mt-1 flex items-center justify-center gap-1.5 rounded-xl border border-white/10 px-3 py-2.5 text-xs font-medium text-neo-400 transition hover:border-neo-600/40 hover:text-neo-300"
                    >
                      See all results in the catalogue
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </>
                ) : (
                  <div className="px-4 py-8 text-center">
                    <PackageOpen className="mx-auto h-7 w-7 text-steel-600" />
                    <p className="mt-2 text-xs text-steel-400">
                      No products match “{query.trim()}”.
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
