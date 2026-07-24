/**
 * A product family within a brand — the second level of the catalogue
 * ("Atlas Copco → Electric Assembly Tools"). Every line carries a short brief,
 * because the client's requirement is that no range is listed without one.
 */
export type BrandLine = {
  /** Unique within the brand; used as the `line` query param on /products. */
  id: string;
  name: string;
  /** The short brief shown under the line heading. */
  brief: string;
  /** Named series/models inside the line, in the client's preferred order. */
  models?: string[];
  /** Catalogue family this line rolls up to (id from data/categories.ts). */
  categoryId?: string;
  /**
   * Artwork for the line tile. Optional by design — `lineImage()` in
   * lib/lineImage.ts falls back to a product from the line and then to the
   * catalogue family's photo, so a line always has a picture even before an
   * admin uploads one.
   */
  image?: string;
};

export type BrandResource = { label: string; href: string };

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
  /** Product families under this brand, in display order. */
  lines: BrandLine[];
  /** Manufacturer literature we link out to (guides, catalogues). */
  resources?: BrandResource[];
  /**
   * Position in the brand sequence. Set by the backend seed (1-based); the API
   * returns brands already sorted by it, so the UI keeps array order. Absent on
   * locally-seeded data, where this array's order *is* the order.
   */
  sortOrder?: number;
};

// All brand logos resolve to /public/images/brands/<id>.(png|svg).
// Drop the official PNG/SVG in with the matching filename and it shows automatically.
//
// Stored as a BARE path, exactly as the backend seeds it — `brandLogo()`
// (lib/asset.ts) applies the deploy base at render time. Prefixing here as well
// would double it up ("/neo-website/neo-website/images/…") once the same value
// round-trips through the API.
const logo = (id: string) => `/images/brands/${id}.png`;

