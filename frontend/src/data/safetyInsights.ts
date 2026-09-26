import { asset } from "@/lib/asset";

/**
 * Safety insights — the nine Atlas Copco Expert Hub pieces the client picked
 * from https://www.atlascopco.com/en-uk/itba/expert-hub/safety.
 *
 * This is the manufacturer's own knowledge, credited in text: Neo distributes
 * and services Atlas Copco tools. At the client's request nothing links out —
 * every card opens Neo's own detail page (/safety/insights/:id), whose long
 * form lives in src/data/insightArticles/. `sourceUrl` records where each piece
 * came from and is NOT rendered. Card art is the article's own image,
 * self-hosted under public/images/safety/ and checked by eye.
 */

export const EXPERT_HUB_SAFETY_URL =
  "https://www.atlascopco.com/en-uk/itba/expert-hub/safety";

export type InsightTopic = "vibration" | "bolting" | "smart-assembly";

/** Filter chips, in display order. */
export const insightTopics: { id: InsightTopic | "all"; label: string }[] = [
  { id: "all", label: "All insights" },
  { id: "vibration", label: "Vibration & ergonomics" },
  { id: "bolting", label: "Bolting" },
  { id: "smart-assembly", label: "Smart assembly & data" },
];

export type SafetyInsight = {
  id: string;
  title: string;
  kind: "Overview" | "Case study" | "Article" | "White paper" | "Pocket guide" | "Product training";
  topic: InsightTopic;
  /** Publication date as shown on atlascopco.com (ISO). */
  date: string;
  /** Reading time as Atlas Copco lists it, or a label for a download. */
  readLabel: string;
  summary: string;
  /** Three short facts from the piece — the card's takeaways. */
  takeaways: string[];
  image: string;
  /**
   * "cover" photographs fill the frame. "contain" artwork (a product shot on
   * white, a brochure cover) sits whole on a `plate` instead of being cropped.
   */
  fit: "cover" | "contain";
  plate?: "white" | "navy";
  alt: string;
  /** Where the piece came from on atlascopco.com — for our records only; never render it as a link. */
  sourceUrl: string;
};

const img = (slug: string) => asset(`images/safety/insights/${slug}.jpg`);
const hub = (path: string) =>
  `https://www.atlascopco.com/en-uk/itba/expert-hub/${path}`;

