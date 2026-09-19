import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Download, Maximize2, BadgeCheck } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { asset } from "@/lib/asset";

/**
 * The manufacturer authorisation certificates, scanned from the client's own
 * signed PDFs and rendered to images at 2x for the lightbox.
 *
 * HONESTY: these are AUTHORISATION / DISTRIBUTOR letters — they say Neo is an
 * appointed partner for these two manufacturers. They are NOT ISO registration
 * and not a quality-system accreditation, and Neo holds neither. Every line
 * below is transcribed from the document it describes; do not generalise it to
 * other brands, do not add a certificate count, and do not imply accreditation.
 */
type Certificate = {
  id: string;
  issuer: string;
  /** The document's own title. */
  title: string;
  /** What the document actually authorises, in its own terms. */
  scope: string;
  /** Printed validity, so a visitor can see the appointment is current. */
  validity: string;
  signatory: string;
  image: string;
  thumb: string;
  pdf: string;
  alt: string;
};

const certificates: Certificate[] = [
  {
    id: "atlas-copco",
    issuer: "Atlas Copco",
    title: "Authorised Channel Partner",
    scope:
      "Appointed Channel Partner for the complete range of industrial assembly solutions in Atlas Copco Tools and Assembly Systems.",
    validity: "1 April 2026 – 31 March 2028",
    signatory: "Chandrashekhar Pathak, General Manager – Industrial Technique",
    image: asset("images/certificates/atlas-copco-channel-partner.jpg"),
    thumb: asset("images/certificates/atlas-copco-channel-partner-thumb.jpg"),
    pdf: asset("docs/atlas-copco-channel-partner.pdf"),
    alt: "Atlas Copco certificate naming Neo Automation, Ahmedabad as Authorised Channel Partner for Atlas Copco Tools and Assembly Systems, valid 1 April 2026 to 31 March 2028",
  },
  {
    id: "gesipa",
    // Issued BY SFS Group India Pvt Ltd, who own GESIPA — attribute it to them,
    // not to GESIPA directly, because that is who signed it.
    issuer: "GESIPA · SFS Group India",
    title: "Distributor Certificate",
    scope:
      "Authorised Distributor for GESIPA products in the Gujarat region, responsible for sales and service of GESIPA tools.",
    validity: "Valid till 31 December 2027",
    signatory: "S. Muthuraman, Authorised Signatory, SFS Group India Pvt Ltd",
    image: asset("images/certificates/gesipa-distributor.jpg"),
    thumb: asset("images/certificates/gesipa-distributor-thumb.jpg"),
    pdf: asset("docs/gesipa-distributor.pdf"),
    alt: "GESIPA distributor certificate issued by SFS Group India Pvt Ltd naming Neo Automation as authorised distributor for GESIPA products in the Gujarat region, valid till 31 December 2027",
  },
];

