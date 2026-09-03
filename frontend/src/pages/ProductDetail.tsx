import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { safeImg, onImgError } from "@/lib/image";
import {
  ShieldCheck,
  Truck,
  Headphones,
  ChevronRight,
  Check,
  ArrowLeft,
  MessageSquareQuote,
  FileText,
  Download,
} from "lucide-react";
import { useCatalog } from "@/store/useCatalog";
import type { ProductDocument } from "@/data/products";
import { Modal } from "@/components/ui/Modal";
import { InquiryForm } from "@/components/InquiryForm";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { GridBackground, Aurora } from "@/components/ui/Backgrounds";
import { cn, formatBytes } from "@/lib/utils";
import NotFound from "./NotFound";

type TabId = "desc" | "specs" | "docs";

const trust = [
  { icon: ShieldCheck, label: "Genuine & warranty-backed" },
  { icon: Truck, label: "Pan-India delivery" },
  { icon: Headphones, label: "Engineering support" },
];

/** One downloadable PDF — used both in the buying column and the Downloads tab. */
function DocLink({ doc, index = 0 }: { doc: ProductDocument; index?: number }) {
  const size = formatBytes(doc.size);
  return (
    <motion.a
      href={doc.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 transition hover:border-neo-600/40 hover:bg-white/[0.06]"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-neo-600/15 text-neo-400 transition group-hover:bg-neo-600 group-hover:text-pure">
        <FileText className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-white">{doc.label}</span>
        <span className="mt-0.5 block text-[13px] text-steel-500">
          PDF{size ? ` · ${size}` : ""} · opens in a new tab
        </span>
      </span>
      <Download className="h-4 w-4 shrink-0 text-steel-500 transition group-hover:text-neo-400" />
    </motion.a>
  );
}

export default function ProductDetail() {
  const { slug } = useParams();
  const products = useCatalog((s) => s.products);
  const brands = useCatalog((s) => s.brands);
  const product = products.find((p) => p.slug === slug);
  const [activeImg, setActiveImg] = useState(0);
  const [tab, setTab] = useState<TabId>("desc");
  const [inquiryOpen, setInquiryOpen] = useState(false);

  if (!product) return <NotFound />;

  const brand = brands.find((b) => b.id === product.brandId);
  // Downloads only earn a tab when the admin has attached literature to this
  // product — an empty tab would just be a dead end for the visitor.
  const documents = (product.documents ?? []).filter((d) => d?.url);
  const tabs: { id: TabId; label: string }[] = [
    { id: "desc", label: "Description & Features" },
    { id: "specs", label: "Specifications" },
    ...(documents.length
      ? [{ id: "docs" as TabId, label: `Downloads (${documents.length})` }]
      : []),
  ];
  // A product edited to drop its last PDF while the tab is open would otherwise
  // render an empty panel.
  const activeTab: TabId = tab === "docs" && !documents.length ? "desc" : tab;
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
                className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-ink-850 shadow-card ring-1 ring-black/5 sm:aspect-square"
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImg}
                    src={safeImg(product.images[activeImg])}
                    onError={onImgError}
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
                      <img src={safeImg(img)} onError={onImgError} alt="" className="h-full w-full object-cover" />
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
              </div>
              <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
                {product.name}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-steel-300">
                {product.shortDesc}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  onClick={() => setInquiryOpen(true)}
                  className="btn-primary"
                >
                  <MessageSquareQuote className="h-4 w-4" /> Enquire Now
                </button>
                <Link to="/contact" className="btn-ghost">
                  Talk to expert
                </Link>
              </div>

              <div className="mt-7 grid grid-cols-3 gap-2 xs:gap-3">
                {trust.map((t) => (
                  <div
                    key={t.label}
                    className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-center"
                  >
                    <t.icon className="mx-auto h-5 w-5 text-neo-500" />
                    <p className="mt-2 text-[13px] leading-tight text-steel-400">
                      {t.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Literature sits in the buying column, not only behind the
                  Downloads tab — a datasheet is part of the decision, so it has
                  to be visible without hunting for it. */}
              {documents.length > 0 && (
                <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs uppercase tracking-wider text-steel-500">
                      Documentation
                    </p>
                    <span className="rounded-full border border-neo-600/30 bg-neo-600/10 px-2 py-0.5 text-[12px] font-semibold uppercase tracking-wider text-neo-400">
                      {documents.length} PDF{documents.length > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="mt-3 space-y-2">
                    {documents.map((doc, i) => (
                      <DocLink key={`${doc.url}-${i}`} doc={doc} index={i} />
                    ))}
                  </div>
                </div>
              )}

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
            <div className="flex flex-wrap gap-2 border-b border-white/10">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "relative px-4 py-3 text-sm font-medium transition",
                    activeTab === t.id ? "text-white" : "text-steel-400 hover:text-white"
                  )}
                >
                  {t.label}
                  {activeTab === t.id && (
                    <motion.span
                      layoutId="detail-tab"
                      className="absolute inset-x-0 -bottom-px h-0.5 bg-neo-600"
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="py-8">
              {activeTab === "desc" ? (
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
              ) : activeTab === "specs" ? (
                <div className="overflow-hidden rounded-2xl border border-white/10">
                  {product.specs.map((s, i) => (
                    <div
                      key={s.label}
                      className={cn(
                        // Stacked on phones: a forced 2-column split left long
                        // spec values wrapping in a ~120px sliver.
                        "grid grid-cols-1 gap-1 px-4 py-3.5 text-sm sm:grid-cols-2 sm:gap-4 sm:px-5 sm:py-4",
                        i % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"
                      )}
                    >
                      <span className="text-steel-400">{s.label}</span>
                      <span className="font-medium text-white">{s.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {documents.map((doc, i) => (
                    <DocLink key={`${doc.url}-${i}`} doc={doc} index={i} />
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
        title="Product Enquiry"
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
