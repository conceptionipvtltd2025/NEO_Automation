import type { InsightArticle } from "./types";

/**
 * Atlas Copco Expert Hub white paper teaser, "Smart Assembly Technology for
 * Modern Defence Manufacturing" (16 February 2026). The source page is mostly
 * CMS template placeholders (dummy headings, "20M / 1773 hours / 30%" stats,
 * a sample contact card); only its intro, the four sub-sectors and the six
 * challenges are real content, so this article is deliberately short.
 */
export const defenceSmartAssembly: InsightArticle = {
  id: "defence-smart-assembly",
  intro:
    "Defence electronics must be assembled to tight tolerances, with zero defects and full traceability, often in the tightest corners of an aircraft. Atlas Copco sets out the six challenges that shape assembly for the sector.",
  body: [
    {
      type: "lead",
      text: "Modern defence systems increasingly rely on sophisticated electronics for sensing, decision support and autonomous or semi-autonomous operation.",
    },
    {
      type: "p",
      text: "That evolution places unprecedented demands on manufacturing, above all in electronics assembly, where mechanical precision and repeatability directly influence how the finished system performs and how reliable it is.",
    },
    { type: "h2", text: "Where electronics assembly matters" },
    {
      type: "p",
      text: "Electronic components are assembled across several defence sub-sectors, including:",
    },
    {
      type: "list",
      style: "bullet",
      items: [
        { text: "UAVs and drones" },
        { text: "Sensors" },
        { text: "Missiles" },
        { text: "Aircraft" },
      ],
    },
    {
      type: "image",
      src: "images/safety/insights/gallery/smart-integrated-assembly.jpg",
      alt: "Abstract render of a glowing amber cube rising from a dark, circuit-like grid of tiles",
      caption:
        "Smart Integrated Assembly: Atlas Copco's view of industrial manufacturing in the era of Industry 4.0 and beyond.",
    },
    { type: "h2", text: "Six challenges on the assembly line" },
    {
      type: "p",
      text: "Across these sub-sectors, Atlas Copco identifies six challenges in the assembly of electronic components.",
    },
    {
      type: "list",
      style: "number",
      items: [
        {
          title: "Precision",
          text: "Tight tolerances must be met for the electronics, sensors and avionics that are critical to system performance.",
        },
        {
          title: "Process control",
          text: "Mission-critical systems must be defect-free and reliable.",
        },
        {
          title: "Traceability",
          text: "Every assembly step is tracked for compliance, quality audits and process improvement.",
        },
        {
          title: "Productivity",
          text: "Large, complex aircraft assemblies need efficient, repeatable processes to meet production schedules.",
        },
        {
          title: "Quality",
          text: "Safety-critical systems such as airframes, engines and avionics demand high reliability and zero defects.",
        },
        {
          title: "Ergonomics",
          text: "Operators often work in confined areas, where ergonomic tools make precision assembly possible.",
        },
      ],
    },
    { type: "h2", text: "Precision in tight spaces" },
    {
      type: "p",
      text: "In defence manufacturing, ergonomics and precision are closely linked. Operators often assemble components in confined areas such as cockpits, avionics bays and landing gear compartments, and it is ergonomic tools that allow precision assembly in spaces this tight.",
    },
  ],
  keyTakeaways: [
    "Electronics drive modern defence systems",
    "UAVs, sensors, missiles and aircraft",
    "Zero defects and full traceability",
    "Ergonomic tools for confined spaces",
  ],
  neoLinks: [
    {
      label: "Aerospace",
      href: "/industries/aerospace",
      desc: "Calibrated torque tools and documented, traceable tightening for airframe work.",
    },
    {
      label: "Electronics",
      href: "/industries/electronics",
      desc: "Micro-torque screwdrivers, ESD-safe tools and error-proofing.",
    },
    {
      label: "Process software",
      href: "/products?category=process-software",
      desc: "Torque software and production-data platforms for traceable results.",
    },
    {
      label: "Torque calibration",
      href: "/nsw#torque-calibration",
      desc: "Calibration with documented, audit-ready torque reports.",
    },
  ],
};