// Order is the client's list, which is also the Expert Hub's newest-first order.
export const safetyInsights: SafetyInsight[] = [
  {
    id: "heat-pump-precision",
    title: "Driving precision under pressure in heat pump manufacturing",
    kind: "Case study",
    topic: "smart-assembly",
    date: "2026-06-22",
    readLabel: "2 min read",
    summary:
      "A leading German heat pump maker was fighting tight cycle times and a hard-to-reach joint that kept dropping screws inside the product. A fully automated cell with a vacuum tightening module and error-proofed smart tools got every joint right first time.",
    takeaways: [
      "Dropped screws eliminated",
      "Error-proofed, first-time-right joints",
      "Less rework, steadier cycle times",
    ],
    image: img("heat-pump-precision"),
    fit: "cover",
    alt: "A gloved technician checking pressure gauges on an outdoor heat pump unit",
    sourceUrl: hub("articles/driving-precision-under-pressure-in-heat-pump-manufacturing"),
  },
  {
    id: "wind-smart-bolting",
    title: "Powering Wind with Smart Bolting",
    kind: "Article",
    topic: "bolting",
    date: "2026-03-03",
    readLabel: "3 min read",
    summary:
      "Bigger turbines and offshore growth make every bolted joint critical. Smart bolting guides the technician step by step, monitors each joint in real time and flags deviations as they happen — fewer errors, fewer repeat site visits and more ergonomic work at height.",
    takeaways: [
      "Step-by-step guided bolting",
      "Real-time deviation alerts",
      "Digital traceability in the field",
    ],
    image: img("wind-smart-bolting"),
    fit: "cover",
    alt: "Two technicians in red safety suits walking along a wind turbine high above farmland",
    sourceUrl: hub("articles/powering-wind-with-smart-bolting"),
  },
  {
    id: "defence-smart-assembly",
    title: "Smart Assembly Technology for Modern Defence Manufacturing",
    kind: "White paper",
    topic: "smart-assembly",
    date: "2026-02-16",
    readLabel: "1 min read",
    summary:
      "Defence electronics — UAVs, sensors, missiles and avionics — must be assembled with zero defects, full traceability and precise torque, often inside cramped cockpits and avionics bays where ergonomic tooling is what makes that precision possible.",
    takeaways: [
      "Precision on tight tolerances",
      "Every assembly step traceable",
      "Ergonomic tools for confined spaces",
    ],
    image: img("defence-smart-assembly"),
    fit: "cover",
    alt: "Aerial view of an aircraft carrier deck lined with parked jets",
    sourceUrl: hub(
      "articles/the-challenge-for-electronics-manufacturing-transforming-to-the-factory-of-the-future/smart-assembly-technology-for-modern-defence-manufacturing"
    ),
  },
  {
    id: "vibration-standard",
    title: "New Vibration Standard: Shielding Against Repeated Shocks",
    kind: "Article",
    topic: "vibration",
    date: "2025-04-10",
    readLabel: "6 min read",
    summary:
      "ISO 5349-3 and ISO 28927 add a Vibration Peak Magnitude (VPM) value that captures the repeated shocks of percussive tools — something the traditional hand-arm figure misses. It applies from January 2027 and is mandatory for the CE marking of handheld power tools.",
    takeaways: [
      "New VPM value from January 2027",
      "Mandatory for CE marking",
      "2.5 m/s² A(8) action value still applies",
    ],
    image: img("vibration-standard"),
    fit: "cover",
    alt: "A pneumatic chipping hammer with a flat chisel resting on leather work gloves",
    sourceUrl: hub("articles/new-vibration-standard-shielding-against-repeated-shocks"),
  },
  {
    id: "hand-arm-vibration",
    title: "Hand-Arm Vibration Syndrome: learn about 3 related injuries",
    kind: "Article",
    topic: "vibration",
    date: "2024-06-26",
    readLabel: "3 min read",
    summary:
      "Years on vibrating tools such as impact wrenches and grinders can do lasting harm: vascular injury, nerve damage and musculoskeletal strain. Controlling exposure time and choosing vibration-damped tools are the two defences that matter most.",
    takeaways: [
      "Vascular: Raynaud's phenomenon",
      "Nerves: numbness & lost dexterity",
      "Musculoskeletal: strain & fractures",
    ],
    // The listing's own art is a flat blue figure on white, which read as an
    // empty white tile in the dark theme. This is the hand photograph the same
    // Expert Hub page uses for its vibration articles.
    image: img("hand-arm-vibration"),
    fit: "cover",
    alt: "A black-and-white close-up of an open, outstretched hand",
    sourceUrl: hub("articles/hand-arm-vibration-syndrome"),
  },
  {
    id: "vibration-pocket-guide",
    title: "Vibration exposure assessment for industrial power tools",
    kind: "Pocket guide",
    topic: "vibration",
    date: "2023-12-18",
    readLabel: "Guide summary",
    summary:
      "A pocket guide based on the EU Physical Agents (Vibration) Directive 2002/44/EC — how to assess and manage an operator's daily vibration exposure, A(8), across the handheld power tools they use.",
    takeaways: [
      "Based on Directive 2002/44/EC",
      "Daily exposure A(8), explained",
      "Point system for several tools",
    ],
    image: img("vibration-pocket-guide"),
    fit: "contain",
    plate: "navy",
    alt: "Cover of the Atlas Copco pocket guide 'Vibration exposure assessment for industrial power tools'",
    sourceUrl: hub("pocket-guide/vibration-exposure"),
  },
  {
    id: "powerful-ergonomics",
    title: "Powerful Ergonomics",
    kind: "Article",
    topic: "vibration",
    date: "2023-12-18",
    readLabel: "3 min read",
    summary:
      "More power is an ergonomic feature: twice the power means half the time on the tool — and half the exposure to vibration, noise and weight. Today's turbine grinders match 1970s vertical grinders for power at under half the weight.",
    takeaways: [
      "Twice the power, half the exposure",
      "Turbine grinders: under half the weight",
      "Damped percussive tools up to 50% lighter",
    ],
    image: img("powerful-ergonomics"),
    fit: "contain",
    plate: "white",
    alt: "An Atlas Copco pneumatic chipping hammer with a yellow D-handle",
    sourceUrl: hub("articles/powerful-ergonomics"),
  },
  {
    id: "bolt-tensioning-safety",
    title: "Safety when Bolt Tensioning",
    kind: "Product training",
    topic: "bolting",
    date: "2021-08-17",
    readLabel: "2 min video",
    summary:
      "Bolt tensioning is one of the most accurate ways to tighten a bolt — but only with the right procedure. This training walks through the checks that matter: bolt protrusion, couplers and hoses, pressurisation, stroke limits and de-tensioning.",
    takeaways: [
      "Protrusion of at least 1× bolt diameter",
      "Never stand in line of pressurisation",
      "Never exceed the max-stroke indicator",
    ],
    image: img("bolt-tensioning-safety"),
    fit: "cover",
    alt: "Four Atlas Copco hydraulic bolt tensioners connected by high-pressure hoses and couplers",
    sourceUrl: hub("product-training/safety-when-bolt-tensioning"),
  },
  {
    id: "mechatronic-system",
    title: "Experience a new level of data integration with the Atlas Copco Mechatronic System",
    kind: "Article",
    topic: "smart-assembly",
    date: "2021-07-22",
    readLabel: "1 min read",
    summary:
      "Safety-critical joints in tight spaces still need proof. Lightweight, ergonomic mechatronic wrenches with high-reliability error-proofing catch missing tightenings, and standardised data integration makes every step of the process traceable.",
    takeaways: [
      "Ergonomic wrenches for narrow spaces",
      "Error-proofing catches missed joints",
      "Standardised, traceable data",
    ],
    image: img("mechatronic-system"),
    fit: "cover",
    alt: "Atlas Copco mechatronic wrenches and a tightening controller against a black background",
    sourceUrl: hub("articles/reduce-operational-failures-increase-traceability-in-tightening"),
  },
];