// Client-approved brand sequence. The Products page, the mega-menu and the
// homepage marquee all read this order — keep it as-is unless the client
// re-sequences it.
export const brands: Brand[] = [
  {
    id: "atlas-copco",
    name: "Atlas Copco",
    color: "#a5c532",
    category: "Assembly & Tightening",
    blurb:
      "The global benchmark in industrial assembly. Transducer-controlled nutrunners, smart tightening systems and the Smart Workflow Feature (SWF) deliver traceable, error-proof torque on every critical joint — engineered for Industry 4.0 production lines.",
    logo: logo("atlas-copco"),
    lines: [
      {
        id: "electric-assembly-tools",
        name: "Electric Assembly Tools",
        brief:
          "Corded, transducer-controlled nutrunners and screwdrivers that measure torque and angle on every rundown and report the result to the controller. The reference choice for safety-critical joints that must be documented.",
        models: [
          "Tensor STR Electric Nutrunner",
          "Tensor ST Electric Nutrunner",
          "Tensor ES Electric Nutrunner",
          "Tensor ES Electric Screwdriver",
        ],
        categoryId: "assembly-tightening",
      },
      {
        id: "cordless-assembly-tools",
        name: "Cordless Assembly Tools",
        brief:
          "Battery nutrunners with the same measured accuracy as the corded range, freeing the operator from cables and reaction hoses. Ideal for final assembly, rework stations and mobile lines.",
        models: ["Tensor SL / SB", "Tensor STB Angle", "SRB Handheld Nutrunner"],
        categoryId: "assembly-tightening",
      },
      {
        id: "pneumatic-assembly-tools",
        name: "Pneumatic Assembly Tools",
        brief:
          "Air screwdrivers, angle nutrunners and pulse tools built for high cycle counts at low cost per joint — light, cool-running and virtually maintenance-free where documentation is not required.",
        models: ["LUM / LTV screwdrivers", "LTP angle nutrunners", "Pulse tools (LMS / PTF)"],
        categoryId: "assembly-tightening",
      },
      {
        id: "torque-software",
        name: "Torque Software",
        brief:
          "Configure tightening programs, distribute them across the plant and archive every result. Turns individual tools into a managed, auditable tightening process.",
        models: ["ToolsTalk 2", "ToolsNet 8", "Station Setup"],
        categoryId: "process-software",
      },
      {
        id: "torque-controllers",
        name: "Torque Controllers",
        brief:
          "The brain of the station — drives the tool, runs the tightening strategy, judges OK/NOK and talks to the PLC and line MES over open protocols.",
        models: ["Power Focus 6000", "Power Focus 8", "PF6 FlexSystem", "MicroTorque"],
        categoryId: "assembly-tightening",
      },
      {
        id: "error-proofing",
        name: "Error Proofing Solutions",
        brief:
          "Stops the defect before it happens: socket trays, position detection and operator guidance make sure the right joint gets the right torque in the right sequence — and the line will not release the part until it does.",
        models: ["Socket selectors & trays", "Position detection (TLS)", "Operator guidance displays"],
        categoryId: "process-software",
      },
      {
        id: "quality-assurance",
        name: "Quality Assurance",
        brief:
          "Audit and prove the process. Torque analysers, joint simulators and smart wrenches verify that installed tools are still delivering what the drawing demands.",
        models: ["STwrench", "ACTA torque analysers", "Joint simulators"],
        categoryId: "assembly-tightening",
      },
      {
        id: "fixtured-solutions",
        name: "Fixtured Solutions",
        brief:
          "Multi-spindle heads and fixtured tightening for parts that must be clamped down simultaneously — even load, no distortion and a single cycle instead of a sequence.",
        models: ["QST spindles", "Multi-spindle heads", "Fixtured tightening stations"],
        categoryId: "sockets-fixtures-spm",
      },
      {
        id: "torque-reaction-arms",
        name: "Torque Reaction Arms",
        brief:
          "Takes the reaction force off the operator's wrist and puts it into the structure. Essential above roughly 15 Nm — better ergonomics, and a steadier, more repeatable rundown.",
        models: ["Articulated reaction arms", "Linear & telescopic arms", "Torque arms with tool balancers"],
        categoryId: "sockets-fixtures-spm",
      },
      {
        id: "bolt-tensioning",
        name: "Bolt Tensioning",
        brief:
          "Hydraulic tensioners and pumps that stretch the stud and set clamp load directly, rather than fighting friction through torque. The standard for flanges, wind towers and turbine casings.",
        models: ["Hydraulic bolt tensioners", "Tensioning pumps", "Multi-stud sets"],
        categoryId: "assembly-tightening",
      },
      {
        id: "wrenches",
        name: "Wrenches",
        brief:
          "Hydraulic and pneumatic torque wrenches for large-diameter, high-torque joints in confined access — controlled, repeatable and far safer than slugging.",
        models: ["Hydraulic torque wrenches", "Pneumatic torque wrenches", "Square-drive & low-clearance heads"],
        categoryId: "assembly-tightening",
      },
      {
        id: "pro-tools",
        name: "PRO Tools",
        brief:
          "The industrial workhorse range — drills, grinders, sanders, impact wrenches and ratchets built for daily production use, with Neo appointed Master Channel Partner across Gujarat, Madhya Pradesh and Mumbai.",
        models: ["PRO drills & tappers", "PRO grinders & sanders", "PRO impact wrenches & ratchets"],
        categoryId: "material-removal",
      },
    ],
  },
  {
    id: "gesipa",
    name: "GESIPA",
    color: "#2ed658",
    category: "Riveting Technology",
    blurb:
      "German pioneers of blind riveting since 1931. A complete range of blind rivets, rivet nuts and battery, pneumatic and hydro-pneumatic setting tools built for fast, reliable, high-volume joining across automotive and sheet-metal fabrication.",
    logo: logo("gesipa"),
    lines: [
      {
        id: "pop-rivet-tools",
        name: "Pop Rivet Tools",
        brief:
          "Battery-powered blind rivet setters that place a rivet in about a second with monitored setting force. AccuBird covers the everyday 2.4–5 mm range; Taurus steps up to 6.4 mm structural rivets and stainless.",
        models: ["AccuBird / AccuBird Pro", "Taurus 1 – 6"],
        categoryId: "riveting-systems",
      },
      {
        id: "nut-insert-tools",
        name: "Nut Insert Tools",
        brief:
          "Sets blind rivet nuts and studs to add a load-bearing thread to thin sheet — no welding, no back access. FireBird handles M3–M10 on battery; FireFox is the hydro-pneumatic answer for continuous line duty.",
        models: ["FireBird / FireBird Pro", "FireFox 1 & 2"],
        categoryId: "riveting-systems",
      },
      {
        id: "gav-automatic-tools",
        name: "GAV — Automatic Tools",
        brief:
          "Automatic feed systems that deliver rivets to the tool nose so the operator never handles a fastener. Cuts cycle time and eliminates the wrong-rivet error on high-volume stations.",
        models: ["GAV automatic feed units", "Fully automatic riveting stations"],
        categoryId: "riveting-systems",
      },
      {
        id: "manual-tools",
        name: "Manual Tools",
        brief:
          "Hand and lever riveting tools for maintenance, field work and low-volume assembly — the dependable backup to every powered station.",
        models: ["Hand riveting tools (NTS / NTX)", "Lever setting tools", "Manual nut-insert tools"],
        categoryId: "riveting-systems",
      },
    ],
  },
  {
    id: "eepos",
    name: "eepos",
    color: "#1b9bd7",
    category: "Crane Systems",
    blurb:
      "Modular aluminium crane systems that make material handling effortless. Lightweight yet rigid profiles, low dead weight and smooth-running trolleys reduce operator strain and let you configure ergonomic lifting to fit any workstation.",
    logo: logo("eepos"),
    lines: [
      {
        id: "eepos-one",
        name: "eepos one",
        brief:
          "The full-size modular crane system — aluminium rails, jib and gantry configurations up to 2000 kg, built to span a whole assembly bay while staying light enough to push with one hand.",
        models: ["Rail systems", "Jib cranes", "Free-standing gantries"],
        categoryId: "aluminium-crane-system",
      },
      {
        id: "eepos-nano",
        name: "eepos nano",
        brief:
          "The compact workstation crane for lighter loads. A slim profile that fits above a single bench or cell where a full gantry would be overkill, with the same low rolling resistance.",
        models: ["Workstation jibs", "Single-bay rail sets"],
        categoryId: "aluminium-crane-system",
      },
      {
        id: "eepos-base",
        name: "eepos base",
        brief:
          "The economical entry into modular aluminium handling — a standardised base configuration that installs quickly and scales later, ideal for a first ergonomics upgrade.",
        models: ["Standard base configurations", "Media column (air, power & data)"],
        categoryId: "aluminium-crane-system",
      },
    ],
  },
  {
    id: "cejn",
    name: "CEJN",
    color: "#ee7203",
    category: "Pneumatics & Connectors",
    blurb:
      "Swedish-engineered quick-connect technology. Compact, high-flow couplings, ultra-high-pressure connectors and safety air guns deliver leak-free pneumatic, hydraulic and fluid connections that cut energy loss and keep operators safe.",
    logo: logo("cejn"),
    lines: [
      {
        id: "esafe-quick-couplings",
        name: "eSafe Quick Couplings",
        brief:
          "Two-step safety couplings that vent the downstream air before releasing, so the hose can never whip. Max working pressure 10–16 bar, with the highest flow in their size class.",
        models: ["eSafe series 300 / 320", "Multi-size nipple range"],
        categoryId: "air-line-accessories",
      },
      {
        id: "high-pressure-couplings",
        name: "Ultra High-Pressure Couplings",
        brief:
          "Quick couplings for high-pressure hydraulic hoses and fittings, rated 70 to 400 MPa — connect-under-pressure designs for tensioning, jacking and testing rigs.",
        models: ["UHP hydraulic couplings", "High-pressure hose assemblies"],
        categoryId: "air-line-accessories",
      },
      {
        id: "hoses-reels",
        name: "Compressed Air Hoses & Reels",
        brief:
          "High-visibility, anti-spark, antistatic braided and non-braided hose rated 10–16 bar, plus slow-retraction air and electrical cable reels from 5 m to 23 m that keep the floor clear.",
        models: [
          "Compressed air hoses",
          "Compressed air reels — closed (5–17 m)",
          "Compressed air reels — open (15–23 m)",
          "Electrical cable reels (3×1.5 mm², 240 V)",
        ],
        categoryId: "air-line-accessories",
      },
      {
        id: "multi-link-outlets",
        name: "Multi-link Outlets & Testers",
        brief:
          "Vented-safety outlet blocks that split one drop into several tool feeds at 12–16 bar, plus a 10 bar pressure tester so you can prove what is actually reaching the tool.",
        models: ["Multi-link outlets", "Compressed air pressure tester"],
        categoryId: "air-line-accessories",
      },
      {
        id: "air-fluid-guns",
        name: "Air & Fluid Guns",
        brief:
          "OSHA-compliant blow guns rated to 16 bar. The Multiflow gun trades flow for noise on demand; the 208 series is the compact everyday gun for cleaning and drying.",
        models: ["Multiflow Air & Fluid Gun", "208 Air & Fluid Gun"],
        categoryId: "air-line-accessories",
      },
    ],
  },
  {
    id: "legris",
    name: "Legris",
    color: "#0a3d91",
    category: "Fluid & Pneumatic Fittings",
    blurb:
      "French precision in fluid and pneumatic control. Legris push-in fittings, connectors and calibrated tubing install in seconds without tools and hold leak-tight under pressure — the dependable choice for compressed-air and process fluid lines.",
    logo: logo("legris"),
    lines: [
      {
        id: "push-in-fittings",
        name: "Push-In Fittings",
        brief:
          "Instant tool-free connections in brass and technopolymer — straights, elbows, tees and bulkheads that hold leak-tight through vibration and thermal cycling.",
        models: ["Brass push-in range", "Technopolymer push-in range", "Bulkhead & manifold fittings"],
        categoryId: "air-line-accessories",
      },
      {
        id: "tubing-hose",
        name: "Calibrated Tubing",
        brief:
          "Precisely calibrated PA, PU and PE tubing matched to the fitting range, so the seal is designed rather than hoped for. Available in the full colour range for circuit identification.",
        models: ["Polyamide tubing", "Polyurethane tubing", "Multi-tube bundles"],
        categoryId: "air-line-accessories",
      },
      {
        id: "valves-flow-control",
        name: "Valves & Flow Control",
        brief:
          "Ball valves, flow regulators and non-return valves that let you isolate, tune and protect a circuit without breaking into the pipework.",
        models: ["Ball & shut-off valves", "Flow regulators", "Non-return valves"],
        categoryId: "air-line-accessories",
      },
    ],
  },
  {
    id: "transair",
    name: "Transair",
    color: "#0e7ec4",
    category: "Compressed-Air Piping",
    blurb:
      "Aluminium piping that transforms your compressed-air network. Transair's clean-bore, corrosion-free system installs fast, reconfigures without tools and stays leak-free for life — cutting pressure drop and energy cost across air, vacuum and inert-gas lines.",
    logo: logo("transair"),
    lines: [
      {
        id: "compressed-air-piping",
        name: "Compressed Air Piping",
        brief:
          "A complete calibrated aluminium pipe system from 16.5 mm to 168 mm. The bore stays clean so pressure drop stays low, and because joints are push-together rather than welded or threaded, a line can be re-routed on a shutdown weekend instead of a shutdown week.",
        models: ["Pipe Ø16.5 – 168 mm", "Quick-assembly connectors", "Drops, outlets & manifolds"],
        categoryId: "compressed-air-piping",
      },
      {
        id: "vacuum-inert-gas",
        name: "Vacuum & Inert Gas Lines",
        brief:
          "The same system approved for vacuum and inert gases — one installation method, one set of tools and one spares list across every utility in the plant.",
        models: ["Vacuum line components", "Nitrogen & inert gas lines"],
        categoryId: "compressed-air-piping",
      },
    ],
    resources: [
      {
        label: "Transair Installation Guide (PDF)",
        href: "https://www.transairaluminumpipe.com/pdf/Transair-Installation-guide.pdf",
      },
    ],
  },
  {
    id: "john-guest",
    name: "John Guest",
    color: "#0e7ec4",
    category: "Push-Fit Fittings",
    blurb:
      "The originator of the push-fit fitting. John Guest Speedfit connectors join pipe in seconds with a simple push, hold leak-tight without tools or solvents, and demount cleanly for rework — trusted across plumbing, pneumatics and beverage dispense worldwide.",
    logo: logo("john-guest"),
    lines: [
      {
        id: "speedfit-plumbing",
        name: "Hot & Cold Water Plumbing",
        brief:
          "The Speedfit plumbing range for hot and cold water services — barrier pipe plus the full fitting family, all demountable and reusable, with no flame, flux or solvent needed on site.",
        models: [
          "Pex Barrier Pipe",
          "Equal & Reducing Straight Connectors",
          "Equal & Stem Elbows",
          "Equal & Reducing Tees",
          "Female Coupler / Tap Connector",
          "Bent Tap Connector",
          "Stop End, Reducer & Plug",
          "Superseal Pipe Insert",
          "Pipe Clips & Spacers",
        ],
        categoryId: "air-line-accessories",
      },
      {
        id: "jg-pneumatics",
        name: "Pneumatic Fittings",
        brief:
          "Compact push-in fittings for compressed-air automation — 360° swivel elbows, nickel-plated brass threads and a vibration-resistant grip designed for machine-mounted service.",
        models: ["Push-in straights & elbows", "Swivel & banjo fittings", "Manifolds & bulkheads"],
        categoryId: "air-line-accessories",
      },
      {
        id: "jg-fluid-dispense",
        name: "Fluid & Beverage Dispense",
        brief:
          "Food-grade tube and fittings for water treatment, filtration and drinks dispense, where a joint has to be as hygienic as it is quick to make.",
        models: ["Food-grade tube & fittings", "Filtration connectors", "Inline valves"],
        categoryId: "air-line-accessories",
      },
    ],
  },
  {
    id: "hoffmann-group",
    name: "Hoffmann Group",
    color: "#ff7300",
    category: "Tooling & MRO",
    blurb:
      "Europe's leading system partner for quality tools. Through its GARANT and HOLEX ranges, Hoffmann Group supplies precision hand tools, torque technology, measuring equipment and complete workstation solutions — a single trusted source for industrial tooling and MRO.",
    logo: logo("hoffmann-group"),
    lines: [
      {
        id: "industrial-hand-tools",
        name: "Industrial Hand Tools",
        brief:
          "The GARANT and HOLEX hand-tool programme — premium spanners, pliers and screwdrivers, VDE insulated sets for live working, and Allen key sets sized for industrial duty.",
        models: [
          "Premium Hand Tools",
          "Allen Key Sets",
          "Insulated (VDE) Hand Tools",
          "Reversible Ratchet Heads",
        ],
        categoryId: "hand-tools-storage",
      },
      {
        id: "trolleys-benches-storage",
        name: "Tool Trolleys, Benches & Storage",
        brief:
          "Mobile trolleys, fixed workbenches, tool boxes and tool bags that give every tool a defined home — the foundation of a 5S floor and a faster shift handover.",
        models: ["Tools Trolley", "Work Benches", "Tool Boxes", "Tool Bag"],
        categoryId: "hand-tools-storage",
      },
      {
        id: "torque-technology",
        name: "Torque Technology",
        brief:
          "Manual adjustable and digital torque wrenches plus bench testers, so the wrench in the operator's hand and the certificate in the audit file agree.",
        models: [
          "Manual Adjustable Torque Wrench",
          "Digital Torque Wrench",
          "Electronic Torque Tester",
        ],
        categoryId: "hand-tools-storage",
      },
    ],
  },
  {
    id: "gedore",
    name: "GEDORE",
    color: "#1e4d9b",
    category: "Hand Tools",
    blurb:
      "Precision hand tools 'Made in Germany' since 1919 — Tools For Life. Forged spanners, calibrated torque wrenches, VDE insulated tools and fully stocked workshop trolleys, the professional-grade toolkit trusted on manufacturing and maintenance floors worldwide.",
    logo: logo("gedore"),
    lines: [
      {
        id: "gedore-hand-tools",
        name: "Hand Tools",
        brief:
          "Drop-forged spanners, sockets, pliers and screwdrivers with the surface finish and tolerance that let a tool stay on the joint instead of rounding it.",
        models: ["Spanners & combination sets", "Socket sets", "Pliers & screwdrivers"],
        categoryId: "hand-tools-storage",
      },
      {
        id: "gedore-torque",
        name: "Torque Wrenches & Testers",
        brief:
          "Click-type, dial and electronic torque wrenches supplied with an individual calibration certificate — plus the testers to re-verify them on your own schedule.",
        models: ["DREMASTER click wrenches", "Dial & electronic wrenches", "Torque testers"],
        categoryId: "hand-tools-storage",
      },
      {
        id: "gedore-storage",
        name: "Workshop Storage",
        brief:
          "Tool trolleys, cabinets and foam-inlay modules that turn a scattered tool crib into a controlled, countable inventory.",
        models: ["WorkSTER trolleys", "Tool cabinets", "Foam inlay modules"],
        categoryId: "hand-tools-storage",
      },
      {
        id: "gedore-vde",
        name: "Insulated VDE Tools",
        brief:
          "1000 V insulated tools, individually tested, for work on or near live equipment in panel shops, EV lines and switchyards.",
        models: ["VDE screwdrivers", "VDE pliers", "VDE socket sets"],
        categoryId: "hand-tools-storage",
      },
    ],
  },
  {
    id: "pferd",
    name: "PFERD",
    color: "#3577bd",
    category: "Material Removal",
    blurb:
      "German abrasives specialists and the 'TRUST BLUE' standard in surface work. High-performance cutting discs, grinding wheels, burrs and finishing tools engineered for maximum stock removal, longer life and a superior finish on every metalworking job.",
    logo: logo("pferd"),
    lines: [
      {
        id: "cutting-discs",
        name: "Cutting Discs",
        brief:
          "Ultra-thin cutting discs for steel, stainless and alloys. A 1 mm profile cuts cool and fast with minimal burr, so the cut costs less in material and less in the deburring step that follows.",
        models: ["SG STEELOX cutting discs", "INOX cutting discs", "Chop-saw wheels"],
        categoryId: "material-removal",
      },
      {
        id: "grinding-finishing",
        name: "Grinding & Finishing",
        brief:
          "POLIFAN flap discs and grinding wheels that take down weld and leave a workable finish in one pass, replacing a two-step grind-then-sand routine.",
        models: ["POLIFAN flap discs", "Grinding wheels", "Fibre & abrasive discs"],
        categoryId: "material-removal",
      },
      {
        id: "burrs-files-brushes",
        name: "Burrs, Files & Brushes",
        brief:
          "Carbide burrs, files and industrial brushes for deburring, weld prep and edge work in places a disc simply cannot reach.",
        models: ["Carbide burrs", "Files & rifflers", "Industrial wire brushes"],
        categoryId: "material-removal",
      },
      {
        id: "tool-drives",
        name: "Tool Drives",
        brief:
          "The straight grinders and flexible-shaft drives matched to PFERD's own tooling, so speed and mounting are right by design rather than by adapter.",
        models: ["Straight grinders", "Flexible shaft drives", "Angle grinders"],
        categoryId: "material-removal",
      },
    ],
  },
];

/**
 * Seed lookups. Prefer the live catalogue store (`useCatalog`) in components —
 * brands are admin-editable, so the static array is only the offline fallback.
 */
export const getBrand = (id: string) => brands.find((b) => b.id === id);

/** Look up a single product line, e.g. Atlas Copco → "Electric Assembly Tools". */
export const getBrandLine = (brandId: string, lineId: string) =>
  getBrand(brandId)?.lines.find((l) => l.id === lineId);
