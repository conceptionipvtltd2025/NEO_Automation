import { useState } from "react";
import { motion } from "framer-motion";
import {
  Target,
  Eye,
  Rocket,
  Heart,
  Award,
  Users,
  ShieldCheck,
  BadgeCheck,
  MapPin,
  Clock,
  Bot,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { AboutHeaderArt } from "@/components/ui/HeaderArt";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { SectionHeading } from "@/components/SectionHeading";
import { StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { site } from "@/data/site";
import { asset } from "@/lib/asset";

// Neo is not itself ISO-registered — our OEM partners are. Keep every claim
// here to what Neo can actually evidence: appointment letters, training
// certificates, calibration records and installed base.
const credentials = [
  { icon: ShieldCheck, title: "Certified OEM Equipment", text: "Every product we supply is built and certified by its manufacturer — genuine, never grey imports." },
  { icon: BadgeCheck, title: "Authorised Distributor", text: "Officially appointed partner for ten global engineering brands." },
  { icon: Users, title: "OEM-Trained Engineers", text: "Factory-certified specialists for installation and calibration." },
  { icon: MapPin, title: "Pan-India Service", text: "On-site support reach across major manufacturing clusters." },
  { icon: Clock, title: "Next-Day Spares", text: "Critical consumables and spares held in stock for fast dispatch." },
  { icon: Award, title: "1200+ Installations", text: "A proven track record across automotive, aerospace & beyond." },
];

// Each milestone shows either a partner brand logo (from public/images/brands)
// or, for company milestones with no single brand, an accent icon.
type Milestone = {
  year: string;
  title: string;
  text: string;
  logo?: string; // public path to a brand logo
  brand?: string; // wordmark fallback + alt text
  color?: string; // brand accent — the plate glow + wordmark rule
  icon?: LucideIcon; // used when there is no brand logo
};

const timeline: Milestone[] = [
  {
    year: "2007",
    title: "The journey begins",
    text: "Founded in Ahmedabad — appointed distributor for Miranda tools and John Guest aluminium compressed-air piping.",
    logo: "images/brands/john-guest.png",
    brand: "John Guest",
    color: "#0e7ec4",
  },
  {
    year: "2009",
    title: "Atlas Copco tools & assembly",
    text: "Became distributor for Atlas Copco power tools and assembly systems.",
    logo: "images/brands/atlas-copco.png",
    brand: "Atlas Copco",
    color: "#a5c532",
  },
  {
    year: "2013",
    title: "GEDORE hand tools",
    text: "Added GEDORE premium hand tools and workshop storage to the portfolio.",
    logo: "images/brands/gedore.png",
    brand: "GEDORE",
    color: "#1e4d9b",
  },
  {
    year: "2014",
    title: "GESIPA riveting technology",
    text: "Became distributor for GESIPA blind-rivet and rivet-nut setting tools.",
    logo: "images/brands/gesipa.png",
    brand: "GESIPA",
    color: "#2ed658",
  },
  {
    year: "2016",
    title: "Atlas Copco bolting solutions",
    text: "Started supplying bolting and tightening solutions from Atlas Copco.",
    logo: "images/brands/atlas-copco.png",
    brand: "Atlas Copco",
    color: "#a5c532",
  },
  {
    year: "2017",
    title: "10 years of milestones",
    text: "Celebrated a decade of delivering precision, traceable tooling to Indian industry.",
    logo: "images/milestones/10-years.png",
    brand: "10 Years",
    color: "#c8a24e",
  },
  {
    year: "2019",
    title: "eepos aluminium cranes",
    text: "Became promoter for the eepos aluminium crane system, expanding into material handling.",
    logo: "images/brands/eepos.png",
    brand: "eepos",
    color: "#1b9bd7",
  },
  {
    year: "2022",
    title: "Nuclear Service Workshop",
    text: "Established the Nuclear Service Workshop for Atlas Copco.",
    logo: "images/brands/atlas-copco.png",
    brand: "Atlas Copco",
    color: "#a5c532",
  },
  {
    year: "2024",
    title: "Hoffmann Group hand tools",
    text: "Added Hoffmann Group industrial hand tools and workstation solutions.",
    logo: "images/brands/hoffmann-group.png",
    brand: "Hoffmann Group",
    color: "#ff7300",
  },
  {
    year: "2026",
    title: "AGV / AMR Solutions",
    text: "Expanded into automated guided vehicles and autonomous mobile robots for smart intralogistics.",
    icon: Bot,
  },
];

const values = [
  { icon: Heart, title: "Integrity", text: "Genuine equipment, honest advice, always." },
  { icon: Rocket, title: "Precision", text: "Obsessed with accuracy and reliability." },
  { icon: Users, title: "Partnership", text: "We invest in our people and processes so our team consistently exceeds — not just meets — customer expectations." },
  { icon: Award, title: "Excellence", text: "World-class brands, world-class service." },
];

/** The hero of each milestone row: a large WIDE literal-white plate carrying the
 *  partner logo (object-contain so a near-square logo and a 7:1 wordmark share
 *  one optical box), a wordmark fallback if the PNG is missing, or a dark ink
 *  medallion for company milestones that have no single brand. Mirrors
 *  BrandLogoPlate: bg-pure (never bg-white, which flips to near-ink in the light
 *  theme and swallows dark artwork), ring-1 ring-black/10, shadow-sm. */
function TimelineLogoPlate({
  logo,
  icon: Icon,
  label,
  accent,
}: {
  logo?: string;
  icon?: LucideIcon;
  label?: string;
  accent: string;
}) {
  const [failed, setFailed] = useState(false);

  // Company milestone (no brand logo): a dark medallion + accent glow, so a
  // brand-less row reads as a "company chapter", not a missing/empty plate.
  if (!logo && Icon) {
    return (
      <span className="relative grid h-24 w-[200px] shrink-0 place-items-center overflow-hidden rounded-xl border border-neo-600/30 bg-ink-950 shadow-sm sm:h-28 sm:w-[248px]">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{ background: `radial-gradient(circle at 50% 50%, ${accent}, transparent 70%)` }}
        />
        <Icon className="relative h-9 w-9 text-neo-400" />
      </span>
    );
  }

  // Logo present and loading fine.
  if (logo && !failed) {
    return (
      <span className="inline-flex h-24 w-[200px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-pure p-5 shadow-sm ring-1 ring-black/10 sm:h-28 sm:w-[248px] sm:p-6">
        <img
          src={asset(logo)}
          alt={label ? `${label} logo` : ""}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-contain"
        />
      </span>
    );
  }

  // Missing PNG (e.g. john-guest.png) → wordmark: constant dark ink on the same
  // white plate, underlined in the brand's own hex (several brand hexes are
  // unreadable as text, so the ink carries legibility and the hex only rules).
  return (
    <span className="inline-flex h-24 w-[200px] shrink-0 items-center justify-center rounded-xl bg-pure p-5 shadow-sm ring-1 ring-black/10 sm:h-28 sm:w-[248px] sm:p-6">
      <span
        className="border-b-2 pb-0.5 text-center font-display text-xl font-bold tracking-tight text-[#12141a] sm:text-2xl"
        style={{ borderColor: accent }}
      >
        {label}
      </span>
    </span>
  );
}

export default function About() {
  return (
    <>
      <PageHeader
        eyebrow="About Neo"
        title="Precision is our heritage"
        subtitle="For nearly two decades, Neo Automation has equipped Indian industry with the world's finest tools — backed by engineering expertise that goes far beyond the sale."
        crumbs={[{ label: "About" }]}
        media={<AboutHeaderArt />}
      />

      {/* Intro + image */}
      <section id="story" className="container-px pb-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="force-dark relative overflow-hidden rounded-3xl border border-white/10 shadow-card">
              <img
                src={asset("images/nsw/team-leadership.jpg")}
                alt="The Neo Automation team at the Service Workshop inauguration"
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 to-transparent" />
            </div>
          </Reveal>
          <div>
            <Reveal>
              <p className="text-lg leading-relaxed text-steel-300">
                Neo Automation is a leading Ahmedabad–Gujarat based provider of
                Industrial Tools, Assembly Solutions, Special Purpose Machines
                (SPM), Line Automation, Torque Reaction Systems and Smart Factory
                Automation Solutions.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 leading-relaxed text-steel-400">
                Our journey began in 2007 when{" "}
                <span className="font-medium text-white">Mr. Baldev Solanki</span>{" "}
                founded the company with a vision to deliver world-class
                industrial tool solutions and exceptional customer service to the
                manufacturing industry. Over the years, we have evolved from a
                trusted industrial tools supplier into a comprehensive automation
                solutions partner serving the Automotive, Auto Component,
                Electrical, Engineering and Manufacturing industries across India.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mt-4 leading-relaxed text-steel-400">
                With nearly two decades of experience, we help customers improve
                productivity, quality, ergonomics and process reliability through
                innovative engineering — delivering customized, cost-effective
                solutions backed by technical expertise and unmatched after-sales
                support.
              </p>
            </Reveal>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {site.stats.map((s) => (
                <Reveal key={s.label}>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center">
                    <p className="font-display text-2xl font-bold text-white">
                      <Counter value={s.value} suffix={s.suffix} decimals={s.value % 1 !== 0 ? 1 : 0} />
                    </p>
                    <p className="mt-1 text-[11px] uppercase tracking-wider text-steel-500">
                      {s.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section id="mission-vision" className="container-px py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {[
            { icon: Target, title: "Our Mission", text: "To empower every factory floor in India with precision, traceable and reliable tooling — improving quality, safety and productivity on every line we touch." },
            { icon: Eye, title: "Our Vision", text: "To become a reliable and trusted tightening partner to our esteemed customers, in line with the requirements of Industry 4.0 — recognised for genuine products, deep expertise and uncompromising service." },
          ].map((m, i) => (
            <Reveal key={m.title} delay={i * 0.1}>
              <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-ink-900 p-8">
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-neo-600/10 blur-3xl" />
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-neo-600/15 text-neo-400">
                  <m.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-2xl font-bold text-white">
                  {m.title}
                </h3>
                <p className="mt-3 leading-relaxed text-steel-400">{m.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section id="timeline" className="container-px py-16">
        <SectionHeading
          align="center"
          eyebrow="Our Journey"
          title="Built milestone by milestone"
        />
        <ol className="relative mx-auto mt-16 max-w-3xl">
          {/* Vertical spine threading the brand-accent nodes. */}
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-6 left-2 top-6 w-px -translate-x-1/2 bg-gradient-to-b from-neo-600/50 via-white/10 to-transparent"
          />

          {timeline.map((t, i) => {
            const accent = t.color ?? "#ed1c24";
            const Icon = t.icon;
            return (
              <motion.li
                key={t.year}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                  delay: Math.min(i * 0.06, 0.35),
                }}
                className="group relative flex gap-5 pb-10 last:pb-0 sm:gap-7"
              >
                {/* Spine node — a brand-accent dot punched through the rail. */}
                <div className="relative shrink-0">
                  <span
                    className="relative z-10 mt-6 block h-4 w-4 rounded-full ring-4 ring-ink-950"
                    style={{ backgroundColor: accent }}
                  >
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-full opacity-70 blur-[6px]"
                      style={{ backgroundColor: accent }}
                    />
                  </span>
                </div>

                {/* Milestone card — the site's glass card. */}
                <div className="relative min-w-0 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-white/20 sm:p-6">
                  {/* Soft same-hue corner glow (warms on hover). */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-35"
                    style={{ backgroundColor: accent }}
                  />
                  {/* Ghost-year watermark for editorial depth. */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute right-4 top-1 select-none font-display text-6xl font-bold leading-none text-white/[0.03] sm:text-7xl"
                  >
                    {t.year}
                  </span>

                  <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
                    {/* The hero: large wide white logo plate. */}
                    <TimelineLogoPlate
                      logo={t.logo}
                      icon={Icon}
                      label={t.brand}
                      accent={accent}
                    />

                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="font-display text-sm font-bold tracking-wide text-neo-400">
                          {t.year}
                        </span>
                        {/* Thin brand-accent hairline tied to this milestone. */}
                        <span
                          aria-hidden
                          className="h-px flex-1 rounded-full"
                          style={{ backgroundImage: `linear-gradient(90deg, ${accent}, transparent)` }}
                        />
                      </div>
                      <h4 className="mt-2 font-display text-xl font-semibold leading-tight text-white sm:text-2xl">
                        {t.title}
                      </h4>
                    </div>
                  </div>

                  <p className="relative mt-4 text-sm leading-relaxed text-steel-400 sm:text-[15px]">
                    {t.text}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </section>

      {/* Values */}
      <section id="values" className="container-px py-16">
        <SectionHeading align="center" eyebrow="What Drives Us" title="Our core values" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.08}>
              <div className="group h-full rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-neo-600/30 hover:bg-white/[0.04]">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-neo-600/15 text-neo-400 transition group-hover:scale-110">
                  <v.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-white">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm text-steel-400">{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Certifications & standards */}
      <section id="credentials" className="container-px py-16">
        <SectionHeading
          align="center"
          eyebrow="Credentials You Can Trust"
          title="Authorised, trained & accountable"
          subtitle="Our standards are not a claim — they are backed by genuine manufacturer authorisation, factory training and documented results."
        />
        <StaggerGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {credentials.map((c) => (
            <StaggerItem key={c.title}>
              <div className="group flex h-full items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-all duration-300 hover:border-neo-600/30 hover:bg-white/[0.04]">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-neo-600/15 text-neo-400 transition-transform duration-300 group-hover:scale-110">
                  <c.icon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold text-white">
                    {c.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-steel-400">
                    {c.text}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>
    </>
  );
}
