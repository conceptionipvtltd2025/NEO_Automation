import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";
import type { Product } from "@/data/products";
import { formatINR } from "@/lib/utils";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link
        to={`/products/${product.slug}`}
        className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-850/50 transition-all duration-500 will-change-transform hover:-translate-y-1.5 hover:border-neo-600/40 hover:shadow-[0_28px_60px_-26px_rgba(237,28,36,0.45)]"
      >
        <div className="shine-sweep force-dark relative aspect-[4/3] overflow-hidden bg-ink-800">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover opacity-90 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-transparent to-transparent" />
          {product.badge && (
            <span className="absolute left-3 top-3 rounded-full border border-neo-600/40 bg-neo-600/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-neo-300 backdrop-blur-md">
              {product.badge}
            </span>
          )}
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-ink-950/70 px-2.5 py-1 text-[11px] font-medium text-amber-400 backdrop-blur-md">
            <Star className="h-3 w-3 fill-amber-400" /> {product.rating}
          </span>
          <span className="absolute bottom-3 left-3 text-xs font-medium uppercase tracking-wider text-steel-300">
            {product.brand}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-base font-semibold leading-snug text-white transition-colors group-hover:text-neo-300">
            {product.name}
          </h3>
          <p className="mt-2 line-clamp-2 flex-1 text-sm text-steel-400">
            {product.shortDesc}
          </p>
          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
            <div>
              <span className="text-[11px] text-steel-500">From</span>
              
            </div>
            <span className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-steel-300 transition-all duration-300 group-hover:border-neo-600 group-hover:bg-neo-600 group-hover:text-pure">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
