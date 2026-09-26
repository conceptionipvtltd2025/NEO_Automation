import type { InsightArticle } from "./types";

/**
 * Source: Atlas Copco Expert Hub, "Experience a new level of data integration
 * with the Atlas Copco Mechatronic System" (22 July 2021). The source is a
 * short video page, so this article is deliberately brief and only restates
 * what it says.
 */
export const mechatronicSystem: InsightArticle = {
  id: "mechatronic-system",
  intro:
    "Safety-critical joints in narrow working areas still have to meet the highest quality standards. Atlas Copco's Mechatronic System combines ergonomic wrenches, error-proofing and data integration to make that possible.",
  body: [
    {
      type: "lead",
      text: "Reaching high quality standards in tightening is never straightforward, and it gets harder when the application is safety critical and the work has to be done in difficult, narrow spaces. Atlas Copco's answer is its Mechatronic System, which brings high reliability and traceability together.",
    },

    { type: "h2", text: "Three benefits of the Mechatronic System" },
    {
      type: "list",
      style: "check",
      items: [
        {
          title: "Safe application in limited space",
          text: "Ergonomic, lightweight wrenches allow a safe application even where space is limited.",
        },
        {
          title: "Fewer operational failures",
          text: "A highly reliable error-proofing system identifies missing tightenings, which reduces operational failures.",
        },
        {
          title: "Traceability at every step",
          text: "Easy, standardised data integration makes each step of the process traceable.",
        },
      ],
    },

    { type: "h2", text: "More than just a click" },
    {
      type: "p",
      text: "Atlas Copco sums up the Mechatronic System as \"more than just a click\": alongside the wrenches themselves, it brings error-proofing and data integration into the tightening process.",
    },
    {
      type: "callout",
      tone: "success",
      title: "Quality without long training",
      text: "According to Atlas Copco, the system helps manufacturers keep their highest quality standards while benefiting from short operator training times.",
    },

    { type: "h2", text: "Industries Atlas Copco lists it under" },
    {
      type: "p",
      text: "Atlas Copco lists the article under four industries:",
    },
    {
      type: "list",
      style: "bullet",
      items: [
        { text: "Aerospace" },
        { text: "Automotive" },
        { text: "Industrial assembly" },
        { text: "Shipbuilding" },
      ],
    },
  ],
  keyTakeaways: [
    "Ergonomic, lightweight wrenches for narrow working areas",
    "Error-proofing identifies missing tightenings",
    "Standardised data integration makes each step traceable",
    "Short operator training times",
  ],
  neoLinks: [
    {
      label: "Assembly & Tightening",
      href: "/products?category=assembly-tightening",
      desc: "Electric, cordless and pneumatic nutrunners with controllers and software",
    },
    {
      label: "Process Improvement Software",
      href: "/products?category=process-software",
      desc: "Torque software, station guidance and production-data platforms",
    },
    {
      label: "Torque calibration",
      href: "/nsw#torque-calibration",
      desc: "Calibration and certification with documented, audit-ready torque reports",
    },
    {
      label: "Aerospace",
      href: "/industries/aerospace",
      desc: "Calibrated precision torque tools and documented process control",
    },
  ],
};
