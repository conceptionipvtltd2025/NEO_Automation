import type { InsightArticle } from "./types";

/**
 * Source: Atlas Copco Expert Hub product training, "Safety when Bolt
 * Tensioning" (a video with on-page checklists). The source page labels
 * several checklist groups "Bolt Protrusion"; they are regrouped here by what
 * each point is actually about. The presenter is deliberately not named.
 */
export const boltTensioningSafety: InsightArticle = {
  id: "bolt-tensioning-safety",
  intro:
    "Bolt tensioning is one of the most accurate ways to tighten a bolt, but only when it follows proper processes and procedures. These are the safety checks Atlas Copco's product training covers, from the first run-down to de-tensioning.",
  body: [
    {
      type: "lead",
      text: "Accuracy on a bolted joint depends on how the tensioner is used. In its product training on safe bolt tensioning, Atlas Copco walks through the key checks to make before, during and after the job: the bolt itself, the tool, the hoses and couplers, pressurisation, stroke limits and the de-tensioning sequence.",
    },

    { type: "h2", text: "Three checks to remember" },
    {
      type: "stats",
      items: [
        { value: "1× Ø", label: "Minimum bolt protrusion: at least one bolt diameter" },
        { value: "½ turn+", label: "Back-off of the puller bar or insert before de-tensioning" },
        { value: "MWP", label: "Check the tool's maximum working pressure" },
      ],
    },

    { type: "h2", text: "Preparing the bolt, the tool and the hoses" },
    {
      type: "p",
      text: "Several of the checks come before any pressure is applied:",
    },
    {
      type: "steps",
      items: [
        {
          title: "Check bolt protrusion",
          points: ["The bolt must protrude by at least 1× its own diameter."],
        },
        {
          title: "Match thread and tool",
          points: [
            "Make sure the diameter and thread are correct for both the tool and the joint.",
            "Check the marking on the tool against the specifications.",
          ],
        },
        {
          title: "Run down the puller bar carefully",
          points: [
            "Make sure the run-down of the tool does not rotate the bolt. If it does, thread engagement can drop below the minimum of 1× the bolt diameter.",
            "Do not use high-torque tools to run down the puller bar, as this can damage the bolt thread.",
          ],
        },
        {
          title: "Inspect hoses and couplers",
          points: [
            "Always leave a coupler at the end, rather than a nipple.",
            "Make sure the couplers are locked.",
            "Check the hose for cracks.",
            "Check the couplers: worn-out nipple and coupler sets can get stuck, which can make the release dangerous.",
          ],
        },
      ],
    },

    { type: "h2", text: "During pressurisation" },
    {
      type: "callout",
      tone: "warning",
      title: "Never stand in line of pressurisation",
      text: "Stay out of the line of pressurisation while the tensioner is being pressurised.",
    },
    {
      type: "list",
      style: "check",
      items: [
        { text: "Do not hold onto the coupler during pressurisation." },
        { text: "Do not hold the pressurised swivel, and try to avoid moving it." },
      ],
    },

    { type: "h2", text: "Respect the limits: couplers, stroke and torque" },
    {
      type: "list",
      style: "check",
      items: [
        {
          title: "Couplers",
          text: "Do not swap low-pressure couplers in for high-pressure ones. Check the maximum working pressure (MWP) of the tool, and never try to remove a coupler with a spanner.",
        },
        {
          title: "Max stroke indicator",
          text: "Watch the max stroke indicator to know when to stop. Over-stroking leads to oil leakage and damaged seals.",
        },
        {
          title: "Click wrench",
          text: "Use the click wrench correctly and do not push it past the set torque.",
        },
      ],
    },
    {
      type: "callout",
      tone: "info",
      title: "Over-stroke protection is not a licence to over-stroke",
      text: "Atlas Copco's WTB (Wind Tensioner) tools have over-stroke protection, but the max stroke indicator must still never be exceeded.",
    },

    { type: "h2", text: "De-tensioning without the tensioner sticking" },
    {
      type: "p",
      text: "Once the tool is mounted for de-tensioning, the puller bar or threaded insert needs to be backed off by just over half a turn to start with. This compensates for the relaxation of the joint and stops the tensioner getting stuck.",
    },
    {
      type: "callout",
      tone: "warning",
      title: "Allow for the back-off in the protrusion",
      text: "Account for that half turn when checking bolt protrusion, so that at least 1× the bolt diameter still remains.",
    },
  ],
  keyTakeaways: [
    "Bolt protrusion of at least 1× the bolt diameter",
    "Never stand in line of pressurisation",
    "Never swap low-pressure couplers for high-pressure ones",
    "Never exceed the max stroke indicator",
    "Back off just over half a turn before de-tensioning",
  ],
  neoLinks: [
    {
      label: "Hydraulic tools service",
      href: "/nsw#hydraulic-tools",
      desc: "Service and overhaul of bolt tensioners, torque wrenches and pumps",
    },
    {
      label: "Torque calibration",
      href: "/nsw#torque-calibration",
      desc: "Calibration and certification with documented, audit-ready torque reports",
    },
    {
      label: "Energy",
      href: "/industries/energy",
      desc: "Hydraulic bolt tensioning and torquing for oil & gas, power and wind",
    },
    {
      label: "Talk to Neo",
      href: "/inquiry",
      desc: "Send Neo an enquiry about bolting tools or service",
    },
  ],
};
