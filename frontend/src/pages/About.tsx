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
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { AboutHeaderArt } from "@/components/ui/HeaderArt";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { SectionHeading } from "@/components/SectionHeading";
import { StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { site } from "@/data/site";
import { asset } from "@/lib/asset";

const credentials = [
  { icon: ShieldCheck, title: "ISO 9001:2015", text: "Quality-management certified processes across supply and service." },
  { icon: BadgeCheck, title: "Authorised Distributor", text: "Officially appointed partner for six global engineering brands." },
  { icon: Users, title: "OEM-Trained Engineers", text: "Factory-certified specialists for installation and calibration." },
  { icon: MapPin, title: "Pan-India Service", text: "On-site support reach across major manufacturing clusters." },
  { icon: Clock, title: "Next-Day Spares", text: "Critical consumables and spares held in stock for fast dispatch." },
  { icon: Award, title: "1200+ Installations", text: "A proven track record across automotive, aerospace & beyond." },
];

const timeline = [
  { year: "2007", title: "Founded by Mr. Baldev Solanki", text: "Neo Automation begins in Ahmedabad with a vision to deliver world-class industrial tools and service." },
  { year: "2013", title: "Atlas Copco partnership", text: "Becomes an authorised distributor, bringing smart tightening to the region." },
  { year: "2017", title: "Multi-brand expansion", text: "Adds GESIPA, GEDORE, PFERD & John Guest to the portfolio." },
  { year: "2021", title: "SWF & Industry 4.0", text: "Rolls out Smart Workflow Feature deployments across automotive lines." },
  { year: "2026", title: "1200+ installations", text: "Trusted across automotive, aerospace, data-center & general industry." },
];

const values = [
  { icon: Heart, title: "Integrity", text: "Genuine equipment, honest advice, always." },
  { icon: Rocket, title: "Precision", text: "Obsessed with accuracy and reliability." },
  { icon: Users, title: "Partnership", text: "Your line's uptime is our success." },
  { icon: Award, title: "Excellence", text: "World-class brands, world-class service." },
];

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
      <section className="container-px pb-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="force-dark relative overflow-hidden rounded-3xl border border-white/10 shadow-card">
              <img
                src={asset("images/nsw/team-leadership.jpg")}
                alt="The Neo Automation team at the Nuclear Service Workshop inauguration"
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
      <section className="container-px py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {[
            { icon: Target, title: "Our Mission", text: "To empower every factory floor in India with precision, traceable and reliable tooling — improving quality, safety and productivity on every line we touch." },
            { icon: Eye, title: "Our Vision", text: "To be the most trusted automation solutions partner in the country, recognised for genuine products, deep expertise and uncompromising service." },
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
      <section className="container-px py-16">
        <SectionHeading
          align="center"
          eyebrow="Our Journey"
          title="Built milestone by milestone"
        />
        <div className="relative mx-auto mt-14 max-w-3xl">
          <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-neo-600/60 via-white/10 to-transparent sm:left-1/2" />
          {timeline.map((t, i) => (
            <motion.div
              key={t.year}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className={`relative mb-10 pl-12 sm:w-1/2 sm:pl-0 ${
                i % 2 === 0 ? "sm:pr-12 sm:text-right" : "sm:ml-auto sm:pl-12"
              }`}
            >
              <span
                className={`absolute top-1.5 grid h-8 w-8 place-items-center rounded-full border border-neo-600/40 bg-ink-900 text-[11px] font-bold text-neo-400 left-0 ${
                  i % 2 === 0 ? "sm:-right-4 sm:left-auto" : "sm:-left-4"
                }`}
              >
                ●
              </span>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <span className="font-display text-sm font-bold text-neo-400">
                  {t.year}
                </span>
                <h4 className="mt-1 font-display text-lg font-semibold text-white">
                  {t.title}
                </h4>
                <p className="mt-1.5 text-sm text-steel-400">{t.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="container-px py-16">
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
      <section className="container-px py-16">
        <SectionHeading
          align="center"
          eyebrow="Credentials You Can Trust"
          title="Certified, authorised & accountable"
          subtitle="Our standards are not a claim — they are certified, audited and backed by genuine manufacturer authorisation."
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
