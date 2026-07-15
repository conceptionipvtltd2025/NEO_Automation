import { industries } from "@/data/industries";
import { nswHero, nswTeamCover } from "@/data/nswGallery";

export const site = {
  name: "Neo Automation",
  legalName: "Neo Automation Pvt. Ltd.",
  tagline: "Engineering Tomorrow's Industry",
  description:
    "Premium automation solutions, precision industrial tools and authorised distribution for the world's leading manufacturing brands.",
  phone: "+91 98987 97004",
  phoneDial: "+919898797004",
  email: "marketing@neoautomation.in",
  whatsapp: "919662501422",
  whatsappDisplay: "+91 96625 01422",
  hours: {
    days: "Monday to Saturday",
    time: "9:30 AM – 6:30 PM",
    short: "Mon–Sat · 9:30 AM – 6:30 PM",
  },
  address: {
    line1: "13, Jahnavi Industrial Estate, Opp. Madhav Avenue,",
    line2: "S.P. Ring Road, Odhav, Ahmedabad – 382415, Gujarat, India",
    city: "Ahmedabad",
    country: "India",
  },
  // Odhav, Ahmedabad — coordinates for the map
  map: {
    lat: 23.0314,
    lng: 72.673,
    query:
      "13 Jahnavi Industrial Estate, Opp Madhav Avenue, S.P. Ring Road, Odhav, Ahmedabad 382415",
  },
  social: {
    linkedin: "https://www.linkedin.com/in/neo-automation-64a619147",
    instagram: "https://www.instagram.com/neoautomation13/",
    twitter: "https://x.com/AutomationNeo",
    facebook: "https://www.facebook.com/profile.php?id=100017663492207",
  },
  stats: [
    { value: 19, suffix: "+", label: "Years of Engineering" },
    { value: 8, suffix: "+", label: "Global Brand Partners" },
    { value: 600, suffix: "+", label: "Delivered Solutions To Customers" },
    { value: 99.2, suffix: "%", label: "Uptime Reliability" },
  ],
};

export type NavSubLink = { label: string; href: string; desc?: string };
export type NavColumn = { heading: string; links: NavSubLink[] };
export type NavFeatured = {
  eyebrow?: string;
  title: string;
  blurb: string;
  href: string;
  cta: string;
  /** Optional background photo for the featured promo card. */
  bgImage?: string;
};

export type NavTile = {
  label: string;
  href: string;
  desc?: string;
  image: string;
};

export type NavItem = {
  label: string;
  href: string;
  /** When present, the item opens an animated mega-menu panel on hover/focus. */
  mega?: {
    columns: NavColumn[];
    featured: NavFeatured;
    /** When present, the desktop panel renders these as image cards (Industries). */
    tiles?: NavTile[];
  };
};

