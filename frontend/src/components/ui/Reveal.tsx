import { motion, useReducedMotion, type Variants } from "framer-motion";
import { type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
  /** premium cinematic entrance: soft blur + slight scale up. On by default. */
  blur?: boolean;
};

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  once = true,
  blur = true,
}: RevealProps) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once, margin: "-80px" }}
        transition={{ duration: 0.5, delay }}
      >
        {children}
      </motion.div>
    );
  }
  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        y,
        ...(blur ? { filter: "blur(10px)", scale: 0.985 } : {}),
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        ...(blur ? { filter: "blur(0px)", scale: 1 } : {}),
      }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export function StaggerGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}

// Word-by-word headline reveal.
// `highlightWords` renders the last N words with the animated aurora wash
// (`text-shimmer-anim`) — the same signature accent as the home hero, so any
// heading can carry it by passing e.g. highlightWords={1}.
export function WordsReveal({
  text,
  className,
  delay = 0,
  highlightWords = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
  highlightWords?: number;
}) {
  const words = text.split(" ");
  const firstAccent = words.length - highlightWords;
  return (
    <span className={className}>
      {words.map((w, i) => {
        const accent = highlightWords > 0 && i >= firstAccent;
        return (
          // No `overflow-hidden` clip on the wrapper and the word stays fully
          // opaque — only `y` animates. So even if the scroll-into-view trigger
          // is missed (section already on screen at load, browser jumps scroll
          // past the trigger margin, etc.) the word still renders visibly (at
          // most slightly low) instead of being clipped out of sight — the title
          // can never collapse to a blank gap.
          <span key={i} className="inline-block align-bottom">
            <motion.span
              className={accent ? "inline-block text-shimmer-anim" : "inline-block"}
              initial={{ y: "30%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, amount: "some" }}
              transition={{
                duration: 0.7,
                delay: delay + i * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {w}&nbsp;
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}
