export type Industry = {
  id: string;
  name: string;
  short: string;
  tagline: string;
  description: string;
  image: string;
  icon: string; // lucide icon name — see lib/industryIcons.ts
  accent: string;
  capabilities: string[];
  stat: { value: string; label: string };
  /** Public visibility. Undefined is treated as visible (enabled). */
  visible?: boolean;
  /** Creation timestamp (ms). Used to order "latest" first; older seed rows may omit it. */
  createdAt?: number;
};

// Seed imagery is served from the Unsplash CDN at 2x the largest tile so it
// stays sharp on HiDPI screens; `imgSrcSet()` steps it back down per viewport.
const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=85`;

// NOTE: seed rows deliberately carry no `createdAt`. The public list sorts by it
// descending, and JS sort is stable — so with all seeds equal, this array's
// order *is* the on-site order. Admin-added industries get a real timestamp and
// surface above these.
export const industries: Industry[] = [
  {
    id: "automotive",
    name: "Automotive",
    short: "Precision at line speed",
    tagline: "Zero-defect assembly for the mobility era",
    description:
      "From body-in-white to final assembly, we deploy smart tightening, riveting and error-proofing systems that keep automotive lines moving at takt time with full traceability.",
    image: img("1589320012458-ce28bd1c86b1"),
    icon: "Car",
    accent: "#7c86f0",
    capabilities: [
      "Smart tightening & torque traceability",
      "Structural blind riveting (BIW)",
      "Ergonomic crane-assisted handling",
      "Line-side surface finishing",
    ],
    stat: { value: "40%", label: "faster takt cycles" },
  },
  {
    id: "aerospace",
    name: "Aerospace",
    short: "Aviation-grade joining",
    tagline: "Where every fastener is mission-critical",
    description:
      "Aerospace assembly demands certified torque, documented processes and flawless surface integrity. Our calibrated tooling and abrasives meet the most exacting AS9100 environments.",
    image: img("1712179355181-cd9add37f76a"),
    icon: "Plane",
    accent: "#4fb6f0",
    capabilities: [
      "Calibrated precision torque tools",
      "Composite & alloy finishing",
      "Documented process control",
      "Lightweight lifting systems",
    ],
    stat: { value: "100%", label: "torque traceability" },
  },
  {
    id: "electronics-ev",
    name: "Electronics & EV",
    short: "Powering electrification",
    tagline: "Micro-precision for high-volume electronics",
    description:
      "Battery packs, power electronics and connected devices require delicate, traceable assembly. Our smart tools deliver micro-torque control and ESD-safe handling at scale.",
    image: img("1518770660439-4636190af475"),
    icon: "CircuitBoard",
    accent: "#4fb6f0",
    capabilities: [
      "Micro-torque smart tools",
      "Battery module assembly",
      "ESD-safe environments",
      "Connector & fitting solutions",
    ],
    stat: { value: "±2%", label: "torque accuracy" },
  },
  {
    id: "semiconductor",
    name: "Semiconductor",
    short: "Sub-micron discipline",
    tagline: "Cleanroom-grade tooling for wafer fabrication",
    description:
      "Fabs are won on contamination control and repeatability. We supply ESD-safe hand tools, particle-conscious fittings and calibrated micro-torque for equipment installation, sub-fab assembly and planned maintenance.",
    image: img("1576141546153-3e04370b5ff7"),
    icon: "Cpu",
    accent: "#4fd9b4",
    capabilities: [
      "ESD-safe precision hand tools",
      "Cleanroom-compatible fittings",
      "Calibrated micro-torque control",
      "Equipment install & PM kits",
    ],
    stat: { value: "±2%", label: "torque repeatability" },
  },
  {
    id: "energy-utilities",
    name: "Energy & Utilities",
    short: "Built to endure",
    tagline: "Heavy-duty tooling for critical infrastructure",
    description:
      "Power generation, transmission and renewables operate in the harshest conditions. Our rugged tooling and lifting systems are engineered for reliability where downtime is not an option.",
    image: img("1466611653911-95081537e5b7"),
    icon: "Zap",
    accent: "#7c86f0",
    capabilities: [
      "High-torque bolting systems",
      "Heavy lifting & cranes",
      "Field-service tool kits",
      "Maintenance abrasives",
    ],
    stat: { value: "99.2%", label: "field reliability" },
  },
  {
    id: "data-center",
    name: "Data Center",
    short: "Build the backbone of compute",
    tagline: "Infrastructure assembled to the micron",
    description:
      "Hyperscale build-outs need rapid, repeatable rack assembly and clean cable management. We supply pneumatic fittings, precision hand tools and ergonomic handling for 24/7 deployment.",
    image: img("1558494949-ef010cbdcc31"),
    icon: "Server",
    accent: "#4fd9b4",
    capabilities: [
      "Push-fit fluid & cooling fittings",
      "Precision rack assembly tooling",
      "ESD-safe hand tools",
      "Rapid material handling",
    ],
    stat: { value: "24/7", label: "deployment uptime" },
  },
  {
    id: "metal-fabrication",
    name: "Metal Fabrication",
    short: "Cut, grind, join, finish",
    tagline: "From raw plate to finished assembly",
    description:
      "Fabrication shops live on cutting speed and weld-prep quality. Our cutting discs, abrasives and finishing tools deliver consistent stock removal and clean, burr-free edges shift after shift.",
    image: img("1598302936625-6075fbd98dd7"),
    icon: "Flame",
    accent: "#a78bfa",
    capabilities: [
      "High-performance cutting discs",
      "Grinding & flap-disc finishing",
      "Weld-prep & deburring tools",
      "Workshop benches & storage",
    ],
    stat: { value: "1 mm", label: "burr-free cutting" },
  },
  {
    id: "heavy-equipment",
    name: "Heavy Equipment & Machinery",
    short: "Big iron, exact torque",
    tagline: "High-torque assembly for earthmoving giants",
    description:
      "Excavators, loaders and mining machines are built around large-diameter, high-torque joints. We supply the bolting systems, lifting gear and documented tightening these structures demand.",
    image: img("1580901369227-308f6f40bdeb"),
    icon: "Tractor",
    accent: "#4fd9b4",
    capabilities: [
      "High-torque bolting systems",
      "Heavy-duty lifting & cranes",
      "Structural riveting",
      "Field-service tool kits",
    ],
    stat: { value: "2000 kg", label: "assisted lifting" },
  },
  {
    id: "home-appliances",
    name: "Home Appliances",
    short: "White goods at volume",
    tagline: "High-volume assembly for the modern home",
    description:
      "Washing machines, refrigerators and white goods move fast down the line. Our cordless tightening, sheet-metal riveting and error-proofing keep cycle times low and rework lower.",
    image: img("1716193696093-9c54b6a290e5"),
    icon: "WashingMachine",
    accent: "#4fb6f0",
    capabilities: [
      "Cordless assembly tightening",
      "Sheet-metal blind riveting",
      "Error-proofing & poka-yoke",
      "Line-side material handling",
    ],
    stat: { value: "1200+", label: "units per shift" },
  },
  {
    id: "rail-rolling-stock",
    name: "Rail & Rolling Stock",
    short: "Built for the long haul",
    tagline: "Assembly that survives a million kilometres",
    description:
      "Rolling stock endures decades of vibration and load. We bring documented torque, structural riveting and modular lifting to bogie, body-shell and interior fit-out assembly.",
    image: img("1701221602494-699948f33250"),
    icon: "TrainFront",
    accent: "#7c86f0",
    capabilities: [
      "Documented structural torque",
      "Bogie & body-shell riveting",
      "Modular crane systems",
      "Interior fit-out tooling",
    ],
    stat: { value: "100%", label: "joint documentation" },
  },
  {
    id: "trailers",
    name: "Trailers",
    short: "Chassis to cargo body",
    tagline: "Tooling the backbone of road freight",
    description:
      "Trailer builders join long, high-strength structures at pace. Our riveting, bolting and abrasive solutions handle chassis, axles and panel work without slowing the line.",
    image: img("1720811559395-3ed8d1b16649"),
    icon: "Truck",
    accent: "#4fd9b4",
    capabilities: [
      "Structural blind riveting",
      "Chassis bolting & torque control",
      "Panel finishing & abrasives",
      "Ergonomic lifting support",
    ],
    stat: { value: "13.6 m", label: "chassis handling" },
  },
  {
    id: "general-industries",
    name: "General Industries",
    short: "One partner, every process",
    tagline: "Tooling the world's workshops",
    description:
      "Fabrication, machinery, white goods and beyond — our complete catalogue of assembly, cutting and material-handling solutions powers general manufacturing across the board.",
    image: img("1717386255773-1e3037c81788"),
    icon: "Factory",
    accent: "#a78bfa",
    capabilities: [
      "Full assembly tool range",
      "Cutting, grinding & abrasives",
      "Modular crane systems",
      "Workshop tooling & storage",
    ],
    stat: { value: "1200+", label: "installations" },
  },
];

export const getIndustry = (id: string) =>
  industries.find((i) => i.id === id);
