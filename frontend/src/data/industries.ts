export type Industry = {
  id: string;
  name: string;
  short: string;
  tagline: string;
  description: string;
  image: string;
  icon: string; // lucide icon name
  accent: string;
  capabilities: string[];
  stat: { value: string; label: string };
  /** Public visibility. Undefined is treated as visible (enabled). */
  visible?: boolean;
  /** Creation timestamp (ms). Used to order "latest" first; older seed rows may omit it. */
  createdAt?: number;
};

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;

export const industries: Industry[] = [
  {
    id: "automotive",
    name: "Automotive",
    short: "Precision at line speed",
    tagline: "Zero-defect assembly for the mobility era",
    description:
      "From body-in-white to final assembly, we deploy smart tightening, riveting and error-proofing systems that keep automotive lines moving at takt time with full traceability.",
    image: img("1565043666747-69f6646db940"),
    icon: "Car",
    accent: "#ed1c24",
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
    image: img("1436491865332-7a61a109cc05"),
    icon: "Plane",
    accent: "#22b8ff",
    capabilities: [
      "Calibrated precision torque tools",
      "Composite & alloy finishing",
      "Documented process control",
      "Lightweight lifting systems",
    ],
    stat: { value: "100%", label: "torque traceability" },
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
    accent: "#5ed6ff",
    capabilities: [
      "Push-fit fluid & cooling fittings",
      "Precision rack assembly tooling",
      "ESD-safe hand tools",
      "Rapid material handling",
    ],
    stat: { value: "24/7", label: "deployment uptime" },
  },
  {
    id: "general-industries",
    name: "General Industries",
    short: "One partner, every process",
    tagline: "Tooling the world's workshops",
    description:
      "Fabrication, machinery, white goods and beyond — our complete catalogue of assembly, cutting and material-handling solutions powers general manufacturing across the board.",
    image: img("1565514020179-026b92b84bb6"),
    icon: "Factory",
    accent: "#ff5d5d",
    capabilities: [
      "Full assembly tool range",
      "Cutting, grinding & abrasives",
      "Modular crane systems",
      "Workshop tooling & storage",
    ],
    stat: { value: "1200+", label: "installations" },
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
    accent: "#22b8ff",
    capabilities: [
      "Micro-torque smart tools",
      "Battery module assembly",
      "ESD-safe environments",
      "Connector & fitting solutions",
    ],
    stat: { value: "±2%", label: "torque accuracy" },
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
    accent: "#ed1c24",
    capabilities: [
      "High-torque bolting systems",
      "Heavy lifting & cranes",
      "Field-service tool kits",
      "Maintenance abrasives",
    ],
    stat: { value: "99.2%", label: "field reliability" },
  },
];

export const getIndustry = (id: string) =>
  industries.find((i) => i.id === id);
