import { useEffect, useState } from "react";
import { MessageSquareText } from "lucide-react";
import { site } from "@/data/site";
import {
  TAWK_READY_EVENT,
  isTawkReady,
  openTawkChat,
} from "@/components/TawkChat";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.25 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  );
}

/**
 * The two floating contact launchers, rendered as ONE column so they share a
 * single right-hand axis and a single, consistent gap.
 *
 * The live-chat button is ours, not Tawk's: Tawk's stock bubble is hidden on
 * load (see components/TawkChat.tsx) because it positioned itself independently
 * — leaving dead space between the two icons — and because it opened with a
 * "👋 Hi! How can we help?" greeting balloon the client did not want. Clicking
 * ours opens the real Tawk conversation directly; if Tawk never loads (blocked,
 * offline) the button simply never appears and WhatsApp carries the load.
 */
export function FloatingWidgets() {
  const [chatAvailable, setChatAvailable] = useState(isTawkReady);

  useEffect(() => {
    if (chatAvailable) return;
    const onReady = () => setChatAvailable(true);
    window.addEventListener(TAWK_READY_EVENT, onReady);
    // Tawk can finish loading before this component mounts (or the event can be
    // missed across an HMR reload), so poll briefly as a safety net.
    const poll = window.setInterval(() => {
      if (isTawkReady()) {
        setChatAvailable(true);
        window.clearInterval(poll);
      }
    }, 1000);
    const stop = window.setTimeout(() => window.clearInterval(poll), 20000);
    return () => {
      window.removeEventListener(TAWK_READY_EVENT, onReady);
      window.clearInterval(poll);
      window.clearTimeout(stop);
    };
  }, [chatAvailable]);

  // Shared geometry: identical box, identical radius — that is what makes the
  // two icons read as one aligned stack rather than two loose stickers.
  const button =
    "group relative grid h-14 w-14 place-items-center rounded-full text-pure shadow-lg ring-1 ring-black/10 transition duration-200 hover:-translate-y-1 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950";

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-center gap-3">
      {chatAvailable && (
        <button
          type="button"
          onClick={() => openTawkChat()}
          aria-label="Live chat with Neo Automation"
          className={`${button} bg-neo-600 shadow-[0_16px_34px_-16px_rgba(237,28,36,0.95)] hover:bg-neo-500 hover:shadow-[0_20px_42px_-18px_rgba(237,28,36,1)] focus-visible:ring-neo-500/70`}
        >
          <MessageSquareText className="h-7 w-7" />
          <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-ink-900/95 px-3 py-1.5 text-[13px] font-medium text-white opacity-0 shadow-card ring-1 ring-white/10 transition-opacity duration-200 group-hover:opacity-100">
            Live chat
          </span>
        </button>
      )}

      <a
        href={`https://wa.me/${site.whatsapp}`}
        target="_blank"
        rel="noreferrer"
        aria-label={`WhatsApp Neo Automation on ${site.whatsappDisplay}`}
        className={`${button} bg-[#25D366] shadow-[0_16px_34px_-16px_rgba(37,211,102,0.95)] hover:shadow-[0_20px_42px_-18px_rgba(37,211,102,1)] focus-visible:ring-[#25D366]/70`}
      >
        <WhatsAppIcon className="h-7 w-7" />
        <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-ink-900/95 px-3 py-1.5 text-[13px] font-medium text-white opacity-0 shadow-card ring-1 ring-white/10 transition-opacity duration-200 group-hover:opacity-100">
          WhatsApp
        </span>
      </a>
    </div>
  );
}