export function CertificatesSection() {
  const [active, setActive] = useState<number | null>(null);
  const close = useCallback(() => setActive(null), []);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Escape closes; body scroll is locked while open. Mirrors the CSR/NSW
  // galleries so the interaction is identical everywhere on the site.
  //
  // Focus is managed here too, which the plain image galleries do not need: this
  // overlay declares aria-modal="true", which tells assistive tech to ignore
  // everything outside it. Leaving focus on the card behind the scrim would
  // strand a keyboard or screen-reader user on a node their AT has just been
  // told to hide. So: move focus in on open, trap Tab inside, restore it to the
  // card on close.
  useEffect(() => {
    if (active === null) return;

    const opener = document.activeElement as HTMLElement | null;

    const focusable = () =>
      Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) ?? []
      ).filter((el) => el.offsetParent !== null);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;
      // Wrap at both ends, and pull focus back in if it has escaped the dialog.
      if (e.shiftKey) {
        if (current === first || !dialogRef.current?.contains(current)) {
          e.preventDefault();
          last.focus();
        }
      } else if (current === last || !dialogRef.current?.contains(current)) {
        e.preventDefault();
        first.focus();
      }
    };

    // rAF: the dialog mounts with this effect, so wait a frame for the node.
    const raf = requestAnimationFrame(() => closeRef.current?.focus());

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      // Send the user back to the card they opened, not to document.body.
      if (opener?.isConnected) opener.focus();
    };
  }, [active, close]);

  const open = active === null ? null : certificates[active];

  return (
    <section id="certificates" className="container-px py-16">
      <SectionHeading
        align="center"
        eyebrow="See The Paperwork"
        title="Our manufacturer certificates"
        subtitle="The appointments behind the claim. Both documents are reproduced in full below — open one to read it, or download the signed PDF."
      />

      {/* Two equal-height cards, capped at max-w-4xl and centred. Full-bleed
          across a 1400px container made each certificate ~660px wide — the
          thumbnails read as billboards and swamped the rest of the page. At
          this width they are a reference, and the section sits in proportion
          with the ones around it.
          The scans differ in shape (one portrait, one landscape), so each thumb
          sits in a fixed 16:10 frame with object-cover and object-top — the
          letterhead identifies the document at a glance, and a fixed frame
          keeps both images on one baseline. */}
      <div className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-2">
        {certificates.map((c, i) => (
          <Reveal key={c.id} delay={i * 0.08}>
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View the ${c.issuer} ${c.title} in full`}
              className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] text-left transition-all duration-300 hover:-translate-y-1 hover:border-neo-600/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-neo-500"
            >
              <span className="relative block aspect-[16/10] w-full overflow-hidden bg-pure">
                <img
                  src={c.thumb}
                  alt={c.alt}
                  loading="lazy"
                  className="h-full w-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/55 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                {/* Affordance: makes it obvious the card opens larger. */}
                <span className="pointer-events-none absolute bottom-3 right-3 grid h-9 w-9 translate-y-1 place-items-center rounded-xl border border-white/20 bg-ink-950/70 text-pure opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <Maximize2 className="h-4 w-4" />
                </span>
              </span>

              <span className="flex flex-1 flex-col p-5">
                <span className="flex items-center gap-2.5">
                  <BadgeCheck className="h-5 w-5 shrink-0 text-neo-400" />
                  <span className="font-display text-base font-semibold text-white">
                    {c.issuer}
                  </span>
                </span>
                <span className="mt-1 text-sm font-medium text-steel-200">
                  {c.title}
                </span>
                <span className="mt-2.5 text-[13.5px] leading-relaxed text-steel-300">
                  {c.scope}
                </span>
                {/* mt-auto pins the validity pill to the card's foot, so both
                    cards' pills align even when the scope copy differs in length. */}
                <span className="mt-auto pt-4">
                  <span className="inline-flex items-center rounded-full border border-neo-600/30 bg-neo-600/10 px-3 py-1 text-xs font-semibold tracking-wide text-neo-400">
                    {c.validity}
                  </span>
                </span>
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      {/* Lightbox — object-contain and a generous max-height, because a
          certificate is a document someone may actually need to read. */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            ref={dialogRef}
            className="fixed inset-0 z-[80] grid place-items-center p-4 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={`${open.issuer} — ${open.title}`}
          >
            <div
              className="absolute inset-0 bg-ink-950/90 backdrop-blur-md"
              onClick={close}
            />

            <button
              ref={closeRef}
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-xl border border-white/15 bg-ink-900/60 text-steel-200 transition hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <motion.figure
              key={open.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="relative z-[5] flex max-h-[88vh] max-w-4xl flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* The image FLEXES rather than carrying its own viewport-unit
                  cap. A fixed `max-h-[72vh]` on the image was sized
                  independently of the figure's own 88vh cap, so on a short
                  phone (320x568) the portrait scan plus the caption overflowed
                  the figure and pushed the Download button off-screen — with
                  no scroll anywhere to reach it, since the body is locked.
                  `min-h-0 flex-1` lets the image take whatever height the
                  caption leaves inside the 88vh box, which is correct for both
                  orientations, so the portrait/landscape split is unnecessary.
                  `min-h-0` is required: flex items default to min-height:auto
                  and would refuse to shrink below the intrinsic image height. */}
              <img
                src={open.image}
                alt={open.alt}
                className="min-h-0 w-auto max-w-full flex-1 rounded-2xl border border-white/10 bg-pure object-contain shadow-card"
              />
              <figcaption className="mt-4 max-w-2xl shrink-0 text-center">
                <span className="block text-sm font-semibold text-white">
                  {open.issuer} — {open.title}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-steel-400">
                  {open.validity} · Signed by {open.signatory}
                </span>
                <a
                  href={open.pdf}
                  download
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Download the ${open.issuer} ${open.title} as a PDF`}
                  className="btn-ghost mt-4 inline-flex"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </a>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
