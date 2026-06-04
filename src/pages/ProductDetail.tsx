import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ShieldCheck,
  Truck,
  Headphones,
  ChevronRight,
  Check,
  ArrowLeft,
  MessageSquareQuote,
} from "lucide-react";
import { useCatalog } from "@/store/useCatalog";
import { brands } from "@/data/brands";
import { Modal } from "@/components/ui/Modal";
import { InquiryForm } from "@/components/InquiryForm";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { GridBackground, Aurora } from "@/components/ui/Backgrounds";
import { formatINR, cn } from "@/lib/utils";
import NotFound from "./NotFound";

const trust = [
  { icon: ShieldCheck, label: "Genuine & warranty-backed" },
  { icon: Truck, label: "Pan-India delivery" },
  { icon: Headphones, label: "Engineering support" },
];

export default function ProductDetail() {
  const { slug } = useParams();
  const products = useCatalog((s) => s.products);
  const product = products.find((p) => p.slug === slug);
  const [activeImg, setActiveImg] = useState(0);
  const [tab, setTab] = useState<"desc" | "specs">("desc");
  const [inquiryOpen, setInquiryOpen] = useState(false);

  if (!product) return <NotFound />;

  const brand = brands.find((b) => b.id === product.brandId);
  const related = products
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId && p.visible !== false)
    .slice(0, 4);

  return (
    <>
      <section className="relative overflow-hidden pt-32">
        <GridBackground className="opacity-40" />
        <Aurora />
        <div className="container-px relative z-10">
          <nav className="flex items-center gap-1.5 text-sm text-steel-400">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight className="h-3.5 w-3.5 text-steel-600" />
            <Link to="/products" className="hover:text-white">Products</Link>
            <ChevronRight className="h-3.5 w-3.5 text-steel-600" />
            <span className="text-white">{product.name}</span>
          </nav>

          <div className="mt-8 grid gap-10 lg:grid-cols-2">
            {/* Gallery */}
            <div>
              <motion.div
                layout
                className="relative aspect-square overflow-hidden rounded-3xl border border-white/10 bg-ink-850 shadow-card ring-1 ring-black/5"
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImg}
                    src={product.images[activeImg]}
                    alt={product.name}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="h-full w-full object-cover"
                  />
                </AnimatePresence>
                {product.badge && (
                  <span className="absolute left-4 top-4 rounded-full border border-neo-600/40 bg-neo-600/15 px-3 py-1 text-xs font-semibold text-neo-300 backdrop-blur-md">
                    {product.badge}
                  </span>
                )}
              </motion.div>
              {product.images.length > 1 && (
                <div className="mt-4 flex gap-3">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={cn(
                        "h-20 w-20 overflow-hidden rounded-xl border transition",
                        activeImg === i
                          ? "border-neo-600"
                          : "border-white/10 opacity-60 hover:opacity-100"
                      )}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <div className="flex items-center gap-3">
                <span className="font-display text-sm font-bold uppercase tracking-wider text-neo-400">
                  {product.brand}
                </span>
                <span className="flex items-center gap-1 text-sm text-amber-400">
                  <Star className="h-4 w-4 fill-amber-400" /> {product.rating}
                </span>
              </div>
              <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
                {product.name}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-steel-300">
                {product.shortDesc}
              </p>

              <div className="mt-6 flex items-end gap-3">
                <div>
                  <span className="text-xs text-steel-500">Starting from</span>
                  <p className="font-display text-3xl font-bold text-white">
                    {formatINR(product.price)}
                  </p>
                </div>
                <span className="mb-1 text-xs text-steel-500">excl. taxes</span>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  onClick={() => setInquiryOpen(true)}
                  className="btn-primary"
                >
                  <MessageSquareQuote className="h-4 w-4" /> Inquiry Now
                </button>
                <Link to="/contact" className="btn-ghost">
                  Talk to expert
                </Link>
              </div>

              <div className="mt-7 grid grid-cols-3 gap-3">
                {trust.map((t) => (
                  <div
                    key={t.label}
                    className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-center"
                  >
                    <t.icon className="mx-auto h-5 w-5 text-neo-500" />
                    <p className="mt-2 text-[11px] leading-tight text-steel-400">
                      {t.label}
                    </p>
                  </div>
                ))}
              </div>

              {brand && (
                <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <p className="text-xs uppercase tracking-wider text-steel-500">
                    Manufacturer
                  </p>
                  <p className="mt-1 font-semibold text-white">{brand.name}</p>
                  <p className="mt-1 text-sm text-steel-400">{brand.blurb}</p>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-16">
            <div className="flex gap-2 border-b border-white/10">
              {[
                { id: "desc", label: "Description & Features" },
                { id: "specs", label: "Specifications" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id as "desc" | "specs")}
                  className={cn(
                    "relative px-4 py-3 text-sm font-medium transition",
                    tab === t.id ? "text-white" : "text-steel-400 hover:text-white"
                  )}
                >
                  {t.label}
                  {tab === t.id && (
                    <motion.span
                      layoutId="detail-tab"
                      className="absolute inset-x-0 -bottom-px h-0.5 bg-neo-600"
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="py-8">
              {tab === "desc" ? (
                <div className="grid gap-8 lg:grid-cols-2">
                  <p className="text-base leading-relaxed text-steel-300">
                    {product.description}
                  </p>
                  <div>
                    <h4 className="font-display text-base font-semibold text-white">
                      Key features
                    </h4>
                    <ul className="mt-4 space-y-3">
                      {product.features.map((f) => (
                        <li key={f} className="flex items-start gap-3 text-sm text-steel-300">
                          <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-neo-600/15 text-neo-400">
                            <Check className="h-3 w-3" />
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-white/10">
                  {product.specs.map((s, i) => (
                    <div
                      key={s.label}
                      className={cn(
                        "grid grid-cols-2 gap-4 px-5 py-4 text-sm",
                        i % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"
                      )}
                    >
                      <span className="text-steel-400">{s.label}</span>
                      <span className="font-medium text-white">{s.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="container-px py-16">
          <Reveal>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-white">
                Related products
              </h2>
              <Link to="/products" className="text-sm text-neo-400 hover:text-neo-300">
                View all →
              </Link>
            </div>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      <Modal
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        title="Product Inquiry"
        maxWidth="max-w-xl"
      >
        <InquiryForm
          productId={product.id}
          productName={product.name}
          compact
        />
      </Modal>
    </>
  );
}
