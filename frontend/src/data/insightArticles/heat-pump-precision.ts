import type { InsightArticle } from "./types";

/**
 * Atlas Copco Expert Hub case study, "Driving precision under pressure in heat
 * pump manufacturing" (22 June 2026), rewritten in the third person. "PCD" is
 * kept as the source writes it; the source never expands it.
 */
export const heatPumpPrecision: InsightArticle = {
  id: "heat-pump-precision",
  intro:
    "An Atlas Copco case study: how a leading German heat pump manufacturer met a tight cycle time and a hard-to-reach joint with a fully automated tightening cell, without trading quality for speed.",
  body: [
    {
      type: "lead",
      text: "Heat pump manufacturing comes down to two priorities: productivity and quality. With demand resurging globally, manufacturers are under constant pressure to raise output without letting quality slip, which leaves production lines so tightly optimised that every second counts and cycle times are pushed to their limits.",
    },
    {
      type: "image",
      src: "images/safety/insights/gallery/heat-pump-home.jpg",
      alt: "A modern house with a heat pump unit standing on a patio outside, lit by low morning sun",
      caption:
        "As demand for heat pumps resurges, the lines that build them run at the limit of their cycle times.",
    },
    { type: "h2", text: "The situation" },
    {
      type: "p",
      text: "Heat pump assembly is far from simple. Complex designs, enclosed housings and multiple fastening points create accessibility problems that make consistent, high-quality tightening difficult, especially at high line speeds.",
    },
    {
      type: "p",
      text: "That was the position of a leading heat pump manufacturer in Germany. Atlas Copco worked alongside the customer with a clear brief: ease the assembly process while protecting both quality and efficiency.",
    },
    { type: "h2", text: "Challenges identified" },
    {
      type: "p",
      text: "Atlas Copco's review of the customer's heat pump assembly centred on three critical areas.",
    },
    {
      type: "list",
      style: "number",
      items: [
        {
          title: "Tight cycle times",
          text: "The PCD assembly ran on a tight cycle time. In such a narrow window even minor disruptions hit throughput and overall efficiency directly, and operators were under pressure to keep pace with production without sacrificing quality.",
        },
        {
          title: "Accessibility constraints",
          text: "One joint on the PCD was particularly difficult to reach. Screws were occasionally dropped inside the product, which then had to be disassembled, adding to the tightening time.",
        },
        {
          title: "Rework and quality risks",
          text: "Every dropped screw or tightening deviation meant extra corrective work. In a high-productivity industry, repeated rework quickly becomes costly and, at worst, can bring the entire line to a stop.",
        },
      ],
    },
    {
      type: "callout",
      tone: "warning",
      title: "The cost of one dropped screw",
      text: "One dropped screw inside the product means disassembly, a longer tightening time and extra corrective work, on a cycle time that was already tight.",
    },
    {
      type: "image",
      src: "images/safety/insights/gallery/heat-pump-service.jpg",
      alt: "A technician in a cap and work gloves crouching beside an outdoor heat pump unit, a tool bag at his side",
    },
    { type: "h2", text: "Atlas Copco's tailored solution" },
    {
      type: "p",
      text: "To work within these constraints, Atlas Copco introduced a fully automated cell built around its vacuum tightening module. Automation removed the variability that comes with manual access to an awkward joint, so the system could handle even the most challenging joints with reliable, consistent precision.",
    },
    {
      type: "list",
      style: "check",
      items: [
        {
          title: "No more dropped screws",
          text: "Automation removed the risk of dropped screws, and with it the production setbacks they trigger.",
        },
        {
          title: "Error-proofed tightening",
          text: "The built-in error proofing of Atlas Copco's smart tightening tools meant every fastening met specification from the outset.",
        },
        {
          title: "Less rework, lower cost",
          text: "With joints right first time, rework and the costs tied to it were reduced.",
        },
      ],
    },
    {
      type: "quote",
      text: "Get it right the first time, every time.",
      cite: "Atlas Copco",
    },
    {
      type: "table",
      caption: "How the automated cell answered each challenge",
      head: ["Challenge", "Effect on the line", "How it was addressed"],
      rows: [
        [
          "Tight cycle times",
          "Minor disruptions cut throughput and put operators under pressure",
          "Greater speed from the fully automated cell",
        ],
        [
          "Hard-to-reach joint",
          "Occasional dropped screws, disassembly and longer tightening time",
          "The vacuum tightening module handles the joint with consistent precision, removing the risk of dropped screws",
        ],
        [
          "Rework and quality risks",
          "Costly corrective actions and, at worst, a stopped line",
          "Error-proofed smart tools meet specification from the outset",
        ],
      ],
    },
    { type: "h2", text: "Bringing assembly into the smart factory" },
    {
      type: "p",
      text: "Atlas Copco sums up the outcome in three phrases: greater speed, improved precision and minimised rework. By bringing assembly into the smart factory, it put in place a holistic ecosystem of smart tools and solutions that supported and elevated the customer's manufacturing.",
    },
    { type: "h2", text: "Guaranteeing quality and productivity" },
    {
      type: "p",
      text: "In heat pump manufacturing, quality and productivity move in step. By understanding the real constraints on the production line and designing the solution around them, Atlas Copco helped its customer strengthen both at once.",
    },
    {
      type: "callout",
      tone: "success",
      title: "The result",
      text: "A fully automated cell that handles the most challenging joint with consistent precision, with no risk of dropped screws and less rework, so the line stays steady when demand heats up.",
    },
  ],
  keyTakeaways: [
    "A leading heat pump maker in Germany",
    "A hard-to-reach joint caused dropped screws",
    "Automated cell with a vacuum tightening module",
    "Error-proofed tools: right first time",
    "Greater speed, less rework and cost",
  ],
  neoLinks: [
    {
      label: "Assembly & Tightening",
      href: "/products?category=assembly-tightening",
      desc: "Electric, cordless and pneumatic nutrunners with controllers and torque-angle traceability.",
    },
    {
      label: "Sockets, Fixtures & SPM",
      href: "/products?category=sockets-fixtures-spm",
      desc: "Custom sockets, multi-spindle heads, reaction fixtures and special purpose machines.",
    },
    {
      label: "Process software",
      href: "/products?category=process-software",
      desc: "Torque software, station guidance and production-data platforms.",
    },
    {
      label: "Home Appliances",
      href: "/industries/home-appliances",
      desc: "Cordless tightening, riveting and inline error-proofing for high-volume lines.",
    },
  ],
};
