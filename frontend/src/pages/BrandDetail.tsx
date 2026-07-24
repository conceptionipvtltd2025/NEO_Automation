import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, ArrowRight, FileText, Check } from "lucide-react";
import { useCatalog } from "@/store/useCatalog";
import { type Brand, type BrandLine } from "@/data/brands";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { PageHeader } from "@/components/PageHeader";
import { BrandLogoPlate } from "@/components/BrandLogoPlate";
import { lineImage } from "@/lib/lineImage";
import { onImgError } from "@/lib/image";
import NotFound from "./NotFound";

function LineCard({
  brand,
  line,
  count,
  image,
}: {
  brand: Brand;
  line: BrandLine;
  count: number;
  image: string;
}) {
  return (
    <div className="card-rich group flex h-full flex-col overflow-hidden">
      {/* Line artwork — admin upload, else a product from the line, else the
          catalogue family's photo (see lib/lineImage.ts). */}
      <div className="force-dark relative h-40 overflow-hidden">
        <img
          src={image}
          alt=""
          loading="lazy"
          onError={onImgError}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/35 to-transparent" />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px"
          style={{
            background: `linear-gradient(90deg, ${brand.color}, transparent)`,
          }}
        />
        {count > 0 && (
          // Dark pill with WHITE text: these photos run from near-black to
          // near-white, and several brand colours (Legris #0a3d91, GEDORE
          // #1e4d9b) are barely above the dark fill. The brand colour appears
          // as a dot instead, where contrast doesn't matter.
          <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-ink-950/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-pure ring-1 ring-inset ring-white/15 backdrop-blur-sm">
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: brand.color }}
            />
            {count} {count === 1 ? "product" : "products"}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-lg font-semibold text-white">
          {line.name}
        </h3>

        {/* The short brief the client asked to sit under every range. */}
        <p className="mt-3 text-sm leading-relaxed text-steel-400">{line.brief}</p>

        {line.models && line.models.length > 0 && (
          <ul className="mt-4 space-y-2 border-t border-white/10 pt-4">
            {line.models.map((m) => (
              <li
                key={m}
                className="flex items-start gap-2.5 text-[13px] text-steel-300"
              >
                <Check
                  className="mt-0.5 h-3.5 w-3.5 shrink-0"
                  style={{ color: brand.color }}
                />
                {m}
              </li>
            ))}
          </ul>
        )}

        <Link
          to={
            count > 0
              ? `/products?brand=${brand.id}&line=${line.id}`
              : `/inquiry?subject=${encodeURIComponent(
                  `${brand.name} — ${line.name}`
                )}`
          }
          // Every card repeats this label, so name the destination for anyone
          // tabbing through or listing links with a screen reader.
          aria-label={
            count > 0
              ? `View ${line.name} products`
              : `Enquire about ${line.name}`
          }
          className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-white/80 transition hover:text-white"
        >
          {count > 0 ? "View products" : "Enquire about this range"}
          <ArrowUpRight className="h-4 w-4 text-neo-500" />
        </Link>
      </div>
    </div>
  );
}

export default function BrandDetail() {
  const { brandId } = useParams();
  const allProducts = useCatalog((s) => s.products);
  const brands = useCatalog((s) => s.brands);
  const brand = brandId ? brands.find((b) => b.id === brandId) : undefined;

  // The store is seeded with the static brand list before load() resolves, so
  // this can only be a genuinely unknown id — not a not-yet-fetched one.
  if (!brand) return <NotFound />;

  const brandProducts = allProducts.filter(
    (p) => p.brandId === brand.id && p.visible !== false
  );
  const countFor = (lineId: string) =>
    brandProducts.filter((p) => p.line === lineId).length;
  // A brand added in the admin panel starts with no lines.
  const lines = brand.lines ?? [];

  const index = brands.findIndex((b) => b.id === brand.id);
  const next = brands[(index + 1) % brands.length];

  return (
    <>
      <PageHeader
        eyebrow={brand.category}
        title={brand.name}
        subtitle={brand.blurb}
        crumbs={[{ label: "Products", href: "/products" }, { label: brand.name }]}
        media={
          // The plate is the hero graphic itself — wrapping it in another
          // bordered box just made it look small inside a frame.
          <motion.div
            className="relative grid place-items-center"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute h-56 w-56 rounded-full blur-3xl"
              style={{ background: `${brand.color}2e` }}
            />
            <BrandLogoPlate brand={brand} size="xl" className="relative shadow-card" />
          </motion.div>
        }
      />

      <section className="container-px pb-6">
        <Link
          to="/products#brands"
          className="inline-flex items-center gap-2 text-sm text-steel-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> All brands
        </Link>
      </section>

      {/* Product lines — the second level of the catalogue */}
      {lines.length > 0 && (
        <section className="container-px py-10">
          <SectionHeading
            eyebrow="Product Range"
            title={`What we supply from ${brand.name}`}
            subtitle="Every range below carries a short brief so you can shortlist before you enquire — ask us for the full manufacturer catalogue on any of them."
          />
          <StaggerGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {lines.map((line) => (
              <StaggerItem key={line.id}>
                <LineCard
                  brand={brand}
                  line={line}
                  count={countFor(line.id)}
                  image={lineImage(line, allProducts, brand.id)}
                />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </section>
      )}

      {/* Manufacturer literature */}
      {brand.resources && brand.resources.length > 0 && (
        <section className="container-px py-6">
          <Reveal>
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <span className="text-sm font-medium text-white">
                Manufacturer literature
              </span>
              {brand.resources.map((r) => (
                <a
                  key={r.href}
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-[13px] text-steel-300 transition hover:border-neo-600/40 hover:text-white"
                >
                  <FileText className="h-3.5 w-3.5 text-neo-500" />
                  {r.label}
                </a>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {/* Products from this brand */}
      {brandProducts.length > 0 && (
        <section className="container-px py-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-2xl font-bold text-white">
              {brand.name} products
            </h2>
            <Link
              to={`/products?brand=${brand.id}`}
              className="btn-ghost text-[13px]"
            >
              Browse all <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {brandProducts.slice(0, 8).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* CTA + next brand */}
      <section className="container-px pb-20">
        <Reveal>
          <div className="gradient-border relative overflow-hidden p-8 sm:p-10">
            <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <span className="eyebrow">Authorised Distribution</span>
                <h2 className="mt-5 font-display text-[clamp(1.5rem,3vw,2.2rem)] font-bold leading-tight text-white">
                  Genuine {brand.name}, supported by Neo
                </h2>
                <p className="mt-4 max-w-xl leading-relaxed text-steel-400">
                  Original equipment, application engineering and in-house
                  service — tell us the joint, the cycle time and the tolerance,
                  and we will specify the right tool from the range.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link to="/inquiry" className="btn-primary justify-center">
                  Request a quote <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to={`/brands/${next.id}`} className="btn-ghost justify-center">
                  Next: {next.name} <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}