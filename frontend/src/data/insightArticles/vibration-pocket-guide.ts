import type { InsightArticle } from "./types";

/**
 * "Vibration exposure assessment for industrial power tools" — Atlas Copco's
 * pocket guide based on the Physical Agents (Vibration) Directive 2002/44/EC.
 * Every number is the guide's own. Atlas Copco's knowledge, credited in text.
 */
export const vibrationPocketGuide: InsightArticle = {
  id: "vibration-pocket-guide",
  intro:
    "Atlas Copco's pocket guide for employers whose people use vibrating handheld power tools: what the EU Physical Agents (Vibration) Directive 2002/44/EC requires, and a practical way to estimate and reduce each operator's daily exposure, A(8).",
  body: [
    {
      type: "lead",
      text: "In July 2002 the European Union published Directive 2002/44/EC, the Physical Agents (Vibration) Directive, or PA(V)D. It sets action and limit values for vibration exposure and describes the employer's duty to manage the risk; national regulations based on it have been in force since 6 July 2005. Atlas Copco's guide explains what they require, how to estimate vibration and exposure time, and how to bring exposure down.",
    },
    {
      type: "p",
      text: "The scale of the problem explains why the Directive exists. The proposal for the UK regulation estimated that:",
    },
    {
      type: "stats",
      items: [
        { value: "5 million", label: "People in Britain regularly exposed to hand-arm vibration at work" },
        { value: "2 million", label: "Of them at risk of developing disease" },
        { value: "800,000", label: "With some symptoms of vibration white finger (1999 survey)" },
        { value: "300,000", label: "Of those with advanced symptoms" },
      ],
    },

    { type: "h2", text: "Three vibration values — know the difference" },
    {
      type: "list",
      style: "number",
      items: [
        {
          title: "Declared vibration value",
          text: "The figure every tool sold in the EU must carry, measured under repeatable laboratory conditions so tools can be compared: to the ISO 28927 series for pneumatic tools since 2010 (ISO 8662 before that) and the EN 60745 series for electric tools. It is not the same as vibration measured in a workplace.",
        },
        {
          title: "In-use vibration",
          text: "What the operator actually experiences in a real task. It varies a great deal and depends on the tool, the type, condition and quality of the inserted tool, maintenance, the workpiece, and the operator's posture, technique and physique. An assessment needs its average over the task.",
        },
        {
          title: "Daily exposure, A(8)",
          text: "The rms average of in-use vibration over the whole eight-hour working day, including breaks and non-vibrating work.",
        },
      ],
    },
    {
      type: "callout",
      tone: "warning",
      title: "Why not simply measure?",
      text: "The Directive requires exposure to be assessed to ISO 5349-1 and, where necessary, measured to ISO 5349-2. Such workplace measurements are costly and time-consuming, and carry an uncertainty of 20% to 40% — in some cases more.",
    },

    { type: "h2", text: "The Directive in brief" },
    {
      type: "stats",
      items: [
        { value: "2.5 m/s²", label: "Exposure action value, A(8)" },
        { value: "5 m/s²", label: "Exposure limit value, A(8)" },
        { value: "6 July 2005", label: "National regulations in force" },
      ],
    },
    {
      type: "p",
      text: "Above the action value, the employer must start an action plan to reduce exposure, with health surveillance built in. The limit value may not be exceeded. Where there is likely to be a risk, the Directive requires employers to:",
    },
    {
      type: "list",
      style: "check",
      items: [
        { text: "Reduce exposure to a minimum (Article 5.1)" },
        { text: "Assess the risks (Article 4.1)" },
        { text: "Carry out a programme of measures to reduce them (Article 5.2)" },
        { text: "Keep exposure below the limit value (Article 5.3)" },
        { text: "Give information and training on the risks and their control (Article 6)" },
        { text: "Provide health surveillance once exposure reaches the action value (Article 8)" },
      ],
    },

    { type: "h2", text: "What the employer is expected to do" },
    {
      type: "p",
      text: "The employer is expected to know every employee's exposure and to act on it. The assessment must cover everyone who might be at risk, at least far enough to show they are below the action value — the simplest is a document stating that an operator is probably not at risk. The UK regulations say a suitable risk assessment covers:",
    },
    {
      type: "list",
      style: "bullet",
      items: [
        { text: "When an employee is exposed to risk from vibration." },
        { text: "A soundly based estimate of exposure, compared with the action and limit values." },
        { text: "The measures that can reduce the risk." },
        { text: "Other information needed for an action plan." },
      ],
    },
    {
      type: "p",
      text: "Assessments are kept for later reference. Above the action value, an action plan with measures, a timetable and medical surveillance must be drawn up, kept up to date and filed. If the limit value is exceeded, the employer must cut exposure immediately, find out why and stop it happening again.",
    },

    { type: "h2", text: "A three-step workflow to manage the risk" },
    {
      type: "p",
      text: "Where vibration disorders are already reported, the first action is obvious: reduce the risk there. For every other workstation, the guide proposes three steps.",
    },
    {
      type: "steps",
      items: [
        {
          title: "Find the operators at low risk",
          points: [
            "Exclude those most probably well below the 2.5 m/s² action value — provided low-vibration tools are used normally and not mixed with higher-vibration ones.",
            "From Atlas Copco's experience: angle nutrunners, screwdrivers and pistol-grip nutrunners without extensions (not slip-clutch screwdrivers), and non-hammering drills with standard bits.",
            "Pistol-grip impulse nutrunners for bolts up to M10, with good sockets, no extensions, the correct tool size and fewer than 1,000 bolts a day — only if the socket is never held.",
            "Short exposures allow more vibration: under 30 minutes, 10 m/s² before the action value and 20 m/s² before the limit; under 10 minutes, 17 and 35 m/s².",
          ],
        },
        {
          title: "Make a rough exposure assessment",
          points: [
            "Estimate in-use vibration on the safe side. Declared values to ISO 28927 or EN 60745 can be used as they are; single-axis ISO 8662 values (tools made before 1 January 2010) need CEN/TR 15350 correction factors.",
            "Estimate trigger time — only when the tool is actually running. Operators tend to overestimate it, so measuring is often better.",
            "Calculate the exposure, combining every tool used in the shift.",
          ],
        },
        {
          title: "Manage the risk",
          points: [
            "Close to or above the action value? Atlas Copco's experience is that acting on the rough estimate is usually more cost-effective than paying for a workplace measurement.",
            "Four levers: lower-vibration tools or processes, faster ones, an installation that lets the tool work at full effect, and job rotation.",
          ],
        },
      ],
    },

    { type: "h2", text: "Estimating daily exposure" },
    {
      type: "p",
      text: "A(8) = ahv × √(T ÷ T0), where ahv is the in-use vibration value, T the actual exposure time and T0 the eight-hour (480-minute) day. Exposure rises in step with vibration but only with the square root of time, so the permitted trigger time shrinks fast:",
    },
    {
      type: "table",
      caption: "Maximum daily exposure time before each value is exceeded.",
      head: ["In-use vibration", "Action value (2.5 m/s²)", "Limit value (5 m/s²)"],
      rows: [
        ["1.8 m/s²", "15 h", "62 h"],
        ["2.5 m/s²", "8 h", "32 h"],
        ["3.5 m/s²", "4 h", "16 h"],
        ["5 m/s²", "2 h", "8 h"],
        ["7 m/s²", "1 h", "4 h"],
        ["10 m/s²", "30 min", "2 h"],
        ["14 m/s²", "15 min", "1 h"],
        ["20 m/s²", "8 min", "30 min"],
      ],
    },
    {
      type: "p",
      text: "Trigger time can be estimated from wheels or discs used per shift multiplied by the life of each, from time per bolt multiplied by bolts per shift, or with a stopwatch study over a representative period. The guide's averages vary widely, so measure the real situation whenever possible:",
    },
    {
      type: "table",
      caption: "Average trigger time per shift by tool type.",
      head: ["Tool type", "Hours per day", "Spread (± hours)"],
      rows: [
        ["Grinders", "3", "1.5"],
        ["Drills", "1", "0.5"],
        ["Chipping hammers", "2", "1.5"],
        ["Riveters", "1", "0.5"],
        ["Screwdrivers", "2", "1"],
        ["Impact wrenches", "1", "0.5"],
        ["Impulse nutrunners", "2", "1"],
        ["Angle nutrunners", "2", "1"],
        ["Stall torque nutrunners", "1", "0.5"],
      ],
    },
    { type: "h3", text: "The point system" },
    {
      type: "p",
      text: "For operators who use several tools, each tool or process scores exposure points, PE = (ahv ÷ 2.5)² × (T ÷ 8 h) × 100, and the day's total is the sum:",
    },
    {
      type: "list",
      style: "check",
      items: [
        { title: "Under 100 points", text: "The 2.5 m/s² action value is not exceeded." },
        { title: "100 to 400 points", text: "Between the action value and the limit value." },
        { title: "Over 400 points", text: "The 5 m/s² limit value has been exceeded." },
      ],
    },
    {
      type: "table",
      caption: "Exposure points by in-use vibration and trigger time (excerpt).",
      head: ["Vibration (m/s²)", "5 min", "10 min", "2 h", "8 h"],
      rows: [
        ["2.5", "1", "2", "25", "100"],
        ["3.5", "2", "4", "49", "196"],
        ["5.0", "4", "8", "100", "400"],
        ["6.0", "6", "12", "144", "576"],
        ["7.0", "8", "16", "196", "784"],
        ["10.0", "17", "33", "400", "1600"],
        ["15.0", "38", "75", "900", "3600"],
        ["20.0", "67", "133", "1600", "6400"],
        ["30.0", "150", "300", "3600", "14400"],
      ],
    },
    {
      type: "p",
      text: "For times not shown, add columns together: 15 minutes is the 5-minute plus the 10-minute column. Use the result with common sense: the inputs are estimates of things that vary a lot, and exposure can never be known to a fraction of a decimal.",
    },
    { type: "h3", text: "A worked example" },
    {
      type: "p",
      text: "An operator cleaning castings uses a conventional grinder (6.0 m/s²) for two hours — 144 points, or 3.0 m/s², so an action programme is needed. The same operator guides the chisel of a conventional chipping hammer by hand for 15 minutes; holding the chisel rules out the declared 7 m/s², and the guide, citing ISO 28927-10, says to use at least 30 m/s² — 450 points. Together, 594 points: 6.1 m/s², over the limit. A GTG 40 turbo grinder (3.5 m/s², twice the power) should in theory halve the grinding time; even assuming a conservative 25% cut, it scores about 37 points. A vibration-controlled hammer with a sleeve for guiding the chisel, estimated at 10 m/s², scores 50.",
    },
    {
      type: "table",
      caption: "Before and after, from the guide's worked examples.",
      head: ["Tool", "Vibration value", "Trigger time", "Partial A(8)"],
      rows: [
        ["Conventional grinder", "6.0 m/s²", "2 h", "3.0 m/s²"],
        ["Conventional chipping hammer, chisel held", "30 m/s²", "15 min", "5.3 m/s²"],
        ["Daily exposure before", "", "", "6.1 m/s² (above the limit)"],
        ["GTG 40 vibration-controlled grinder", "3.5 m/s²", "1 h 30 min", "1.5 m/s²"],
        ["Vibration-controlled chipping hammer with sleeve", "10 m/s²", "15 min", "1.8 m/s²"],
        ["Daily exposure after", "", "", "2.3 m/s² (below the action value)"],
      ],
    },

    { type: "h2", text: "Ways to bring exposure down" },
    {
      type: "p",
      text: "There are only two ways to control the risk: lower the vibration value, or shorten the exposure time. Modern vibration-controlled tools often do both, because many are also more efficient.",
    },
    {
      type: "list",
      style: "check",
      items: [
        {
          title: "Lower-vibration tools",
          text: "Most tool types come in lower-vibration versions — but check they perform at least as well, or longer exposure can cancel the gain.",
        },
        {
          title: "More power",
          text: "A grinder's removal rate is directly proportional to power, so the most powerful suitable grinder shortens grinding time.",
        },
        {
          title: "A healthy air installation",
          text: "Hoses that are too long and narrow and couplings with too little flow sap power. Grinding at 1 bar below the prescribed pressure makes the process 40% longer, and bad air installations are the most common reason grinders under-perform.",
        },
        {
          title: "The right consumables",
          text: "Many grinding wheels in use are too hard: they last longer but make grinding much slower. The most suitable modern wheel cuts both vibration and grinding time.",
        },
        {
          title: "Job rotation",
          text: "It can always reduce an operator's exposure time when nothing else brings a full shift under the action value.",
        },
        {
          title: "Change the process",
          text: "Replace the vibrating task with a different process altogether.",
        },
        {
          title: "Change the product",
          text: "Redesign the product to reduce the need for tasks that involve vibration exposure.",
        },
        {
          title: "Ergonomics, maintenance and training",
          text: "Look for a high power-to-weight ratio, good grip comfort and handles that do not get cold in use — cold handles are believed to affect the development of white fingers. Service or replace worn tools and accessories, and train operators to work the lowest-vibration way.",
        },
      ],
    },
    {
      type: "callout",
      tone: "warning",
      title: "Gloves are not the fix",
      text: "Wrapping handles in rubber or other soft material is unlikely to reduce vibration in the frequency range used to calculate exposure, and anti-vibration gloves cannot generally be relied on either. Both may improve comfort, but their effect on exposure is limited.",
    },
  ],
  keyTakeaways: [
    "Action value 2.5 m/s², limit value 5 m/s² — both A(8)",
    "Declared, in-use and A(8) are three different values",
    "Under 100 points: below the action value; over 400: above the limit",
    "Act on a rough estimate rather than wait for measurements",
    "Lower the vibration or shorten the trigger time",
  ],
  neoLinks: [
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
      label: "Air Line Accessories",
      href: "/products?category=air-line-accessories",
      desc: "Couplings, hoses, reels and FRL units that keep pneumatic tools at rated power",
    },
    {
      label: "Preventive maintenance",
      href: "/nsw#preventive-maintenance",
      desc: "Scheduled maintenance contracts that maximise tool life",
    },
  ],
};
