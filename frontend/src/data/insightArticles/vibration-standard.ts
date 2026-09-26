import type { InsightArticle } from "./types";

/**
 * Source: Atlas Copco Expert Hub, "New Vibration Standard: Shielding Against
 * Repeated Shocks" (10 April 2025). Table values are the article's own; its
 * comma decimals ("3,5") are written as points here.
 */
export const vibrationStandard: InsightArticle = {
  id: "vibration-standard",
  intro:
    "Two standards, ISO 5349-3 and ISO 28927, add a new value for the repeated shocks of percussive tools. Here is what it measures, how it changes the way tools compare and what it does not change.",
  body: [
    {
      type: "lead",
      text: "Safety and efficiency go hand in hand. As technology evolves, so must the practices and standards that keep operators safe and productive, and tools have to be safe for long-term use as well as effective. One aspect of tool safety now under closer scrutiny is shock vibration exposure: a hidden challenge that can seriously affect operator health and performance.",
    },

    { type: "h2", text: "Shaping the new standards" },
    {
      type: "p",
      text: "Dealing with vibration in dynamic manufacturing environments is complex but critical, and it takes more than new technology. It needs a clear understanding of the problems operators face on the line every day. With that in mind, Atlas Copco and other industry leaders have worked with the International Organization for Standardization (ISO) and the European Committee for Standardization (CEN).",
    },
    {
      type: "p",
      text: "At the heart of this work are ISO 5349-3 and ISO 28927 (Parts 1 to 13), standards designed to address the requirements of the EU Machinery Regulation and scheduled to apply from January 2027. They fill a critical gap in existing guidelines by accounting for the shock vibrations operators experience when using percussive tools.",
    },
    {
      type: "stats",
      items: [
        { value: "Jan 2027", label: "When the new value applies" },
        { value: "Parts 1–13", label: "Of ISO 28927, alongside ISO 5349-3" },
        { value: "Mandatory", label: "For the CE marking of handheld power tools" },
      ],
    },

    { type: "h2", text: "Why percussive tools need their own measure" },
    {
      type: "p",
      text: "According to certain scientific studies, vibrations from percussive tools are potentially more dangerous than those from rotary tools. Current standards do not fully account for the sudden, high-intensity amplitudes these tools produce. That can leave operators exposed to health risks even at lower vibration levels or shorter trigger times.",
    },
    {
      type: "callout",
      tone: "info",
      title: "What is Vibration Peak Magnitude (VPM)?",
      text: "VPM is the vibration peak magnitude: the mean value of the peak amplitude of the vibration. It gives a more precise way to assess the effect of intense, repeated shocks, so operators can be better protected.",
    },
    {
      type: "p",
      text: "The new value is more than another box to tick for compliance. It is meant as a relative scale that gives operators and employers a clearer way to compare tools and make well-informed decisions. With it, risk assessments should become more accurate and working environments safer. Atlas Copco sees the update as a chance to advance its ergonomic practices and step up its work on vibration-dampening techniques for percussive tools.",
    },
    {
      type: "image",
      src: "images/safety/insights/gallery/chisel-on-steel.jpg",
      alt: "The flat chisel of a pneumatic chipping hammer resting on a scored steel plate, with metal chips beside it",
      caption:
        "A chipping hammer is a percussive tool, the kind whose repeated shocks the new VPM value is designed to capture.",
    },

    { type: "h2", text: "Old metric and new: five tools compared" },
    {
      type: "p",
      text: "Atlas Copco's article sets five handheld power tools side by side under both metrics. The hand-arm vibration exposure value (HAV) is the traditional vibration measurement. The VPM value is the newer metric, which takes account of the cumulative effect of repeated shocks.",
    },
    { type: "vpm-chart" },
    {
      type: "table",
      caption: "Vibration values per machine type (source: Atlas Copco)",
      head: [
        "Machine type",
        "Hand-arm vibration exposure value (m/s²)",
        "Vibration peak magnitude value (m/s²)",
      ],
      rows: [
        ["Pneumatic grinder", "3.5", "90"],
        ["Impulse nutrunner", "3.3", "220"],
        ["Vibration-damped chipping hammer", "5.0", "260"],
        ["Impact nutrunner", "5.0", "650"],
        ["Conventional chipping hammer", "6.1", "1,700"],
      ],
    },
    {
      type: "p",
      text: "The VPM value puts much more weight on the repeated shocks of percussive tools. Three pairs from the table show the difference:",
    },
    {
      type: "list",
      style: "number",
      items: [
        {
          title: "Similar HAV, very different VPM",
          text: "The impulse nutrunner and the pneumatic grinder are close on HAV (3.3 m/s² and 3.5 m/s²). Once repeated shocks are counted, the impulse nutrunner exposes the operator to much higher vibration (220 m/s² VPM against 90 m/s²).",
        },
        {
          title: "Identical HAV, sharply different VPM",
          text: "The vibration-damped chipping hammer and the impact nutrunner share the same HAV of 5.0 m/s², but their VPM values are 260 m/s² and 650 m/s².",
        },
        {
          title: "Different HAV, similar VPM",
          text: "The other way round, the impulse nutrunner and the vibration-damped chipping hammer have VPM values in a similar range (220 m/s² and 260 m/s²) despite different HAV values (3.3 m/s² and 5.0 m/s²).",
        },
      ],
    },
    {
      type: "callout",
      tone: "success",
      title: "Look at both numbers",
      text: "These differences show why both metrics should be considered when tools are evaluated. Together they give a more accurate picture of a tool's effect on operator safety and performance.",
    },

    { type: "h2", text: "FAQs: understanding the new vibration declaration value" },
    {
      type: "faq",
      items: [
        {
          q: "When will the new value be introduced?",
          a: "It is set to be implemented in January 2027, and it is mandatory for the CE marking of handheld power tools.",
        },
        {
          q: "Will this be mandated globally?",
          a: "For now it is EU legislation, but it is intended to influence industry standards worldwide.",
        },
        {
          q: "Is the 2.5 m/s² A(8) value still relevant?",
          a: "Yes. The 2.5 m/s² A(8) action value remains relevant. The new vibration declaration value serves as a metric for comparing tools.",
        },
        {
          q: "Which tools will be most affected by the new standard?",
          a: "All handheld power tools will be given the new vibration declaration value, so they can be evaluated consistently.",
        },
        {
          q: "Does the new value change recommended tool operating times?",
          a: "No. The new value does not set safe operating times. It is intended for comparing tools.",
        },
        {
          q: "How can operators reduce their exposure to harmful vibration?",
          a: "Atlas Copco refers operators to its pocket guide on vibration, which explains how to assess and manage vibration exposure. The guide is also summarised among the safety insights on this site.",
        },
      ],
    },

    { type: "h2", text: "Atlas Copco's focus on ergonomics" },
    {
      type: "p",
      text: "Atlas Copco describes its commitment as going beyond meeting new standards. It keeps researching and refining its products so that customers can give their teams safer, more comfortable working conditions. Its stated aim is not just to adapt to change but to drive it.",
    },
  ],
  keyTakeaways: [
    "ISO 5349-3 and ISO 28927 add a Vibration Peak Magnitude (VPM) value",
    "Applies from January 2027; mandatory for CE marking of handheld power tools",
    "VPM captures repeated shocks that the HAV figure can miss",
    "Tools with the same HAV can differ sharply in VPM",
    "The 2.5 m/s² A(8) action value still applies",
  ],
  neoLinks: [
    {
      label: "Vibration, explained",
      href: "/safety#vibration",
      desc: "The HAV and VPM comparison and the three HAVS injuries",
    },
    {
      label: "Material Removal Tools",
      href: "/products?category=material-removal",
      desc: "Grinders, sanders, drills and abrasives for cutting, deburring and finishing",
    },
    {
      label: "Assembly & Tightening",
      href: "/products?category=assembly-tightening",
      desc: "Electric, cordless and pneumatic nutrunners with controllers and software",
    },
    {
      label: "Talk to Neo",
      href: "/inquiry",
      desc: "Send Neo an enquiry about tools for your line",
    },
  ],
};
