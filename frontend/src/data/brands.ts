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
    color: "#0033A0",
    category: "Assembly & Tightening",
    blurb:
      "Industrial power tools, smart tightening systems and the Smart Workflow Feature (SWF) for error-proof assembly lines.",
    logo: logo("atlas-copco"),
  },
  {
    id: "gesipa",
    name: "GESIPA",
    color: "#0a4ea2",
    category: "Riveting Technology",
    blurb:
      "Blind rivets, blind rivet nuts and battery-powered setting tools engineered in Germany for high-volume joining.",
    logo: logo("gesipa"),
  },
  {
    id: "eepos",
    name: "eepos",
    color: "#1b9bd7",
    category: "Crane Systems",
    blurb:
      "Modular aluminium crane systems and ergonomic lifting solutions for flexible, lightweight material handling.",
    logo: logo("eepos"),
  },
  {
    id: "gedore",
    name: "GEDORE",
    color: "#0b63b2",
    category: "Hand Tools",
    blurb:
      "Premium hand tools, torque wrenches and workshop trolleys trusted across global manufacturing floors.",
    logo: logo("gedore"),
  },
  {
    id: "cejn",
    name: "CEJN",
    color: "#ee7203",
    category: "Pneumatics & Connectors",
    blurb:
      "Swedish-engineered quick-connect couplings, high-pressure connectors and safety air guns for fast, leak-free pneumatic and hydraulic connections.",
    logo: logo("cejn"),
  },
  {
    id: "hoffmann-group",
    name: "Hoffmann Group",
    color: "#ff7300",
    category: "Tooling & MRO",
    blurb:
      "Europe's system partner for quality tools — GARANT and HOLEX precision tools, measuring equipment and workstation solutions for industrial MRO.",
    logo: logo("hoffmann-group"),
  },
  {
    id: "legris",
    name: "Legris",
    color: "#0a3d91",
    category: "Fluid & Pneumatic Fittings",
    blurb:
      "Precision push-in fittings, connectors and tubing engineered in France for reliable compressed-air and fluid control.",
    logo: logo("legris"),
  },
  {
    id: "pferd",
    name: "PFERD",
    color: "#1f6fb2",
    category: "Abrasives & Cutting",
    blurb:
      "High-performance cutting discs, grinding wheels and surface finishing tools for metalworking precision.",
    logo: logo("pferd"),
  },
  {
    id: "john-guest",
    name: "John Guest",
    color: "#0e7ec4",
    category: "Fluid Fittings",
    blurb:
      "Push-fit connectors and pneumatic fittings delivering leak-free fluid and air transfer at scale.",
    logo: logo("john-guest"),
  },
];
