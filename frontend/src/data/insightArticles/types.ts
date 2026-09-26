/**
 * Long-form content for the safety insight detail pages (/safety/insights/:id).
 *
 * The articles are Atlas Copco Expert Hub material republished on Neo's own
 * site at the client's request (no outbound links). Every fact must come from
 * the Atlas Copco source. Atlas Copco's first person ("we") is rewritten as
 * "Atlas Copco", so nothing reads as work Neo did itself.
 *
 * Image `src` values are bare public paths ("images/…"); the renderer applies
 * asset() for the /neo-website/ deploy base.
 */
export type InsightBlock =
  | { type: "lead"; text: string }
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | {
      type: "list";
      style: "check" | "number" | "bullet";
      items: { title?: string; text: string }[];
    }
  | {
      type: "callout";
      tone: "info" | "warning" | "success";
      title?: string;
      text: string;
    }
  | { type: "stats"; items: { value: string; label: string }[] }
  | {
      type: "image";
      src: string;
      alt: string;
      caption?: string;
      /** "contain" for artwork on white (brochure covers, product shots). */
      fit?: "cover" | "contain";
    }
  | { type: "faq"; items: { q: string; a: string }[] }
  | { type: "table"; caption?: string; head: string[]; rows: string[][] }
  /** The HAV-vs-VPM two-panel chart (data: vibrationComparison). */
  | { type: "vpm-chart" }
  | { type: "steps"; items: { title: string; points: string[] }[] }
  | { type: "quote"; text: string; cite?: string };

export type InsightArticle = {
  /** Matches SafetyInsight.id in src/data/safetyInsights.ts. */
  id: string;
  /** One or two sentences under the title (the page's standfirst). */
  intro: string;
  body: InsightBlock[];
  /** 3–5 short facts for the sidebar. */
  keyTakeaways: string[];
  /** Internal Neo links only (catalogue families, service, safety anchors). */
  neoLinks: { label: string; href: string; desc: string }[];
};
