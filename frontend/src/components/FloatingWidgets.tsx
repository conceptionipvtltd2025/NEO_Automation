import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send, Phone } from "lucide-react";
import { site } from "@/data/site";

// Live chat is a static mockup with no real backend yet — hidden until the
// client wants it. Flip to `true` to re-enable the chat button and panel.
const CHAT_ENABLED = false;

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.25 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  );
}

export function FloatingWidgets() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {CHAT_ENABLED && chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            className="w-[330px] overflow-hidden rounded-2xl glass-strong shadow-card"
          >
            <div className="flex items-center justify-between bg-gradient-to-r from-neo-700 to-neo-600 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pure/70" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-pure" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-pure">Neo Live Chat</p>
                  <p className="text-[10px] text-pure/70">Typically replies in minutes</p>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-pure/80 hover:text-pure">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3 p-4">
              <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white/[0.06] px-3.5 py-2.5 text-sm text-steel-100">
                👋 Welcome to Neo Automation! How can our engineers help you today?
              </div>
              <div className="flex flex-wrap gap-2">
                {["Request a quote", "Atlas Copco SWF", "Talk to sales"].map((q) => (
                  <button
                    key={q}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-steel-200 transition hover:border-neo-600/50 hover:text-white"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 border-t border-white/10 p-3">
              <input
                placeholder="Type a message…"
                className="flex-1 bg-transparent px-2 text-sm text-white outline-none placeholder:text-steel-500"
              />
              <button className="grid h-9 w-9 place-items-center rounded-full bg-neo-600 text-pure transition hover:bg-neo-500">
                <Send className="h-4 w-4" />
              </button>
            </div>
            <a
              href={`tel:${site.phoneDial}`}
              className="flex items-center justify-center gap-2 border-t border-white/10 py-2.5 text-xs text-steel-300 transition hover:text-white"
            >
              <Phone className="h-3.5 w-3.5" /> {site.phone}
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <a
        href={`https://wa.me/${site.whatsapp}`}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className="grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-pure shadow-[0_8px_30px_-6px_rgba(37,211,102,0.6)] transition-transform hover:scale-110"
      >
        <WhatsAppIcon className="h-7 w-7" />
      </a>

      {CHAT_ENABLED && (
        <button
          onClick={() => setChatOpen((o) => !o)}
          aria-label="Live chat"
          className="grid h-14 w-14 place-items-center rounded-full bg-neo-600 text-pure shadow-glow transition-transform hover:scale-110"
        >
          <AnimatePresence mode="wait">
            {chatOpen ? (
              <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <X className="h-6 w-6" />
              </motion.span>
            ) : (
              <motion.span key="c" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                <MessageCircle className="h-6 w-6" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      )}
    </div>
  );
}
