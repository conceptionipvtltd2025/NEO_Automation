import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useCatalog } from "@/store/useCatalog";
import {
  homeFeatured,
  visibleProducts,
  byHomeOrder,
  homeCategoryIds,
  isHomeProduct,
} from "@/lib/homeProducts";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import { cn } from "@/lib/utils";

const LIMIT = 8;

export function ProductsSection() {
  const [cat, setCat] = useState<string>("all");
  // Live catalogue, so the admin's "Featured" flag and home ordering show up
  // here without a rebuild.
  const products = useCatalog((s) => s.products);
  const categories = useCatalog((s) => s.categories);

  const catIds = useMemo(() => homeCategoryIds(categories), [categories]);

  // Tabs follow the same tagging: a category pinned to the home page always
  // gets a tab, and so does any category that an individually-tagged product
  // belongs to. If nothing is tagged at all, fall back to every category that
  // actually has products, so the section still works out of the box.
  const tabs = useMemo(() => {
    const live = visibleProducts(products);
    const tagged = categories.filter(
      (c) => c.showOnHome || live.some((p) => p.featured && p.categoryId === c.id)
    );
    const shown = tagged.length
      ? tagged
      : categories.filter((c) => live.some((p) => p.categoryId === c.id));
    return [{ id: "all", name: "All" }, ...shown];
  }, [products, categories]);

  // A category can disappear from the catalogue while it is the active tab
  // (admin deletes it, or hides its last product) — fall back to All rather
  // than showing an empty grid under a tab that no longer renders.
  const active = tabs.some((t) => t.id === cat) ? cat : "all";

  const visible = useMemo(() => {
    if (active === "all") return homeFeatured(products, categories, LIMIT);
    // Inside a category tab: if the family itself is pinned, show all of it;
    // otherwise only the products tagged individually. Either way the tagged
    // ones lead, and the rest of the category backfills so a tab is never empty.
    const inCat = visibleProducts(products).filter((p) => p.categoryId === active);
    const tagged = inCat.filter((p) => isHomeProduct(p, catIds)).sort(byHomeOrder);
    const rest = inCat.filter((p) => !isHomeProduct(p, catIds)).sort(byHomeOrder);
    return [...tagged, ...rest].slice(0, LIMIT);
  }, [active, products, categories, catIds]);

  return (
    <section id="products" className="relative py-10 sm:py-16">
      <div className="container-px">
        <SectionHeading
          eyebrow="Our Catalogue"
          title="Precision tools for every process"
          subtitle="A curated range of assembly, riveting, lifting, finishing and fluid solutions — all genuine, all supported."
          action={
            <Link to="/products" className="btn-ghost text-[14.5px]">
              Browse all <ArrowUpRight className="h-4 w-4" />
            </Link>
          }
        />

        {/* Category pills — a clean swipeable bar on mobile (edge-to-edge,
            scrollbar hidden), wrapping normally from sm up. */}
        <div className="mt-7 -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
          {tabs.map((t) => {
            const isActive = active === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setCat(t.id)}
                className={cn(
                  "relative shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive ? "text-white" : "text-steel-400 hover:text-white"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="prod-tab"
                    className="absolute inset-0 rounded-full border border-neo-600/40 bg-neo-600/15"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{t.name}</span>
              </button>
            );
          })}
        </div>

        <motion.div layout className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <motion.div
                layout
                key={p.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                // Pass the stretched grid-item height down, or the card inside
                // shrinks to its own content and the row goes ragged.
                className="h-full"
              >
                <ProductCard product={p} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