/**
 * The Expert Hub's own safety overview ("Safety first. A sound business
 * priority with simply no bad vibes.") — the page behind the /safety image
 * band. It has a detail page but is not one of the nine grid cards.
 */
export const safetyFirstOverview: SafetyInsight = {
  id: "safety-first",
  title: "Safety first. A sound business priority with simply no bad vibes.",
  kind: "Overview",
  topic: "vibration",
  date: "2026-06-22",
  readLabel: "4 min read",
  summary:
    "Noise and vibration put operators under strain every shift. Why ergonomics designed into the tool is the answer — and the thinking Atlas Copco has applied since 1958.",
  takeaways: [
    "Vibration harms nerves, vessels and joints",
    "Noise brings stress, fatigue and hearing loss",
    "Ergonomics designed in since 1958",
  ],
  image: asset("images/safety/no-bad-vibes.jpg"),
  fit: "cover",
  alt: "A smiling worker in orange hi-vis and a blue hard hat standing inside a large steel pipe",
  sourceUrl: EXPERT_HUB_SAFETY_URL,
};

/** Every insight that has a detail page: the overview plus the nine cards. */
export const allInsightPages: SafetyInsight[] = [safetyFirstOverview, ...safetyInsights];

export const getInsight = (id: string | undefined) =>
  allInsightPages.find((i) => i.id === id);

/** Route of an insight's detail page. */
export const insightPath = (id: string) => `/safety/insights/${id}`;

/**
 * The three injury families behind Hand-Arm Vibration Syndrome, from the HAVS
 * article above.
 */
export const havsInjuries = [
  {
    title: "Vascular injury",
    name: "Raynaud's phenomenon",
    text: "Finger arteries thicken and narrow, so blood cannot reach the fingertips. They turn white, most noticeably in the cold.",
  },
  {
    title: "Nerve damage",
    name: "Numbness",
    text: "Vibration harms nerve cells and numbs the fingers. Reversible early on, permanent with long exposure: buttoning a shirt or picking up a coin gets hard.",
  },
  {
    title: "Musculoskeletal disorders",
    name: "Strain & fractures",
    text: "High-force percussive tools carry shock through the hand and arm, causing wear and tear and even joint fractures.",
  },
];

/**
 * Old metric vs new, per tool type, from the "New Vibration Standard" article.
 * `hav` = hand-arm vibration exposure value, `vpm` = Vibration Peak Magnitude,
 * both in m/s². Two different scales, so they are drawn as two panels.
 */
export const vibrationComparison = [
  { tool: "Pneumatic grinder", hav: 3.5, vpm: 90 },
  { tool: "Impulse nutrunner", hav: 3.3, vpm: 220 },
  { tool: "Vibration-damped chipping hammer", hav: 5.0, vpm: 260 },
  { tool: "Impact nutrunner", hav: 5.0, vpm: 650 },
  { tool: "Conventional chipping hammer", hav: 6.1, vpm: 1700 },
];
