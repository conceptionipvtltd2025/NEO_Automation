import { cn } from "@/lib/utils";
import { asset } from "@/lib/asset";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        // The mandala is a rounded DIAMOND: its ink reaches 95% of the half-width
        // on the 12/3/6/9 axes but only 82% on the diagonals, and the inner ring
        // that actually reads as "the logo" spans just 56% of the square — so the
        // box must run larger than a circular mark to carry equal optical weight.
        //
        // Sizes are set from the MEASURED navbar budget, not by feel. At 320px
        // the bar leaves the lockup 116px (bar 280 − 24 padding − 132 actions −
        // 8 gap), which the mark + "NEO" already fills.
        // The ceiling is the BAR HEIGHT, not the spare width: the header is a
        // pill with py-2, so a mark much past 4rem stops being a logo inside a
        // bar and becomes a badge the bar is wrapped around — which is exactly
        // how the header broke before.
        "logo-mark h-[2.75rem] w-[2.75rem] shrink-0 xs:h-[3rem] xs:w-[3rem] sm:h-[3.5rem] sm:w-[3.5rem] lg:h-[3.75rem] lg:w-[3.75rem] xl:h-[4rem] xl:w-[4rem]",
        className
      )}
    >
      {/* The client's artwork, used exactly as supplied — only the surrounding
          whitespace is trimmed off the source JPEG. No recolouring, no disc
          fill, no per-theme variant: the mark renders identically everywhere.
          `.logo-mark` gives it a light plate so the near-black filigree stays
          legible on the dark chrome. */}
      <img
        src={asset("images/logo.png")}
        alt="NEO Automation"
        className="h-full w-full object-contain"
      />
    </span>
  );
}

export function Logo({
  className,
  showWord = true,
  compact = false,
}: {
  className?: string;
  showWord?: boolean;
  /**
   * Smaller lockup for narrow containers. The full-size one is tuned for the
   * marketing header and overflows a 16rem admin sidebar — the wide letter
   * spacing on "AUTOMATION" alone is ~123px before the mark and gap.
   */
  compact?: boolean;
}) {
  return (
    <span
      className={cn(
        "logo-lockup group flex min-w-0 items-center",
        compact ? "gap-2.5" : "gap-2 sm:gap-3.5 xl:gap-4",
        className
      )}
    >
      <LogoMark className={compact ? "h-12 w-12 xl:h-12 xl:w-12" : undefined} />
      {showWord && (
        // The mark is centred on the CAP-HEIGHT of "NEO", not on the whole
        // stack: the sub-lines hang below, so centring the block would ride the
        // mandala low. `-mt-px` on the stack pulls the cap-line back onto the
        // mandala's inner ring, whose red core sits a hair (1.3%) above the
        // image's own centre.
        <span className="-mt-px flex min-w-0 flex-col leading-none">
          <span
            className={cn(
              // `text-white` is token-driven (--fg), so it flips to ink in the
              // light theme; only the E carries the brand red.
              "font-display font-bold leading-none tracking-tight text-white",
              compact ? "text-[1.35rem]" : "text-[1.35rem] xs:text-[1.45rem] sm:text-[1.7rem] lg:text-[1.85rem] xl:text-[2rem]"
            )}
          >
            {/* The middle E is red, matching the mandala's own red wordmark and
                the lockup the client has always used. Restored at their request
                after a spell rendering all three letters in the foreground
                colour. Keep it — it is deliberate, not a stray style. */}
            N<span className="text-neo-500">E</span>O
          </span>
          <span
            className={cn(
              // steel-300, not steel-400: at this size the sub-line is a brand
              // element, not a caption, and 400 read as greyed-out next to the
              // solid white "NEO".
              "font-semibold uppercase text-steel-300 transition-colors duration-300 group-hover:text-white",
              compact
                ? "truncate mt-1 text-[11px] tracking-[0.24em]"
                // On a 320px phone the tracked-out wordmark cannot fit beside the
                // mark and the action buttons (the lockup's whole budget there is
                // 116px), and `truncate` rendered it as "AUTOM…" — a broken-looking
                // brand. Hide it below `xs` and show it in full from 380px up.
                // Tracking EASES OFF as the size grows: 0.3em on a 13px cap line
                // is elegant, but on a 15px one it pushes the word past the mark
                // and unbalances the lockup.
                : "hidden whitespace-nowrap xs:block mt-[3px] text-[9px] tracking-[0.22em] sm:mt-1 sm:text-[10.5px] sm:tracking-[0.3em] lg:text-[11px] lg:tracking-[0.28em] xl:text-[11.5px] xl:tracking-[0.26em]"
            )}
          >
            Automation
          </span>
        </span>
      )}
    </span>
  );
}
