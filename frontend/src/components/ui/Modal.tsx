import { type ReactNode, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export function Modal({
  open,
  onClose,
  children,
  title,
  maxWidth = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  maxWidth?: string;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] grid place-items-center p-4"
        >
          <div
            className="absolute inset-0 bg-ink-950/80 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            // data-lenis-prevent: let the wheel scroll THIS panel natively instead
            // of Lenis hijacking it for the (locked) page behind the modal.
            data-lenis-prevent
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className={`relative max-h-[90vh] w-full overflow-y-auto overscroll-contain rounded-2xl border border-white/10 bg-ink-900 p-6 shadow-card ${maxWidth}`}
          >
            <div className="flex items-start justify-between">
              {title && (
                <h3 className="font-display text-xl font-bold text-white">
                  {title}
                </h3>
              )}
              <button
                onClick={onClose}
                aria-label="Close"
                className="ml-auto grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-steel-300 transition hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
