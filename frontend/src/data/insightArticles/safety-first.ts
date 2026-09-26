import type { InsightArticle } from "./types";

/**
 * "Safety first. A sound business priority with simply no bad vibes." — the
 * Atlas Copco Expert Hub safety overview, with supporting context from Atlas
 * Copco's pocket guide The Art of Ergonomics. Atlas Copco's knowledge,
 * credited in text; nothing here is Neo's own claim.
 */
export const safetyFirst: InsightArticle = {
  id: "safety-first",
  intro:
    "Noise and vibration put operators under physical strain on every shift. Atlas Copco's answer is ergonomics designed into the tool itself — thinking its ergonomics programme has followed since 1958.",
  body: [
    {
      type: "lead",
      text: "A manufacturing plant can be a hazardous place for an operator. Noise and vibration from the tools on the factory floor add physical strain that does not need to be there. And when safety is compromised and accidents follow, productivity and quality on the assembly line suffer too — quite apart from the personal tragedy for the individual.",
    },

    { type: "h2", text: "What vibration does to the hand and arm" },
    {
      type: "p",
      text: "Long-term exposure to vibrating handheld tools can, if it is not controlled, damage nerve cells, injure blood vessels and cause a range of musculoskeletal disorders. Atlas Copco's pocket guide The Art of Ergonomics describes the three effects:",
    },
    {
      type: "list",
      style: "bullet",
      items: [
        {
          title: "Blood vessels",
          text: "The arteries in the fingers thicken and the flow area for blood shrinks. In the cold, the affected fingers lose sensation and turn white — vibration-induced white finger.",
        },
        {
          title: "Nerves",
          text: "Damaged nerve cells mean lost sensitivity in the fingers. Early damage may be reversible, but prolonged exposure makes it permanent, and everyday tasks such as buttoning a shirt or picking up coins become difficult.",
        },
        {
          title: "Bones and joints",
          text: "Tools that need high feed forces pass vibration through the hand and arm, causing wear and even fracturing at the joints.",
        },
      ],
    },

    { type: "h2", text: "What noise does to people" },
    {
      type: "p",
      text: "High sound levels are present in many manufacturing processes. Depending on how serious the problem is, they bring stress and fatigue or even occupational hearing loss — one of the most common work-related disorders in industry. Continued exposure destroys the sound-sensitive hair cells of the inner ear, and because hearing is one of the brain's main senses, even relatively low noise levels can distract, leading to loss of concentration and fatigue.",
    },
    {
      type: "callout",
      tone: "warning",
      title: "Why impulse noise is worse",
      text: "The ear can partly protect itself by damping the movement of the bones in the middle ear, but that reflex takes about 0.04 seconds to act. That is why impulse noise from tools such as impact wrenches and riveting hammers can be particularly damaging.",
    },
    {
      type: "table",
      caption: "EU noise exposure values, Directive 2003/10/EC",
      head: ["Value", "8-hour dose", "Peak", "Employer's duty"],
      rows: [
        ["Lower action value", "80 dB(A)", "135 dB(C)", "Make hearing protectors available"],
        ["Upper action value", "85 dB(A)", "137 dB(C)", "Hearing protectors must be used"],
        [
          "Limit value",
          "87 dB(A)",
          "140 dB(C)",
          "Never exceeded, taking the protectors' attenuation into account",
        ],
      ],
    },

    { type: "h2", text: "A business priority, not only a welfare one" },
    {
      type: "p",
      text: "More and more companies realise that work-related disorders cost a lot of money — not only to rehabilitate the people injured, but in lost productivity and in quality problems at workstations with poor ergonomics. Published studies indicate that these costs are often several times greater than the direct cost of rehabilitation, so good ergonomic design of workplaces and tools can save a company a great deal.",
    },
    {
      type: "p",
      text: "Workstations and working practices should therefore be designed so that operators are not exposed to unnecessary physical load, noise, vibration and dust. Handheld tools matter most of all, because they form the direct link between the operator and the process.",
    },
    {
      type: "quote",
      text: "Operator safety is a key factor in modern day industrial manufacturing.",
      cite: "Atlas Copco Expert Hub",
    },

    { type: "h2", text: "Ergonomics designed into the tool" },
    {
      type: "p",
      text: "The answer to these and other common safety risks in industrial manufacturing is more ergonomic solutions on the factory floor. Atlas Copco's commitment to ergonomics is as strong today as when its ergonomics programme was established in 1958. Its tools are developed, for example, to reduce vibration exposure by isolating vibration from the surfaces the operator grips, and to cut heavy noise emissions — so that, whatever the tool, its design looks after the person using it.",
    },
    {
      type: "p",
      text: "Vibration always starts with oscillating forces acting on the tool, which leads to three basic principles for controlling it:",
    },
    {
      type: "list",
      style: "number",
      items: [
        {
          title: "Control the size of the forces",
          text: "For example, the autobalancer on a grinder or the differential piston in a chipping hammer.",
        },
        {
          title: "Make the tool less sensitive to them",
          text: "For example, rigidly connecting the mass of a grinder's guard to the tool to increase its inertia.",
        },
        {
          title: "Isolate the vibration from the grip",
          text: "For example, vibration-damping handles on grinders, the air spring behind the blow mechanism in a riveting hammer, or the mass-spring system in a chipping hammer.",
        },
      ],
    },
    {
      type: "image",
      src: "images/safety/insights/powerful-ergonomics.jpg",
      alt: "An Atlas Copco pneumatic chipping hammer with a yellow bow handle and a chisel fitted",
      caption:
        "A bow handle transmits high feed force without twisting the wrist, which makes it the shape The Art of Ergonomics recommends for chipping hammers.",
      fit: "contain",
    },
    {
      type: "p",
      text: "The guide's methods for cutting noise include:",
    },
    {
      type: "list",
      style: "check",
      items: [
        {
          title: "Pipe the exhaust away",
          text: "A simple but very effective way to cut air-flow noise is to lead the exhaust air away from the working area.",
        },
        {
          title: "Silence it",
          text: "A silencer in the exhaust smooths the pulsating air flow; a two-stage silencer reaches very low noise levels.",
        },
        {
          title: "Change the mechanism",
          text: "A hydraulic impulse unit in place of an impact wrench's mechanical impact mechanism gives a smoother torque pulse and much lower process noise.",
        },
        {
          title: "Separate what cannot be quietened",
          text: "Process noise from grinding, riveting and chipping is very hard to reduce, so these processes are best isolated from the rest of the factory, with ear protection for the operators working there.",
        },
      ],
    },

    { type: "h2", text: "Nine insights, three themes" },
    {
      type: "p",
      text: "Atlas Copco shares its insights, experience and knowledge to help manufacturers run their processes in a safer, more operator-friendly way. Nine of its Expert Hub pieces each have their own page here, grouped by theme.",
    },
    { type: "h3", text: "Vibration & ergonomics" },
    {
      type: "list",
      style: "bullet",
      items: [
        {
          title: "New Vibration Standard: Shielding Against Repeated Shocks",
          text: "The Vibration Peak Magnitude value that ISO 5349-3 and ISO 28927 add for the repeated shocks of percussive tools.",
        },
        {
          title: "Hand-Arm Vibration Syndrome: learn about 3 related injuries",
          text: "The vascular, nerve and musculoskeletal injuries behind HAVS, what they cost and how to prevent them.",
        },
        {
          title: "Vibration exposure assessment for industrial power tools",
          text: "A pocket guide to estimating and managing an operator's daily exposure, A(8), under Directive 2002/44/EC.",
        },
        {
          title: "Powerful Ergonomics",
          text: "Why more power is an ergonomic feature: less time on the tool means less exposure to every load.",
        },
      ],
    },
    { type: "h3", text: "Bolting" },
    {
      type: "list",
      style: "bullet",
      items: [
        {
          title: "Powering Wind with Smart Bolting",
          text: "Guided, monitored bolting for bigger turbines and ergonomic work at height.",
        },
        {
          title: "Safety when Bolt Tensioning",
          text: "The checks that keep hydraulic bolt tensioning safe, from bolt protrusion to de-tensioning.",
        },
      ],
    },
    { type: "h3", text: "Smart assembly & data" },
    {
      type: "list",
      style: "bullet",
      items: [
        {
          title: "Driving precision under pressure in heat pump manufacturing",
          text: "How an automated, error-proofed cell ended dropped screws for a German heat pump maker.",
        },
        {
          title: "Smart Assembly Technology for Modern Defence Manufacturing",
          text: "Zero-defect, traceable assembly of defence electronics, often in confined spaces.",
        },
        {
          title:
            "Experience a new level of data integration with the Atlas Copco Mechatronic System",
          text: "Ergonomic mechatronic wrenches with error-proofing and traceable data for safety-critical joints.",
        },
      ],
    },
  ],
  keyTakeaways: [
    "Vibration harms blood vessels, nerves and joints",
    "Noise brings stress, fatigue and hearing loss",
    "Poor ergonomics costs productivity and quality",
    "Atlas Copco's ergonomics programme dates from 1958",
    "Control vibration and noise at the source",
  ],
  neoLinks: [
    {
      label: "Hazards & controls",
      href: "/safety#hazards",
      desc: "Seven workstation hazards and the equipment that controls each one",
    },
    {
      label: "Vibration, explained",
      href: "/safety#vibration",
      desc: "The injuries behind HAVS and the new peak-vibration value",
    },
    {
      label: "Material Removal Tools",
      href: "/products?category=material-removal",
      desc: "Grinders, sanders, drills and abrasives for cutting, deburring and finishing",
    },
  ],
};
