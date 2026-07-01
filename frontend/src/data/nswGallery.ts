import { asset } from "@/lib/asset";

export type NSWPhoto = {
  /** Optimised full-size image (max ~1600px long edge). */
  full: string;
  /** Smaller image used in the grid. */
  thumb: string;
  /** Accessible caption / alt text. */
  caption: string;
  /** true for portrait (4:6) shots so the grid can lay them out taller. */
  portrait?: boolean;
};

/**
 * Photos from the Nuclear Service Workshop (NSW) inauguration —
 * Atlas Copco Industrial Technique × Neo Automation.
 * Files live in `public/images/nsw/` (see also the optimise step in the repo notes).
 */
const img = (slug: string) => ({
  full: asset(`images/nsw/${slug}.jpg`),
  thumb: asset(`images/nsw/${slug}-thumb.jpg`),
});

export const nswGallery: NSWPhoto[] = [
  { ...img("workshop-tool-bench"), caption: "Atlas Copco tool bench with Power Focus controllers" },
  { ...img("team-group"), caption: "The Neo Automation & Atlas Copco team at the NSW inauguration" },
  { ...img("welcome-banner"), caption: "Welcome to our Nuclear Service Workshop" },
  { ...img("workshop-storage"), caption: "Organised parts & spares storage inside the workshop" },
  { ...img("ribbon-cutting"), caption: "Ribbon-cutting ceremony at the workshop entrance" },
  { ...img("workshop-alture"), caption: "ALTURE data-driven service station" },
  { ...img("tool-handover"), caption: "Service tool handover at the workbench" },
  { ...img("team-leadership"), caption: "Leadership & team gathered for the opening" },
  { ...img("store-walkthrough"), caption: "Walkthrough of the genuine-spares store" },
  { ...img("team-celebrate"), caption: "The full team celebrating the new workshop" },
  { ...img("entrance-storefront"), caption: "Neo Automation storefront", portrait: true },
  { ...img("entrance-arch"), caption: "Nuclear Service Workshop entrance", portrait: true },
];

/** Wide 21:9 hero crop of the workshop tool bench. */
export const nswHero = asset("images/nsw/hero-wide.jpg");
