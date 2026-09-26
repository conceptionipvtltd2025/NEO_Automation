import type { InsightArticle } from "./types";

/**
 * "Hand-Arm Vibration Syndrome: learn about 3 related injuries" — Atlas Copco
 * Expert Hub article, with the figures, costs and prevention steps from its
 * companion white paper "Vibration injuries". Atlas Copco's knowledge,
 * credited in text.
 */
export const handArmVibration: InsightArticle = {
  id: "hand-arm-vibration",
  intro:
    "Hand-Arm Vibration Syndrome (HAVS) is a common occupational disorder caused by long-term exposure to high vibration from tools such as impact wrenches and grinders. Atlas Copco sets out the three injuries behind it, what they cost and how to prevent them.",
  body: [
    {
      type: "lead",
      text: "Operators exposed to high vibration for years can suffer damage that cannot be undone if they are not properly looked after — which is why it is essential to watch for the symptoms. Atlas Copco's white paper on vibration injuries counts hand-arm vibration injuries among the most common in industry today, and is just as clear that there are many ways to keep operators healthy while raising productivity and holding product quality.",
    },
    {
      type: "image",
      src: "images/safety/insights/gallery/vibration-injuries-whitepaper.jpg",
      alt: "Cover of the Atlas Copco white paper 'Vibration injuries': a raised open hand with pale, whitened fingers above a blue title panel",
      caption:
        "Atlas Copco's white paper 'Vibration injuries', the source of the figures, costs and prevention steps on this page.",
      fit: "contain",
    },

    { type: "h2", text: "How many people are exposed" },
    {
      type: "p",
      text: "The white paper describes vibration white finger as the most common disease in Great Britain, and hand-arm vibration injury as the most common work-related disorder in Sweden. The numbers behind that are large:",
    },
    {
      type: "stats",
      items: [
        { value: "5 million", label: "People in Britain regularly exposed to hand-arm vibration at work" },
        { value: "2 million", label: "Of them at risk of developing injuries" },
        { value: "2.5 million", label: "US workers exposed through daily work with power tools" },
        { value: "20–50%", label: "Reported prevalence of HAVS (US figures)" },
      ],
    },

    { type: "h2", text: "The three injuries behind HAVS" },
    {
      type: "p",
      text: "HAVS is the medical term for the symptoms caused by vibration exposure. They fall into three families.",
    },
    { type: "h3", text: "1. Vascular injury: Raynaud's phenomenon" },
    {
      type: "p",
      text: "The arteries in the fingers thicken, narrowing the area the blood can flow through. With that path restricted, blood cannot reach the affected areas and sensation is lost. The most common vascular disorder is Raynaud's phenomenon — also known as vibration white finger — in which the affected fingers turn white during an attack. It is most noticeable in the cold, when the body restricts blood supply to the extremities.",
    },
    { type: "h3", text: "2. Nerve damage: numbness" },
    {
      type: "p",
      text: "Vibration can also harm nerve cells, numbing the fingers. In the early stages the damage may be reversible, but long-term exposure makes it permanent. This injury leads to the most complaints, because it limits everyday life: buttoning a shirt, picking up coins from a flat surface or sewing become difficult or impossible.",
    },
    {
      type: "callout",
      tone: "info",
      title: "Carpal Tunnel Syndrome",
      text: "CTS, which causes tingling in the hand, is linked to vibration exposure but is not purely a vibration injury — working with a bent wrist can also trigger it. Its symptoms are broadly like those of nerve injury.",
    },
    { type: "h3", text: "3. Musculoskeletal disorders: strain and fractures" },
    {
      type: "p",
      text: "Percussive tools that need high feed forces — jackhammers, chipping hammers and riveting hammers among them — carry vibration through the hand and arm, causing wear and tear and even fractures at the joints.",
    },

    { type: "h2", text: "Symptoms to watch for" },
    {
      type: "list",
      style: "check",
      items: [
        { text: "Finger blanching" },
        { text: "Numbness and pain" },
        { text: "Tingling" },
        { text: "Reduced grip force" },
        { text: "Pain in the joints" },
      ],
    },
    {
      type: "p",
      text: "Every case of HAVS compromises the operator's hand mobility and, in the end, their work performance.",
    },

    { type: "h2", text: "What one injury costs" },
    {
      type: "p",
      text: "The white paper splits the cost of poor ergonomics, vibration included, into two kinds:",
    },
    {
      type: "list",
      style: "bullet",
      items: [
        {
          title: "Direct costs",
          text: "The obvious ones that come with an injury: rehabilitation, insurance and medical costs, and hiring a replacement.",
        },
        {
          title: "Indirect costs",
          text: "Less visible, and in many cases far more expensive. An operator in pain slows down to avoid it. They may also change the way they do the task — yet tasks are usually done a set way for the sake of quality, so defects follow, often found late in the process and fixed with costly rework. Studies at SAAB Automobile and Volvo Cars showed that better ergonomics improves quality significantly.",
        },
      ],
    },
    {
      type: "stats",
      items: [
        { value: "≈ €50,000", label: "Estimated cost of one vibration injury (companies in Sweden and the UK)" },
        { value: "$2–$5", label: "Spent on indirect costs for every $1 of direct cost (Liberty Mutual Safety Index 2002)" },
      ],
    },
    {
      type: "p",
      text: "The €50,000 estimate covers lost productivity, hiring and training a new operator and finding new tasks for the injured one. The real figure is hard to pin down and varies from country to country, with national health-care rules, insurance and labour costs, and how indirect costs are measured.",
    },

    { type: "h2", text: "Prevention: less vibration, less time" },
    {
      type: "p",
      text: "The two defences that matter most are controlling exposure time properly and using machines with devices designed to minimise vibration.",
    },
    {
      type: "callout",
      tone: "info",
      title: "The EU yardstick",
      text: "The Physical Agents (Vibration) Directive sets a daily exposure action value of 2.5 m/s² and a limit value of 5.0 m/s², both averaged over eight hours as A(8). Above the action value the employer must start an action programme to bring exposure down; the limit value may not be exceeded except in some special circumstances. Neither should be confused with the declared vibration emission value (DEV) that manufacturers give for each machine.",
    },
    {
      type: "p",
      text: "A(8) depends on the vibration level — the DEV, or vibration measured in use at the workplace — and on trigger time. Cutting the machine's vibration emission is the most efficient lever; trigger time has a smaller effect on exposure but can lift productivity. The white paper lists six practical steps:",
    },
    {
      type: "list",
      style: "number",
      items: [
        {
          title: "Choose a tool with a lower declared value",
          text: "The gain is immediate: a tool with a 20% lower DEV cuts A(8) by 20%.",
        },
        {
          title: "Change the process",
          text: "A nutrunner can often do an impact wrench's job equally well. With a DEV below 2.5 m/s² it can be used for eight hours without exceeding the action value, and the torque in the joint is more accurate too. Gluing parts instead of hammering them together removes the exposure altogether.",
        },
        {
          title: "Rotate jobs",
          text: "Job rotation cuts each operator's trigger time, and with it their vibration exposure.",
        },
        {
          title: "Use a more powerful tool",
          text: "As a rule of thumb, twice the power does the job in half the time. Halving trigger time cuts vibration exposure by 30% and doubles productivity.",
        },
        {
          title: "Deliver full air pressure",
          text: "Pneumatic tools are designed to work at 6.3 bar (90 psi) dynamic pressure at the tool, and anything less costs power. Leaking connections, undersized hoses and couplings with restrictions all cause pressure drops — so use full-flow couplings and recommended hoses no longer than they need to be.",
        },
        {
          title: "Use good consumables",
          text: "A sharp drill bit or chisel finishes faster than a worn one, and a grinder's vibration depends on the quality of its wheel. Choosing a ceramic fibre disc instead of a traditional grinding wheel raises productivity enormously and cuts vibration to a minimum — almost enough to let the grinder be used for eight hours.",
        },
      ],
    },
    {
      type: "callout",
      tone: "success",
      title: "The bottom line",
      text: "Vibration injuries are common, expensive for the business and life-changing for the person injured. Choosing tools with low vibration emission and good performance, together with high-quality consumables, can reduce vibration exposure significantly.",
    },
  ],
  keyTakeaways: [
    "Three injury types: vascular, nerve, musculoskeletal",
    "Early nerve damage can reverse; long exposure makes it permanent",
    "One vibration injury: about €50,000",
    "Control exposure time and vibration at source",
    "A 20% lower declared value cuts A(8) by 20%",
  ],
  neoLinks: [
    {
      label: "Assembly & Tightening",
      href: "/products?category=assembly-tightening",
      desc: "Electric, cordless and pneumatic nutrunners with controllers and software",
    },
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
  ],
};
