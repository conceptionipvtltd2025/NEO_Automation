import { asset } from "@/lib/asset";

export type Brand = {
  id: string;
  name: string;
  color: string; // brand accent for hover
  category: string;
  blurb: string;
  /**
   * Web-ready logo at /public/images/brands/<id>.png (or .svg).
   * If the file is missing/fails to load, the UI falls back to a styled wordmark.
   */
  logo: string;
};

// All brand logos resolve to /public/images/brands/<id>.(png|svg).
// Drop the official PNG/SVG in with the matching filename and it shows automatically.
// asset() prefixes the deploy base so logos load under /neo-website/ on the server.
const logo = (id: string) => asset(`images/brands/${id}.png`);

export const brands: Brand[] = [
  {
    id: "atlas-copco",
    name: "Atlas Copco",
    color: "#a5c532",
    category: "Assembly & Tightening",
    blurb:
      "The global benchmark in industrial assembly. Transducer-controlled nutrunners, smart tightening systems and the Smart Workflow Feature (SWF) deliver traceable, error-proof torque on every critical joint — engineered for Industry 4.0 production lines.",
    logo: logo("atlas-copco"),
  },
  {
    id: "gesipa",
    name: "GESIPA",
    color: "#2ed658",
    category: "Riveting Technology",
    blurb:
      "German pioneers of blind riveting since 1931. A complete range of blind rivets, rivet nuts and battery, pneumatic and hydro-pneumatic setting tools built for fast, reliable, high-volume joining across automotive and sheet-metal fabrication.",
    logo: logo("gesipa"),
  },
  {
    id: "eepos",
    name: "eepos",
    color: "#1b9bd7",
    category: "Crane Systems",
    blurb:
      "Modular aluminium crane systems that make material handling effortless. Lightweight yet rigid profiles, low dead weight and smooth-running trolleys reduce operator strain and let you configure ergonomic lifting to fit any workstation.",
    logo: logo("eepos"),
  },
  {
    id: "gedore",
    name: "GEDORE",
    color: "#0b63b2",
    category: "Hand Tools",
    blurb:
      "Precision hand tools 'Made in Germany' since 1919. Forged spanners, calibrated torque wrenches, VDE insulated tools and fully stocked workshop trolleys — the professional-grade toolkit trusted on manufacturing and maintenance floors worldwide.",
    logo: logo("gedore"),
  },
  {
    id: "cejn",
    name: "CEJN",
    color: "#ee7203",
    category: "Pneumatics & Connectors",
    blurb:
      "Swedish-engineered quick-connect technology. Compact, high-flow couplings, ultra-high-pressure connectors and safety air guns deliver leak-free pneumatic, hydraulic and fluid connections that cut energy loss and keep operators safe.",
    logo: logo("cejn"),
  },
  {
    id: "hoffmann-group",
    name: "Hoffmann Group",
    color: "#ff7300",
    category: "Tooling & MRO",
    blurb:
      "Europe's leading system partner for quality tools. Through its GARANT and HOLEX ranges, Hoffmann Group supplies precision cutting tools, measuring and clamping equipment and complete workstation solutions — a single trusted source for industrial tooling and MRO.",
    logo: logo("hoffmann-group"),
  },
  {
    id: "legris",
    name: "Legris",
    color: "#0a3d91",
    category: "Fluid & Pneumatic Fittings",
    blurb:
      "French precision in fluid and pneumatic control. Legris push-in fittings, connectors and calibrated tubing install in seconds without tools and hold leak-tight under pressure — the dependable choice for compressed-air and process fluid lines.",
    logo: logo("legris"),
  },
  {
    id: "pferd",
    name: "PFERD",
    color: "#1f6fb2",
    category: "Abrasives & Cutting",
    blurb:
      "German abrasives specialists and the 'TRUST BLUE' standard in surface work. High-performance cutting discs, grinding wheels, burrs and finishing tools engineered for maximum stock removal, longer life and a superior finish on every metalworking job.",
    logo: logo("pferd"),
  },
  {
    id: "transair",
    name: "Transair",
    color: "#0e7ec4",
    category: "Compressed-Air Piping",
    blurb:
      "Aluminium piping that transforms your compressed-air network. Transair's clean-bore, corrosion-free system installs fast, reconfigures without tools and stays leak-free for life — cutting pressure drop and energy cost across air, vacuum and inert-gas lines.",
    logo: logo("transair"),
  },
];
