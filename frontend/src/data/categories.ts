export type Category = {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon name — see lib/categoryIcons.ts
  /**
   * Position in the catalogue sequence. Set by the backend seed (1-based); the
   * API already returns categories sorted by it, so the UI just keeps array
   * order. Absent on locally-seeded data, where the array order *is* the order.
   */
  sortOrder?: number;
  /**
   * Show this whole family in the home page "Our Catalogue" grid — every
   * visible product in it becomes a candidate, without tagging each one.
   * Individually `featured` products are layered on top of this.
   */
  showOnHome?: boolean;
};

// The client-approved catalogue: twelve solution families, in this exact
// sequence. `npm run sync:catalogue` (backend) replays this order onto a live
// database, so treat the array order as content, not incidental.
export const categories: Category[] = [
  {
    id: "assembly-tightening",
    name: "Assembly & Tightening",
    description:
      "Electric, cordless and pneumatic nutrunners with controllers, software and full torque-angle traceability.",
    icon: "Wrench",
  },
  {
    id: "riveting-systems",
    name: "Riveting System",
    description:
      "Blind rivet and rivet-nut setting tools — battery, pneumatic and hydro-pneumatic — for structural joining.",
    icon: "Hammer",
  },
  {
    id: "dispensing-gluing",
    name: "Dispensing & Gluing System",
    description:
      "Metered dispensing of adhesives, sealants and greases with repeatable bead control and shot monitoring.",
    icon: "Droplets",
  },
  {
    id: "material-removal",
    name: "Material Removal Tools",
    description:
      "Grinders, sanders, drills and high-performance abrasives for cutting, deburring, weld prep and finishing.",
    icon: "Disc3",
  },
  {
    id: "air-line-accessories",
    name: "Air Line Accessories",
    description:
      "Quick couplings, hoses, reels, FRL units and safety air guns that keep every pneumatic tool at rated power.",
    icon: "Wind",
  },
  {
    id: "air-motors",
    name: "Air Motors",
    description:
      "Compact, stall-proof pneumatic motors for continuous duty in hazardous, wet and high-temperature areas.",
    icon: "Fan",
  },
  {
    id: "process-software",
    name: "Process Improvement Software Solutions",
    description:
      "Torque software, station guidance and production-data platforms that turn tightening results into insight.",
    icon: "MonitorCog",
  },
  {
    id: "sockets-fixtures-spm",
    name: "Sockets, Fixtures & SPM Solutions",
    description:
      "Custom sockets, multi-spindle heads, reaction fixtures and special purpose machines built to your joint.",
    icon: "Cog",
  },
  {
    id: "aluminium-crane-system",
    name: "Aluminum Crane System",
    description:
      "Modular aluminium rail, jib and gantry systems for low-effort, ergonomic lifting at the workstation.",
    icon: "MoveVertical",
  },
  {
    id: "compressed-air-piping",
    name: "Compressed Air Piping System",
    description:
      "Corrosion-free aluminium piping for compressed air, vacuum and inert gases — leak-free and reconfigurable.",
    icon: "Pipette",
  },
  {
    id: "hand-tools-storage",
    name: "Hand Tools & Storage System",
    description:
      "Premium and insulated hand tools, torque wrenches, tool trolleys, workbenches and shadow-board storage.",
    icon: "Hammer",
  },
  {
    id: "agv-amr",
    name: "AGV / AMR Solutions",
    description:
      "Automated guided vehicles and autonomous mobile robots for tugging, line-side feed and intralogistics.",
    icon: "Bot",
  },
];

export const getCategory = (id: string) => categories.find((c) => c.id === id);
