import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/data/products";
import { safeImg, onImgError } from "@/lib/image";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group h-full"
    >
      <Link
        to={`/products/${product.slug}`}
        className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-850/50 transition-all duration-500 will-change-transform hover:-translate-y-1.5 hover:border-neo-600/40 hover:shadow-[0_28px_60px_-26px_rgba(237,28,36,0.45)]"
      >
        <div className="shine-sweep force-dark relative aspect-[4/3] overflow-hidden bg-ink-800">
          <img
            src={safeImg(product.images[0])}
            onError={onImgError}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover opacity-90 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-transparent to-transparent" />
          {product.badge && (
            <span className="absolute left-2 top-2 max-w-[calc(100%-1rem)] truncate rounded-full border border-neo-600/40 bg-neo-600/15 px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-normal text-neo-300 backdrop-blur-md sm:left-3 sm:top-3 sm:max-w-[calc(100%-1.5rem)] sm:px-3 sm:py-1 sm:text-[12px] sm:tracking-wider">
              {product.badge}
            </span>
          )}
          <span className="absolute bottom-2 left-2 max-w-[calc(100%-1rem)] truncate text-[10px] font-medium uppercase tracking-wider text-steel-300 sm:bottom-3 sm:left-3 sm:text-xs">
            {product.brand}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-3 sm:p-5">
          <h3 className="line-clamp-2 font-display text-[13.5px] font-semibold leading-snug text-white transition-colors group-hover:text-neo-300 sm:min-h-[3rem] sm:text-base">
            {product.name}
          </h3>
          <p className="mt-1.5 hidden line-clamp-2 flex-1 text-sm text-steel-400 sm:mt-2 sm:block">
            {product.shortDesc}
          </p>
          <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-2.5 sm:pt-4">
            <span className="text-[11px] font-medium uppercase tracking-wider text-steel-500 sm:text-[13px]">
              View details
            </span>
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/10 text-steel-300 transition-all duration-300 group-hover:border-neo-600 group-hover:bg-neo-600 group-hover:text-pure sm:h-9 sm:w-9">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
