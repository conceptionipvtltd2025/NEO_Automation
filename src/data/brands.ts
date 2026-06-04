export type Brand = {
  id: string;
  name: string;
  color: string; // brand accent for hover
  category: string;
  blurb: string;
};

export const brands: Brand[] = [
  {
    id: "atlas-copco",
    name: "Atlas Copco",
    color: "#0033A0",
    category: "Assembly & Tightening",
    blurb:
      "Industrial power tools, smart tightening systems and the Smart Workflow Feature (SWF) for error-proof assembly lines.",
  },
  {
    id: "gesipa",
    name: "GESIPA",
    color: "#0a4ea2",
    category: "Riveting Technology",
    blurb:
      "Blind rivets, blind rivet nuts and battery-powered setting tools engineered in Germany for high-volume joining.",
  },
  {
    id: "eepos",
    name: "eepos",
    color: "#1b9bd7",
    category: "Crane Systems",
    blurb:
      "Modular aluminium crane systems and ergonomic lifting solutions for flexible, lightweight material handling.",
  },
  {
    id: "gedore",
    name: "GEDORE",
    color: "#0b63b2",
    category: "Hand Tools",
    blurb:
      "Premium hand tools, torque wrenches and workshop trolleys trusted across global manufacturing floors.",
  },
  {
    id: "pferd",
    name: "PFERD",
    color: "#1f6fb2",
    category: "Abrasives & Cutting",
    blurb:
      "High-performance cutting discs, grinding wheels and surface finishing tools for metalworking precision.",
  },
  {
    id: "john-guest",
    name: "John Guest",
    color: "#0e7ec4",
    category: "Fluid Fittings",
    blurb:
      "Push-fit connectors and pneumatic fittings delivering leak-free fluid and air transfer at scale.",
  },
];
