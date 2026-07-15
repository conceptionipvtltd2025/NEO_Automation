import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { IndustriesHeaderArt } from "@/components/ui/HeaderArt";
import { IndustryTile } from "@/components/IndustryTile";
import { useCatalog } from "@/store/useCatalog";
import { cn } from "@/lib/utils";

// The full seed set fits on one page; pagination only kicks in once an admin
// adds beyond this.
const PAGE_SIZE = 12;

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
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {paged.map((ind, i) => (
            <IndustryTile key={ind.id} industry={ind} index={i} />
          ))}
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
