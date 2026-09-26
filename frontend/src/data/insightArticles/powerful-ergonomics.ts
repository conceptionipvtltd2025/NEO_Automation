import type { InsightArticle } from "./types";

/**
 * "Powerful ergonomics!" — Atlas Copco Expert Hub article on how tool power
 * reduces exposure, with directly related points on power, weight, vibration
 * and exposure time from Atlas Copco's pocket guide The Art of Ergonomics.
 * Atlas Copco's knowledge, credited in text.
 */
export const powerfulErgonomics: InsightArticle = {
  id: "powerful-ergonomics",
  intro:
    "The idea that a powerful tool has to be big, heavy, noisy and full of vibration runs deep. Atlas Copco argues the reverse: power is the one ergonomic feature that cuts exposure to every other load at the same time.",
  body: [
    {
      type: "lead",
      text: "A tool without vibration can't be powerful — or so many power-tool users have long believed. In the early days of the modern power tool that was often true: the technology of the time, and little awareness of what daily use did to the body, meant nobody pressed for better-designed tools. Today far more is known about the health effects of tools that are heavy, noisy and vibrate a lot, and that knowledge has driven big gains in power while weight, noise and vibration are kept to a minimum.",
    },

    { type: "h2", text: "How power reduces exposure" },
    {
      type: "p",
      text: "A more powerful tool finishes the job sooner, so the operator spends less time on it — and less time exposed to noise, vibration, the tool's weight and other forces such as feed force. Atlas Copco's rule of thumb: twice the power, half the time to do the job.",
    },
    {
      type: "stats",
      items: [
        { value: "2× power", label: "Half the time to do the job" },
        { value: "< ½ the weight", label: "Today's small turbine grinders vs 1970s vertical grinders of the same power" },
        { value: "Up to 50%", label: "Weight taken out of vibration-damped percussive tools, with the power kept" },
        { value: "30–50% lighter", label: "GTG turbine grinders vs conventional grinders of similar power" },
      ],
    },
    {
      type: "callout",
      tone: "info",
      title: "The same logic applies to noise",
      text: "Daily noise exposure combines noise level and time. If a job can be done in half the time, a noise level 3 dB higher gives the same daily exposure — as long as the time saved is not spent on another equally noisy task.",
    },

    { type: "h2", text: "Turbine motors transformed the grinder" },
    {
      type: "p",
      text: "Turbine motors increased grinder power dramatically, and clever design with light-alloy materials kept the weight low. Atlas Copco's small turbine grinders now have the power its vertical grinders had in the 1970s, at less than half the weight and with significantly lower noise.",
    },
    {
      type: "p",
      text: "The Art of Ergonomics describes the GTG turbine grinders as the state of the art in vibration control: 30% to 50% lighter than conventional grinders of similar power, yet with considerably lower vibration, because every existing vibration-reducing technique went into the design:",
    },
    {
      type: "list",
      style: "check",
      items: [
        {
          title: "Smaller forces",
          text: "A spindle with a very stiff bearing arrangement, flanges machined to tight tolerances, and an autobalancer that automatically counterbalances any imbalance in the wheel.",
        },
        {
          title: "More inertia",
          text: "As much of the tool's mass as possible is used to resist vibration. The wheel guard is locked rigidly to the tool by the compressed-air pressure while the tool runs, and moves freely again when it stops.",
        },
        {
          title: "A short lever",
          text: "The distance between the wheel's unbalanced forces and the tool's centre of gravity is kept as small as possible.",
        },
      ],
    },
    {
      type: "p",
      text: "Vibration-isolated support handles were considered and rejected: vibration was already low, and the loss of manoeuvrability was judged a major disadvantage.",
    },

    { type: "h2", text: "Percussive tools: the power without the weight" },
    {
      type: "p",
      text: "Percussive tools have been known for high vibration for decades, and their power was tied directly to weight — a heavier hammer meant more power. When vibration exposure became a hot topic in the 1970s, Atlas Copco put a great deal of effort into cutting the vibration of its percussive tools, leading to breakthroughs in several vibration-reducing technologies. Vibration fell significantly, and weight fell too — sometimes by as much as 50% — while the power was kept. Today all of Atlas Copco's vibration-damped percussive tools are lighter, with much lower vibration, than conventional hammers of similar power.",
    },
    {
      type: "list",
      style: "bullet",
      items: [
        {
          title: "Chipping hammers",
          text: "A differential-piston mechanism keeps the air pressure acting on the handle almost constant, so vibration in the handle is very small.",
        },
        {
          title: "Riveting hammers",
          text: "An air cushion between a conventional percussive mechanism and the handle keeps the mechanism's vibration out of the handle while giving precise control of speed and feed force.",
        },
        {
          title: "Bucking bars",
          text: "Vibration-controlled bucking bars use the same damping system, and a riveting hammer and bucking bar tuned together give a quick, high-quality riveting process.",
        },
      ],
    },
    {
      type: "callout",
      tone: "warning",
      title: "Never hold the chisel",
      text: "The vibration generated in the chisel when the piston strikes it cannot be removed, so the chisel of a percussive tool should never be held.",
    },

    { type: "h2", text: "Choosing tools with power in mind" },
    {
      type: "p",
      text: "Weight is an ergonomic load in its own right: heavy tools put more strain on the wrist and make precision work harder, so every tool should have a high power-to-weight ratio. Size matters too — choose an impact wrench or pulse tool that is too small for the job and the tightening time rises sharply, and with it the exposure.",
    },
    {
      type: "quote",
      text: "When looking for tools with good ergonomics, don't forget to look at the power. The power is the only thing that can reduce the exposure time of all the ergonomic factors at the same time!",
      cite: "Atlas Copco, Powerful Ergonomics",
    },
  ],
  keyTakeaways: [
    "Twice the power, half the time on the tool",
    "Less time means less vibration, noise, weight and feed force",
    "Small turbine grinders: 1970s power at under half the weight",
    "Damped percussive tools up to 50% lighter, power kept",
    "Check the power-to-weight ratio, not just the vibration figure",
  ],
  neoLinks: [
    {
      label: "Material Removal Tools",
      href: "/products?category=material-removal",
      desc: "Grinders, sanders, drills and abrasives for cutting, deburring and finishing",
    },
    {
      label: "Air Line Accessories",
      href: "/products?category=air-line-accessories",
      desc: "Couplings, hoses, reels and FRL units that keep pneumatic tools at rated power",
    },
    {
      label: "Metal Fabrication",
      href: "/industries/metal-fabrication",
      desc: "High-productivity material removal and air line tools",
    },
    {
      label: "Vibration, explained",
      href: "/safety#vibration",
      desc: "The injuries behind HAVS and the new peak-vibration value",
    },
  ],
};
