export type Category = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

export const categories: Category[] = [
  {
    id: "assembly-tools",
    name: "Assembly & Tightening",
    description: "Smart cordless and electric tightening systems with traceability.",
    icon: "Wrench",
  },
  {
    id: "riveting-systems",
    name: "Riveting Systems",
    description: "Blind rivet & rivet-nut setting tools for structural joining.",
    icon: "Hammer",
  },
  {
    id: "crane-systems",
    name: "Crane Systems",
    description: "Modular aluminium cranes and ergonomic lifting solutions.",
    icon: "MoveVertical",
  },
  {
    id: "hand-tools",
    name: "Hand Tools & Storage",
    description: "Premium hand tools, torque wrenches and workshop trolleys.",
    icon: "Wrench",
  },
  {
    id: "abrasives-cutting",
    name: "Abrasives & Cutting",
    description: "Cutting discs, grinding wheels and surface finishing.",
    icon: "Disc3",
  },
  {
    id: "fluid-fittings",
    name: "Fluid & Pneumatic Fittings",
    description: "Push-fit connectors for leak-free fluid and air transfer.",
    icon: "Pipette",
  },
];
