import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Car,
  Plane,
  Server,
  Factory,
  CircuitBoard,
  Zap,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { IndustriesHeaderArt } from "@/components/ui/HeaderArt";
import { useCatalog } from "@/store/useCatalog";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  Car,
  Plane,
  Server,
  Factory,
  CircuitBoard,
  Zap,
};

const PAGE_SIZE = 6;

export default function Industries() {
  const allIndustries = useCatalog((s) => s.industries);
  const [page, setPage] = useState(1);

  // Public list: only enabled industries, newest added first.
  const industries = useMemo(
    () =>
      allIndustries
        .filter((i) => i.visible !== false)
        .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0)),
    [allIndustries]
  );

  const totalPages = Math.max(1, Math.ceil(industries.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = industries.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const goToPage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <PageHeader
        eyebrow="Industries"
        title="Solutions tuned to your sector"
        subtitle="Every industry has its own tolerances, takt times and standards. We bring the right tools and expertise to each."
        crumbs={[{ label: "Industries" }]}
        media={<IndustriesHeaderArt />}
      />

      <section className="container-px pb-12">
        <div className="grid gap-6 md:grid-cols-2">
          {paged.map((ind, i) => {
            const Icon = iconMap[ind.icon] ?? Factory;
            return (
              <motion.div
                key={ind.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: (i % 2) * 0.1 }}
              >
                <Link
                  to={`/industries/${ind.id}`}
                  className="force-dark group relative block h-full overflow-hidden rounded-3xl border border-white/10 shadow-card"
                >
                  <div className="relative h-72 overflow-hidden sm:h-80">
                    <img
                      src={ind.image}
                      alt={ind.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
                    <div
                      className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        background: `radial-gradient(circle at 50% 100%, ${ind.accent}33, transparent 70%)`,
                      }}
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-7">
                    <div className="flex items-center justify-between">
                      <span
                        className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 backdrop-blur-md"
                        style={{ background: `${ind.accent}22`, color: ind.accent }}
                      >
                        <Icon className="h-6 w-6" />
                      </span>
                      <span className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-steel-200 transition-all duration-300 group-hover:border-neo-600 group-hover:bg-neo-600 group-hover:text-pure">
                        <ArrowUpRight className="h-5 w-5" />
                      </span>
                    </div>
                    <h3 className="mt-5 font-display text-2xl font-bold text-white">
                      {ind.name}
                    </h3>
                    <p className="mt-2 max-w-md text-sm text-steel-300">
                      {ind.tagline}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-steel-400">
                      <strong className="text-white">{ind.stat.value}</strong>
                      {ind.stat.label}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {industries.length === 0 && (
          <p className="py-20 text-center text-steel-400">
            No industries to show yet.
          </p>
        )}

        {totalPages > 1 && (
          <nav
            aria-label="Pagination"
            className="mt-12 flex items-center justify-center gap-2"
          >
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-steel-300 transition hover:border-neo-600/50 hover:text-white disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => {
              const p = idx + 1;
              return (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  aria-current={p === currentPage ? "page" : undefined}
                  className={cn(
                    "grid h-10 min-w-10 place-items-center rounded-xl border px-3 text-sm font-medium transition",
                    p === currentPage
                      ? "border-neo-600/50 bg-neo-600/15 text-white"
                      : "border-white/10 text-steel-300 hover:border-white/20 hover:text-white"
                  )}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-steel-300 transition hover:border-neo-600/50 hover:text-white disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </nav>
        )}
      </section>
    </>
  );
}