// Static fallback image tiles for the Industries mega-menu. At runtime,
// `useNavItems()` (src/lib/useNavItems.ts) rebuilds the Products & Industries
// mega columns/tiles from the LIVE catalogue store so admin edits show up — so
// edit the catalogue (admin) or the seed data, not these static defaults.
const industryTiles: NavTile[] = industries
  .filter((i) => i.visible !== false)
  .map((i) => ({
    label: i.name,
    href: `/industries/${i.id}`,
    desc: i.short,
    image: i.image,
  }));

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Products",
    href: "/products",
    mega: {
      columns: [
        {
          heading: "Shop by Category",
          links: [
            { label: "Assembly & Tightening", href: "/products?category=assembly-tools", desc: "Smart cordless & electric tightening with traceability" },
            { label: "Riveting Systems", href: "/products?category=riveting-systems", desc: "Blind rivet & rivet-nut setting tools for structural joining" },
            { label: "Crane Systems", href: "/products?category=crane-systems", desc: "Modular aluminium cranes & ergonomic lifting" },
            { label: "Hand Tools & Storage", href: "/products?category=hand-tools", desc: "Torque wrenches, premium hand tools & trolleys" },
            { label: "Abrasives & Cutting", href: "/products?category=abrasives-cutting", desc: "Cutting discs, grinding wheels & surface finishing" },
            { label: "Fluid & Pneumatic Fittings", href: "/products?category=fluid-fittings", desc: "Push-fit connectors for leak-free fluid & air" },
          ],
        },
        {
          heading: "Shop by Brand",
          links: [
            { label: "Atlas Copco", href: "/products?brand=atlas-copco", desc: "Smart transducer-controlled assembly systems" },
            { label: "GESIPA", href: "/products?brand=gesipa", desc: "German blind-riveting technology since 1931" },
            { label: "GEDORE", href: "/products?brand=gedore", desc: "Precision hand tools, Made in Germany" },
            { label: "PFERD", href: "/products?brand=pferd", desc: "TRUST BLUE abrasives & surface work" },
            { label: "CEJN", href: "/products?brand=cejn", desc: "Swedish quick-connect pneumatics" },
            { label: "eepos", href: "/products?brand=eepos", desc: "Modular aluminium crane systems" },
          ],
        },
        {
          heading: "Shop by Application",
          links: [
            { label: "Automotive line assembly", href: "/products?industry=automotive", desc: "Zero-defect tightening at line speed" },
            { label: "Aerospace joining", href: "/products?industry=aerospace", desc: "Aviation-grade, mission-critical fasteners" },
            { label: "Electronics & EV", href: "/products?industry=electronics-ev", desc: "Micro-precision for high-volume electronics" },
            { label: "General industries", href: "/products?industry=general-industries", desc: "One tooling partner for every process" },
            { label: "Browse full catalogue", href: "/products", desc: "All products, filters & search" },
          ],
        },
      ],
      featured: {
        eyebrow: "Signature Engineering",
        title: "Special products, built to outperform",
        blurb: "Explore our signature engineering — flagship tightening, riveting and lifting systems chosen for the toughest lines.",
        href: "/products",
        cta: "See signature range",
      },
    },
  },
  {
    label: "Industries",
    href: "/industries",
    mega: {
      columns: [
        {
          heading: "Mobility & Transport",
          links: [
            { label: "Automotive", href: "/industries/automotive", desc: "Zero-defect assembly for the mobility era" },
            { label: "Aerospace", href: "/industries/aerospace", desc: "Where every fastener is mission-critical" },
            { label: "Electronics & EV", href: "/industries/electronics-ev", desc: "Micro-precision for high-volume electronics" },
          ],
        },
        {
          heading: "Infrastructure & Energy",
          links: [
            { label: "Data Center", href: "/industries/data-center", desc: "Infrastructure assembled to the micron" },
            { label: "Energy & Utilities", href: "/industries/energy-utilities", desc: "Heavy-duty tooling for critical infrastructure" },
            { label: "General Industries", href: "/industries/general-industries", desc: "Tooling the world's workshops" },
          ],
        },
        {
          heading: "Get Tailored Advice",
          links: [
            { label: "All industries", href: "/industries", desc: "Explore every sector we power" },
            { label: "Talk to a specialist", href: "/inquiry", desc: "Get a tailored tooling recommendation" },
            { label: "Request a quote", href: "/inquiry", desc: "Pricing, availability & lead times" },
          ],
        },
      ],
      featured: {
        eyebrow: "Industries We Power",
        title: "Built for the floors that build the world",
        blurb: "From automotive to aerospace, see how Neo engineers the right tightening and joining solution for your process.",
        href: "/industries",
        cta: "Explore industries",
      },
      tiles: industryTiles,
    },
  },
  {
    label: "Service",
    href: "/nsw",
    mega: {
      columns: [
        {
          heading: "What We Service",
          links: [
            { label: "Pneumatic Nut Runners", href: "/nsw#pneumatic-nut-runners", desc: "Overhaul, seal kits & air-motor servicing" },
            { label: "Battery Nut Runners", href: "/nsw#battery-nut-runners", desc: "Cordless repair & electronics diagnostics" },
            { label: "Electric Nut Runners", href: "/nsw#electric-nut-runners", desc: "DC/transducerised service & motor rewinding" },
          ],
        },
        {
          heading: "Calibration & Support",
          links: [
            { label: "Torque Calibration", href: "/nsw#torque-calibration", desc: "ISO 6789 certification, audit-ready reports" },
            { label: "Repair & Genuine Spares", href: "/nsw#repair-spares", desc: "100% genuine spares, fast turnaround" },
            { label: "Preventive Maintenance", href: "/nsw#preventive-maintenance", desc: "AMC contracts that maximise tool life" },
          ],
        },
        {
          heading: "The Neo Service Workshop",
          links: [
            { label: "Inside the workshop", href: "/nsw#inside-the-workshop", desc: "Our Atlas Copco-inaugurated facility" },
            { label: "The service promise", href: "/nsw#service-promise", desc: "In-house, OEM-trained, ~48h turnaround" },
            { label: "Book a tool service", href: "/inquiry", desc: "Enquire now to schedule a service" },
          ],
        },
      ],
      featured: {
        eyebrow: "Neo Service Workshop",
        title: "Nut runners, restored & certified",
        blurb: "An in-house workshop with genuine spares, OEM-trained engineers and ISO 6789 calibration — built around your uptime.",
        href: "/nsw",
        cta: "Explore Service",
        bgImage: nswHero,
      },
    },
  },
  {
    label: "Company",
    href: "/about",
    mega: {
      columns: [
        {
          heading: "About Neo",
          links: [
            { label: "Our story", href: "/about#story", desc: "Ahmedabad-based, founded 2007 by Baldev Solanki" },
            { label: "Mission & vision", href: "/about#mission-vision", desc: "Precision, traceable tooling for every floor" },
            { label: "Our journey", href: "/about#timeline", desc: "Milestones from 2019 to 1200+ installations" },
            { label: "Core values", href: "/about#values", desc: "Integrity, Precision, Partnership, Excellence" },
          ],
        },
        {
          heading: "Trust & Responsibility",
          links: [
            { label: "Credentials & certifications", href: "/about#credentials", desc: "ISO 9001:2015, authorised distributor, OEM-trained" },
            { label: "Sustainability & Safety", href: "/sustainability", desc: "Our environmental and safety-first commitments" },
            { label: "Terms of use", href: "/terms", desc: "Products, quotations & governing terms" },
            { label: "Privacy policy", href: "/privacy", desc: "How we collect and protect your data" },
          ],
        },
        {
          heading: "Talk to Neo",
          links: [
            { label: "Contact us", href: "/contact", desc: "Address, phone, email, hours & map" },
            { label: "Get a quote", href: "/inquiry", desc: "Tell us what you need" },
            { label: "Neo Service Workshop", href: "/nsw", desc: "Repair, calibrate & certify your tools" },
          ],
        },
      ],
      featured: {
        eyebrow: "Who We Are",
        title: "A partner engineered for precision & trust",
        blurb: "Nearly two decades equipping Indian industry with the world's finest tools — plus engineering expertise beyond the sale.",
        href: "/about",
        cta: "More about Neo",
        bgImage: nswTeamCover,
      },
    },
  },
  { label: "Contact", href: "/contact" },
];
