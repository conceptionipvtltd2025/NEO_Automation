import type { InsightArticle } from "./types";

/**
 * Atlas Copco Expert Hub article, "Powering wind with Smart Bolting"
 * (3 March 2026), rewritten in the third person.
 */
export const windSmartBolting: InsightArticle = {
  id: "wind-smart-bolting",
  intro:
    "Larger turbines and offshore growth have made every bolted joint a question of reliability. Atlas Copco explains how smart bolting — guided, monitored and traceable — is moving from the factory floor into the field.",
  body: [
    {
      type: "lead",
      text: "The wind industry is picking up speed. Larger turbines and expanding offshore installations mean every detail carries more weight, above all the thousands of critical bolted joints that hold the structure together.",
    },
    {
      type: "p",
      text: "As expectations rise for quality control, operational safety and predictable performance, fastening can no longer be treated as routine. It has become a central lever for reliability, and that is speeding up the move towards smarter bolting solutions that pair mechanical performance with digital insight and full traceability.",
    },
    { type: "h2", text: "Shaping wind with smart bolting" },
    {
      type: "p",
      text: "Wind work happens in demanding conditions. Harsh weather, working at height and tight timelines all add constant pressure, and traditional manual documentation leaves little room for error. Smart bolting tackles this by reducing human error and strengthening process reliability.",
    },
    {
      type: "image",
      src: "images/safety/insights/gallery/wind-rope-access.jpg",
      alt: "Two rope-access technicians in harnesses working on the outside of a white wind turbine tower against a clear blue sky",
      caption:
        "Harsh weather, height and tight timelines: the conditions every field bolting job has to contend with.",
    },
    {
      type: "steps",
      items: [
        {
          title: "Guide",
          points: [
            "Tools lead the operator through the job step by step",
            "Each step is captured with digital traceability",
          ],
        },
        {
          title: "Monitor",
          points: ["Tightening performance is monitored in real time"],
        },
        {
          title: "Flag",
          points: [
            "Joint or bolt deviations are flagged as they happen",
            "Issues are identified earlier",
          ],
        },
      ],
    },
    {
      type: "list",
      style: "check",
      items: [
        { text: "Unnecessary site visits can be avoided." },
        { text: "Bolting in the field becomes more controlled." },
        { text: "The work becomes more ergonomic for the technician." },
      ],
    },
    { type: "h2", text: "Better for performance, and for sustainability" },
    {
      type: "p",
      text: "Sustainability is another driver of the shift. Greater efficiency reduces rework and extends maintenance cycles, which supports more responsible operations. Ergonomics, energy efficiency and long-term durability are now shaping product design as well.",
    },
    {
      type: "list",
      style: "bullet",
      items: [
        {
          title: "Fewer inspections",
          text: "Digital capabilities reduce redundant inspections.",
        },
        { title: "Less waste", text: "They help limit material waste." },
        {
          title: "Smarter servicing",
          text: "They help optimise service intervals.",
        },
      ],
    },
    {
      type: "callout",
      tone: "success",
      title: "Two roles in one",
      text: "Smart bolting is both a performance enabler and a contributor to more sustainable wind operations.",
    },
    { type: "h2", text: "Atlas Copco: built for the field" },
    {
      type: "p",
      text: "Atlas Copco has long supported manufacturing industries with intelligent tightening systems built around precision, error-proofing and traceability. As wind turbine production increasingly adopts those standards, the question is no longer whether digital control belongs in the process, but how to extend it beyond the factory floor without sacrificing quality. Wind environments bring different constraints, and they call for solutions tailored to those conditions.",
    },
    {
      type: "list",
      style: "bullet",
      items: [
        {
          title: "The traditional field kit",
          text: "Hydraulic torque wrenches and tensioners, specified early in turbine design, have long been the mainstay of field operations.",
        },
        {
          title: "Gaining ground",
          text: "Electric nutrunners and battery-powered tools, valued for their speed and flexibility on site.",
        },
        {
          title: "Smart Field",
          text: "Atlas Copco's response: a portfolio broadened to cover the full range of major bolting technologies, backed by engineering expertise for customised solutions tailored to specific turbine layouts.",
        },
      ],
    },
    {
      type: "image",
      src: "images/safety/insights/gallery/wind-smart-field.jpg",
      alt: "Illustration of two technicians in yellow workwear inside a glowing wind turbine tower section, surrounded by bolting pumps, tools and data lines",
      caption:
        "Smart Field takes the smart factory to the field, while Atlas Copco's Smart Bolting brings bolt tensioning, hydraulic torque and continuous rotation into one smart, connected ecosystem.",
    },
    { type: "h2", text: "In focus: the Tensor Revo electric nutrunner" },
    {
      type: "p",
      text: "One standout innovation is the Tensor Revo electric nutrunner, which delivers high-speed tightening with integrated accuracy.",
    },
    {
      type: "list",
      style: "check",
      items: [
        {
          title: "Holds its programmed speed",
          text: "The tool maintains its programmed speed throughout tightening, which supports fast bolting during tower construction, when crane time is limited and weather windows are short.",
        },
        {
          title: "Built to last",
          text: "A redesigned drive unit with a more robust housing reflects a clear focus on durability in the field.",
        },
        {
          title: "Simple to use",
          text: "A simplified interface puts the emphasis on usability on site.",
        },
      ],
    },
    {
      type: "quote",
      text: "Smart bolting: quicker, safer, smarter.",
      cite: "Atlas Copco",
    },
    { type: "h2", text: "The future of smarter wind bolting" },
    {
      type: "p",
      text: "As offshore wind accelerates globally, demand for advanced bolting technologies will keep growing. With a strong focus on innovation, Atlas Copco aims to support safer, smarter and more efficient bolting across the wind sector, from turbine construction and assembly to servicing.",
    },
    {
      type: "image",
      src: "images/safety/insights/gallery/wind-farm.jpg",
      alt: "A row of white wind turbines on a hillside under a bright blue sky with scattered clouds",
      caption:
        "From turbine construction and assembly to servicing, smart bolting has a part to play across the wind sector.",
    },
  ],
  keyTakeaways: [
    "Thousands of critical bolted joints hold the structure together",
    "Step-by-step guidance, real-time monitoring",
    "Deviations flagged as they happen",
    "Fewer site visits, less rework and waste",
    "Tensor Revo holds its programmed speed",
  ],
  neoLinks: [
    {
      label: "Energy",
      href: "/industries/energy",
      desc: "Hydraulic bolt tensioning, high-torque wrenches and field-service kits for power and wind.",
    },
    {
      label: "Assembly & Tightening",
      href: "/products?category=assembly-tightening",
      desc: "Electric, cordless and pneumatic nutrunners with controllers and torque-angle traceability.",
    },
    {
      label: "Hydraulic tool service",
      href: "/nsw#hydraulic-tools",
      desc: "Service of torque wrenches, tensioners and pumps, with pressure testing and re-certification.",
    },
  ],
};
