import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import { cn } from "@/lib/utils";

export function ProductsSection() {
  const [cat, setCat] = useState<string>("all");

  const visible = useMemo(() => {
    const list = products.filter((p) => p.visible !== false);
    const filtered = cat === "all" ? list : list.filter((p) => p.categoryId === cat);
    return filtered.slice(0, 8);
  }, [cat]);

  const tabs = [{ id: "all", name: "All" }, ...categories];

  return (
    <section id="products" className="relative py-16">
      <div className="container-px">
        <SectionHeading
          eyebrow="Our Catalogue"
          title="Precision tools for every process"
          subtitle="A curated range of assembly, riveting, lifting, finishing and fluid solutions — all genuine, all supported."
          action={
            <Link to="/products" className="btn-ghost text-[13px]">
              Browse all <ArrowUpRight className="h-4 w-4" />
            </Link>
          }
        />

        {/* Category pills — a clean swipeable bar on mobile (edge-to-edge,
            scrollbar hidden), wrapping normally from sm up. */}
        <div className="mt-10 -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
          {tabs.map((t) => {
            const isActive = cat === t.id;
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

        <motion.div layout className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <motion.div
                layout
                key={p.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
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
