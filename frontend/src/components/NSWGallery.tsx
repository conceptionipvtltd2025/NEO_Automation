import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { nswGallery } from "@/data/nswGallery";

export function NSWGallery() {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const next = useCallback(
    () => setActive((i) => (i === null ? i : (i + 1) % nswGallery.length)),
    []
  );
  const prev = useCallback(
    () =>
      setActive((i) =>
        i === null ? i : (i - 1 + nswGallery.length) % nswGallery.length
      ),
    []
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, close, next, prev]);

  return (
    <>
      {/* Uniform grid — every tile is a 4:3 cell (object-cover crops to fit) so
          rows stay aligned with no ragged bottoms. Full image shows in lightbox. */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {nswGallery.map((photo, i) => (
          <motion.button
            key={photo.thumb}
            type="button"
            onClick={() => setActive(i)}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
            className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-neo-500"
            aria-label={`View photo: ${photo.caption}`}
          >
            <img
              src={photo.thumb}
              alt={photo.caption}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
            <span className="absolute inset-x-0 bottom-0 translate-y-2 p-3 text-left text-xs font-medium text-pure opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
              {photo.caption}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] grid place-items-center p-4 sm:p-8"
          >
            <div
              className="absolute inset-0 bg-ink-950/90 backdrop-blur-md"
              onClick={close}
            />

            <button
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-xl border border-white/15 bg-ink-900/60 text-steel-200 transition hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <button
              onClick={prev}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-ink-900/60 text-steel-200 transition hover:text-white sm:left-6"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={next}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-ink-900/60 text-steel-200 transition hover:text-white sm:right-6"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <motion.figure
              key={active}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="relative z-[5] flex max-h-[88vh] max-w-5xl flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={nswGallery[active].full}
                alt={nswGallery[active].caption}
                className="max-h-[80vh] w-auto rounded-2xl border border-white/10 object-contain shadow-card"
              />
              <figcaption className="mt-4 text-center text-sm text-steel-300">
                {nswGallery[active].caption}
                <span className="ml-2 text-steel-500">
                  {active + 1} / {nswGallery.length}
                </span>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
