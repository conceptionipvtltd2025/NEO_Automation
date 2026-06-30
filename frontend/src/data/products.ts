export type Product = {
  id: string;
  slug: string;
  name: string;
  brandId: string;
  brand: string;
  categoryId: string;
  industries: string[];
  price: number;
  rating: number;
  shortDesc: string;
  description: string;
  features: string[];
  specs: { label: string; value: string }[];
  images: string[];
  featured?: boolean;
  special?: boolean;
  badge?: string;
  visible?: boolean;
};

const p = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1000&q=80`;

export const products: Product[] = [
  {
    id: "ac-tensor-es",
    slug: "atlas-copco-tensor-es-cordless",
    name: "Tensor ES Cordless Nutrunner",
    brandId: "atlas-copco",
    brand: "Atlas Copco",
    categoryId: "assembly-tools",
    industries: ["automotive", "aerospace", "electronics-ev"],
    price: 489000,
    rating: 4.9,
    shortDesc:
      "Smart cordless tightening tool with full torque & angle traceability.",
    description:
      "The Tensor ES delivers transducer-controlled accuracy with real-time torque and angle feedback. Integrated with the Smart Workflow Feature (SWF), every result is documented, traced and error-proofed — the benchmark for critical-joint assembly.",
    features: [
      "Transducer-controlled ±2% torque accuracy",
      "Wireless SWF connectivity & traceability",
      "Ergonomic, low-reaction grip",
      "OLED display with live results",
    ],
    specs: [
      { label: "Torque Range", value: "5 – 50 Nm" },
      { label: "Speed", value: "Up to 950 rpm" },
      { label: "Accuracy", value: "± 2% Cm/Cmk" },
      { label: "Connectivity", value: "Wireless / SWF" },
      { label: "Weight", value: "1.1 kg" },
    ],
    images: [p("1581092160562-40aa08e78837"), p("1504328345606-18bbc8c9d7d1")],
    featured: true,
    special: true,
    badge: "Smart Tool",
    visible: true,
  },
  {
    id: "ac-power-focus",
    slug: "atlas-copco-power-focus-6000",
    name: "Power Focus 6000 Controller",
    brandId: "atlas-copco",
    brand: "Atlas Copco",
    categoryId: "assembly-tools",
    industries: ["automotive", "general-industries"],
    price: 612000,
    rating: 4.8,
    shortDesc:
      "Modular tightening controller orchestrating multi-tool assembly stations.",
    description:
      "Power Focus 6000 is the brain of the smart assembly line — a scalable controller that manages tightening strategies, traceability and line integration across multiple tools from a single intuitive interface.",
    features: [
      "Multi-tool orchestration",
      "Smart tightening strategies",
      "Open protocol & PLC integration",
      "Touch HMI configuration",
    ],
    specs: [
      { label: "Channels", value: "Up to 20 tools" },
      { label: "Protocols", value: "Open Protocol, Profinet" },
      { label: "Storage", value: "Full result traceability" },
      { label: "Display", value: "7\" touchscreen" },
    ],
    images: [p("1518770660439-4636190af475"), p("1581091226825-a6a2a5aee158")],
    featured: true,
    special: true,
    badge: "Smart Line",
    visible: true,
  },
  {
    id: "gesipa-accubird",
    slug: "gesipa-accubird-pro-rivet-tool",
    name: "AccuBird Pro Blind Rivet Tool",
    brandId: "gesipa",
    brand: "GESIPA",
    categoryId: "riveting-systems",
    industries: ["automotive", "aerospace", "general-industries"],
    price: 78500,
    rating: 4.7,
    shortDesc:
      "Battery-powered blind rivet setting tool with process monitoring.",
    description:
      "The AccuBird Pro sets blind rivets up to 4.8 mm in all materials with consistent, monitored force. Lightweight and fast, it brings German riveting precision to high-volume structural joining.",
    features: [
      "Sets rivets up to Ø 4.8 mm",
      "Process & setting-force monitoring",
      "Brushless motor, 2.5 kN traction",
      "Quick-change nosepiece system",
    ],
    specs: [
      { label: "Rivet Capacity", value: "Ø 2.4 – 4.8 mm" },
      { label: "Traction Force", value: "2.5 kN" },
      { label: "Stroke", value: "20 mm" },
      { label: "Battery", value: "18V Li-Ion" },
      { label: "Weight", value: "2.0 kg" },
    ],
    images: [p("1530124566582-a618bc2615dc"), p("1572981779307-38b8cabb2407")],
    featured: true,
    special: true,
    badge: "Best Seller",
    visible: true,
  },
  {
    id: "gesipa-firebird",
    slug: "gesipa-firebird-pro-rivet-nut",
    name: "FireBird Pro Rivet-Nut Setter",
    brandId: "gesipa",
    brand: "GESIPA",
    categoryId: "riveting-systems",
    industries: ["automotive", "general-industries"],
    price: 89900,
    rating: 4.6,
    shortDesc: "High-speed blind rivet-nut tool for threaded fastening.",
    description:
      "FireBird Pro sets blind rivet nuts up to M10 with programmable stroke and force control, ideal for adding strong threads to thin-walled structures.",
    features: [
      "Sets rivet nuts up to M10",
      "Stroke & force programmable",
      "Fast cycle, low fatigue",
      "Digital setting feedback",
    ],
    specs: [
      { label: "Capacity", value: "M3 – M10" },
      { label: "Setting Force", value: "20 kN" },
      { label: "Battery", value: "18V Li-Ion" },
      { label: "Weight", value: "2.2 kg" },
    ],
    images: [p("1572981779307-38b8cabb2407"), p("1530124566582-a618bc2615dc")],
    visible: true,
  },
  {
    id: "eepos-alu-crane",
    slug: "eepos-modular-aluminium-crane",
    name: "Modular Aluminium Crane System",
    brandId: "eepos",
    brand: "eepos",
    categoryId: "crane-systems",
    industries: ["automotive", "general-industries", "aerospace"],
    price: 1450000,
    rating: 4.8,
    shortDesc:
      "Lightweight modular crane for ergonomic, flexible material handling.",
    description:
      "The eepos aluminium crane combines low dead weight with high rigidity, enabling effortless one-hand movement of loads. Modular profiles configure to any workstation layout.",
    features: [
      "Loads up to 2000 kg",
      "Ultra-low rolling resistance",
      "Modular aluminium profiles",
      "Ergonomic single-hand guiding",
    ],
    specs: [
      { label: "Capacity", value: "Up to 2000 kg" },
      { label: "Span", value: "Up to 8 m" },
      { label: "Material", value: "Aircraft-grade aluminium" },
      { label: "Mounting", value: "Free-standing / ceiling" },
    ],
    images: [p("1565514020179-026b92b84bb6"), p("1504917595217-d4dc5ebe6122")],
    featured: true,
    special: true,
    badge: "Ergonomic",
    visible: true,
  },
  {
    id: "gedore-trolley",
    slug: "gedore-workster-tool-trolley",
    name: "WorkSTER Premium Tool Trolley",
    brandId: "gedore",
    brand: "GEDORE",
    categoryId: "hand-tools",
    industries: ["general-industries", "automotive", "data-center"],
    price: 124000,
    rating: 4.7,
    shortDesc: "7-drawer workshop trolley with full tool complement.",
    description:
      "A mobile workshop in steel — the GEDORE WorkSTER trolley offers smooth ball-bearing drawers, central locking and a curated tool set for professional service teams.",
    features: [
      "7 ball-bearing drawers",
      "Central key locking",
      "Anti-slip worktop",
      "Optional full tool set",
    ],
    specs: [
      { label: "Drawers", value: "7" },
      { label: "Load / Drawer", value: "30 kg" },
      { label: "Material", value: "Powder-coated steel" },
      { label: "Castors", value: "4× heavy-duty" },
    ],
    images: [p("1504328345606-18bbc8c9d7d1"), p("1581091226825-a6a2a5aee158")],
    visible: true,
  },
  {
    id: "gedore-torque",
    slug: "gedore-dremaster-torque-wrench",
    name: "DREMASTER Torque Wrench",
    brandId: "gedore",
    brand: "GEDORE",
    categoryId: "hand-tools",
    industries: ["aerospace", "automotive", "energy-utilities"],
    price: 38500,
    rating: 4.9,
    shortDesc: "Precision click-type torque wrench, calibration certified.",
    description:
      "The DREMASTER delivers ±3% accuracy with a clear mechanical click. Each wrench ships with an individual calibration certificate for documented, audit-ready torque.",
    features: [
      "±3% accuracy",
      "Individual calibration certificate",
      "Audible & tactile click",
      "Reversible ratchet head",
    ],
    specs: [
      { label: "Range", value: "20 – 200 Nm" },
      { label: "Accuracy", value: "± 3%" },
      { label: "Drive", value: '1/2"' },
      { label: "Standard", value: "ISO 6789" },
    ],
    images: [p("1581091226825-a6a2a5aee158"), p("1504328345606-18bbc8c9d7d1")],
    visible: true,
  },
  {
    id: "pferd-cut-disc",
    slug: "pferd-sg-steelox-cutting-disc",
    name: "SG STEELOX Cutting Disc",
    brandId: "pferd",
    brand: "PFERD",
    categoryId: "abrasives-cutting",
    industries: ["general-industries", "automotive", "energy-utilities"],
    price: 4200,
    rating: 4.6,
    shortDesc: "Ultra-thin high-performance cutting disc for steel & stainless.",
    description:
      "PFERD SG STEELOX discs cut steel and stainless with minimal burr and maximum life. The 1 mm profile delivers fast, cool, precise cuts with low material loss.",
    features: [
      "1 mm ultra-thin profile",
      "Steel & stainless (INOX)",
      "Cool, burr-free cutting",
      "Long service life",
    ],
    specs: [
      { label: "Diameter", value: "125 mm" },
      { label: "Thickness", value: "1.0 mm" },
      { label: "Max RPM", value: "12,200 rpm" },
      { label: "Material", value: "Aluminium oxide" },
    ],
    images: [p("1530124566582-a618bc2615dc"), p("1565514020179-026b92b84bb6")],
    badge: "Pack of 25",
    visible: true,
  },
  {
    id: "pferd-flap-disc",
    slug: "pferd-polifan-flap-disc",
    name: "POLIFAN Flap Disc",
    brandId: "pferd",
    brand: "PFERD",
    categoryId: "abrasives-cutting",
    industries: ["aerospace", "general-industries"],
    price: 5600,
    rating: 4.7,
    shortDesc: "Zirconia flap disc for aggressive grinding and finishing.",
    description:
      "POLIFAN combines high stock removal with a fine finish, letting you grind and finish in a single step on steel, stainless and alloys.",
    features: [
      "Zirconia alumina grain",
      "Grind & finish in one step",
      "Cool operation",
      "Consistent performance",
    ],
    specs: [
      { label: "Diameter", value: "115 mm" },
      { label: "Grit", value: "Z40 / Z60 / Z80" },
      { label: "Max RPM", value: "13,300 rpm" },
      { label: "Backing", value: "Fibreglass" },
    ],
    images: [p("1572981779307-38b8cabb2407"), p("1530124566582-a618bc2615dc")],
    visible: true,
  },
  {
    id: "jg-speedfit",
    slug: "john-guest-speedfit-connector",
    name: "Speedfit Push-Fit Connector Set",
    brandId: "john-guest",
    brand: "John Guest",
    categoryId: "fluid-fittings",
    industries: ["data-center", "general-industries"],
    price: 8900,
    rating: 4.8,
    shortDesc: "Tool-free push-fit fittings for leak-free fluid & air lines.",
    description:
      "John Guest Speedfit connectors create instant, secure, leak-free joints with a simple push. Ideal for liquid cooling, pneumatics and rapid data-center fluid routing.",
    features: [
      "Tool-free push-to-connect",
      "Leak-free O-ring seal",
      "Reusable & demountable",
      "WRAS / NSF approved",
    ],
    specs: [
      { label: "Tube OD", value: "4 – 22 mm" },
      { label: "Pressure", value: "Up to 20 bar" },
      { label: "Temp", value: "-20 to 65 °C" },
      { label: "Material", value: "Acetal copolymer" },
    ],
    images: [p("1558494949-ef010cbdcc31"), p("1518770660439-4636190af475")],
    badge: "Liquid Cooling",
    visible: true,
  },
  {
    id: "jg-pneumatic",
    slug: "john-guest-pneumatic-fitting",
    name: "Pneumatic Push-In Fitting Range",
    brandId: "john-guest",
    brand: "John Guest",
    categoryId: "fluid-fittings",
    industries: ["general-industries", "automotive"],
    price: 6500,
    rating: 4.6,
    shortDesc: "Compact push-in fittings for compressed-air automation.",
    description:
      "A complete range of compact pneumatic fittings engineered for fast assembly and reliable, vibration-resistant air connections on automated equipment.",
    features: [
      "Compact footprint",
      "Vibration resistant",
      "360° swivel elbows",
      "Nickel-plated brass thread",
    ],
    specs: [
      { label: "Tube OD", value: "4 – 16 mm" },
      { label: "Pressure", value: "Up to 16 bar" },
      { label: "Thread", value: "BSPT / NPT" },
      { label: "Body", value: "Acetal / brass" },
    ],
    images: [p("1504917595217-d4dc5ebe6122"), p("1558494949-ef010cbdcc31")],
    visible: true,
  },
  {
    id: "ac-srb-focus",
    slug: "atlas-copco-srb-handheld",
    name: "SRB Handheld Battery Nutrunner",
    brandId: "atlas-copco",
    brand: "Atlas Copco",
    categoryId: "assembly-tools",
    industries: ["general-industries", "automotive", "data-center"],
    price: 215000,
    rating: 4.7,
    shortDesc: "Versatile battery nutrunner for medium-torque assembly.",
    description:
      "The SRB series brings reliable, repeatable tightening to general assembly with shut-off control, onboard results and effortless battery operation.",
    features: [
      "Shut-off torque control",
      "Onboard result storage",
      "Brushless motor",
      "Lightweight balance",
    ],
    specs: [
      { label: "Torque Range", value: "10 – 100 Nm" },
      { label: "Speed", value: "Up to 700 rpm" },
      { label: "Battery", value: "18V Li-Ion" },
      { label: "Weight", value: "1.6 kg" },
    ],
    images: [p("1581091226825-a6a2a5aee158"), p("1581092160562-40aa08e78837")],
    badge: "Versatile",
    visible: true,
  },
];

export const getProduct = (slug: string) =>
  products.find((pr) => pr.slug === slug);

export const featuredProducts = products.filter((pr) => pr.featured);
export const specialProducts = products.filter((pr) => pr.special);
