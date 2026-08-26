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
//
// The eleven segments below (and their sequence) are the client-approved list —
// they mirror the Atlas Copco ITBA industry-solutions taxonomy. Do not reorder
// or add without a brief: `npm run sync:catalogue` in the backend replays this
// exact order onto a live database.
export const industries: Industry[] = [
  {
    id: "automotive",
    name: "Automotive Manufacturing",
    short: "Precision at line speed",
    tagline: "Every stage of vehicle build — from body shop to final assembly",
    description:
      "We support every stage of automotive production: tightening, dispensing, riveting and fastening. From body-in-white and paint shop through trim, chassis and final assembly, our transducer-controlled tools hold takt time while documenting every safety-critical joint.",
    image: img("1589320012458-ce28bd1c86b1"),
    icon: "Car",
    accent: "#7c86f0",
    capabilities: [
      "Smart tightening & torque traceability",
      "Structural blind riveting (BIW)",
      "Dispensing, gluing & sealing systems",
      "Error-proofing & line-side handling",
    ],
    stat: { value: "40%", label: "faster takt cycles" },
  },
  {
    // Split out of "Automotive Manufacturing & EV Assembly" at the client's
    // request — electrification is its own discipline (HV safety, cell-to-pack
    // joining, insulated tooling) and deserves its own segment.
    // NOTE(imagery): a verified in-repo photo of an e-mobility test/assembly
    // cell — harnesses, HV cabling and a vehicle panel on the bench. Swap in the
    // client's own battery-line photography from the admin panel when it lands;
    // never point this at an unverified stock id.
    id: "ev-assembly",
    name: "EV Assembly",
    short: "Battery, pack & e-drive",
    tagline: "Battery modules, packs and e-drives — joined, insulated, documented",
    description:
      "Electrification changes the joint before it changes the vehicle. Battery-module and pack lines demand low-and-high torque in the same station, VDE-insulated tooling for live high-voltage work, structural bonding and riveting on aluminium trays, and a documented result for every single fastener. We build EV stations around exactly that: measured tightening, error-proofing and full traceability from cell stacking to e-drive marriage.",
    image: img("1581091226825-a6a2a5aee158"),
    icon: "BatteryCharging",
    accent: "#7c86f0",
    capabilities: [
      "Battery module & pack tightening",
      "VDE-insulated HV tool sets",
      "Structural riveting & bonding on alloy trays",
      "100% torque traceability to the MES",
    ],
    stat: { value: "100%", label: "joints documented" },
  },
  {
    id: "industrial-assembly",
    name: "Industrial Assembly",
    short: "Robust, flexible, repeatable",
    tagline: "Assembly solutions that flex with your product mix",
    description:
      "Compressors, pumps and valves, industrial machinery, electric power and outdoor power equipment — high-mix assembly demands tools that change over fast without losing accuracy. We build stations around error-proofing, fixtured tightening and ergonomic handling so quality holds across every variant.",
    image: img("1717386255773-1e3037c81788"),
    icon: "Factory",
    accent: "#a78bfa",
    capabilities: [
      "Error-proofing & poka-yoke stations",
      "Fixtured & multi-spindle tightening",
      "Sockets, fixtures & SPM solutions",
      "Workshop tooling & storage systems",
    ],
    stat: { value: "1200+", label: "installations" },
  },
  {
    id: "aerospace",
    name: "Aerospace",
    short: "Aviation-grade joining",
    tagline: "Where every fastener is mission-critical",
    description:
      "Aerospace assembly demands certified torque, documented processes and flawless surface integrity. Calibrated tooling, controlled material removal and traceable tightening meet the exacting requirements of airframe, engine and interior fit-out work.",
    image: img("1712179355181-cd9add37f76a"),
    icon: "Plane",
    accent: "#4fb6f0",
    capabilities: [
      "Calibrated precision torque tools",
      "Composite & alloy surface finishing",
      "Documented process control",
      "Lightweight ergonomic lifting",
    ],
    stat: { value: "100%", label: "torque traceability" },
  },
  {
    id: "energy",
    name: "Energy",
    short: "Built to endure",
    tagline: "World-class bolting for oil & gas, power and wind",
    description:
      "Power generation, transmission and renewables operate where downtime is measured in lakhs per hour. Hydraulic bolt tensioning, high-torque wrenches and rugged field-service kits deliver controlled load on large-diameter joints — onshore, offshore and up-tower.",
    image: img("1466611653911-95081537e5b7"),
    icon: "Zap",
    accent: "#7c86f0",
    capabilities: [
      "Hydraulic bolt tensioning & torquing",
      "High-torque wrenches & reaction arms",
      "Field-service tool kits",
      "Maintenance abrasives & cutting",
    ],
    stat: { value: "99.2%", label: "field reliability" },
  },
  {
    id: "electronics",
    name: "Electronics",
    short: "Low torque, high volume",
    tagline: "Energy-efficient precision for low-torque operations",
    description:
      "Consumer electronics, connected devices and power electronics are assembled at micro-torque with zero tolerance for damaged threads or ESD events. Our screwdrivers, controllers and ESD-safe accessories deliver repeatable results at very low torque, cycle after cycle.",
    image: img("1518770660439-4636190af475"),
    icon: "CircuitBoard",
    accent: "#4fb6f0",
    capabilities: [
      "Micro-torque electric screwdrivers",
      "ESD-safe tools & workstations",
      "Screw-counting & error-proofing",
      "Precision dispensing & gluing",
    ],
    stat: { value: "±2%", label: "torque accuracy" },
  },
  {
    id: "home-appliances",
    name: "Home Appliances",
    short: "White goods at volume",
    tagline: "Fast, accurate and durable — shift after shift",
    description:
      "Washing machines, refrigerators and white goods move fast down the line. Cordless tightening, sheet-metal riveting and inline error-proofing keep cycle times low and rework lower, while ergonomic handling protects operators across long shifts.",
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
    id: "metal-fabrication",
    name: "Metal Fabrication",
    short: "Cut, grind, join, finish",
    tagline: "High-productivity material removal and air line tools",
    description:
      "Fabrication shops live on cutting speed and weld-prep quality. Grinders, sanders and high-performance abrasives deliver consistent stock removal, while a properly engineered compressed-air network keeps every tool at full rated power.",
    image: img("1598302936625-6075fbd98dd7"),
    icon: "Flame",
    accent: "#a78bfa",
    capabilities: [
      "Material removal tools & abrasives",
      "Grinding, deburring & weld prep",
      "Air line accessories & FRL units",
      "Workshop benches & storage",
    ],
    stat: { value: "1 mm", label: "burr-free cutting" },
  },
  {
    id: "heavy-equipment",
    name: "Heavy Equipment and Machinery",
    short: "Big iron, exact torque",
    tagline: "Reliable, sturdy assembly for total solutions",
    description:
      "Excavators, loaders, tractors and mining machines are built around large-diameter, high-torque joints. We supply the bolting systems, reaction arms, lifting gear and documented tightening these structures demand — plus the service to keep them running.",
    image: img("1580901369227-308f6f40bdeb"),
    icon: "Tractor",
    accent: "#4fd9b4",
    capabilities: [
      "High-torque bolting systems",
      "Torque reaction arms & fixtures",
      "Aluminium crane & lifting systems",
      "Structural riveting",
    ],
    stat: { value: "2000 kg", label: "assisted lifting" },
  },
  {
    id: "semiconductor",
    name: "Semiconductor Manufacturing",
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
    id: "railway",
    name: "Railway",
    short: "Built for the long haul",
    tagline: "Tools and service for high-speed trains, trams and carriages",
    description:
      "Rolling stock endures decades of vibration and load. We bring documented torque, structural riveting and modular lifting to bogie, body-shell and interior fit-out assembly — plus depot-level service that keeps maintenance windows short.",
    image: img("1701221602494-699948f33250"),
    icon: "TrainFront",
    accent: "#7c86f0",
    capabilities: [
      "Documented structural torque",
      "Bogie & body-shell riveting",
      "Modular aluminium crane systems",
      "Depot service & calibration",
    ],
    stat: { value: "100%", label: "joint documentation" },
  },
];

export const getIndustry = (id: string) =>
  industries.find((i) => i.id === id);
