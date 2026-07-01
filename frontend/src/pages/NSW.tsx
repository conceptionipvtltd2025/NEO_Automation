import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Wind,
  BatteryCharging,
  Plug,
  Gauge,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight,
  MessageSquareQuote,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { NSWHeaderArt } from "@/components/ui/HeaderArt";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { Modal } from "@/components/ui/Modal";
import { InquiryForm } from "@/components/InquiryForm";
import { Counter } from "@/components/ui/Counter";
import { NSWGallery } from "@/components/NSWGallery";
import { nswHero } from "@/data/nswGallery";

const serviced = [
  {
    icon: Wind,
    title: "Pneumatic Nut Runners",
    text: "Complete overhaul, seal kits and air-motor servicing for every make of pneumatic tightening tool.",
  },
  {
    icon: BatteryCharging,
    title: "Battery Nut Runners",
    text: "Cordless tool repair, battery health checks and electronics diagnostics to restore full performance.",
  },
  {
    icon: Plug,
    title: "Electric Nut Runners",
    text: "Transducerised and DC electric tool service, motor rewinding and controller fault-finding.",
  },
  {
    icon: Gauge,
    title: "Torque Calibration",
    text: "Calibration and certification against ISO 6789 with documented, audit-ready torque reports.",
  },
  {
    icon: Wrench,
    title: "Repair & Genuine Spares",
    text: "Fully equipped with all tools & tackles and a stock of genuine spares for fast turnaround.",
  },
  {
    icon: ShieldCheck,
    title: "Preventive Maintenance",
    text: "Scheduled maintenance contracts that maximise tool life and keep your line running.",
  },
];

const promises = [
  "All tools & tackles equipped in-house workshop",
  "Service for Pneumatic, Battery & Electric nut runners",
  "Calibration & certification (ISO 6789)",
  "Genuine spares & fast turnaround",
  "OEM-trained service engineers",
  "Annual maintenance contracts (AMC)",
];

export default function NSW() {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <>
      <PageHeader
        eyebrow="Neo Service Workshop"
        title="Nuclear Service Workshop (NSW)"
        subtitle="An all tools & tackles equipped service workshop for servicing all types of Pneumatic, Battery and Electric nut runners — keeping your tightening tools precise, certified and production-ready."
        crumbs={[{ label: "NSW" }]}
        media={<NSWHeaderArt />}
      />

      {/* Hero band */}
      <section className="container-px pb-16">
        <Reveal>
          <div className="force-dark relative aspect-[16/9] overflow-hidden rounded-3xl border border-white/10 shadow-card sm:aspect-[21/9]">
            <img
              src={nswHero}
              alt="Neo Automation Nuclear Service Workshop — Atlas Copco tool bench"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-ink-950/50" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,rgba(5,5,7,0.7))]" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/75 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <p className="font-display text-lg font-semibold text-pure">
                Tools & tackles equipped service workshop
              </p>
              <p className="text-sm text-pure/70">
                Pneumatic · Battery · Electric nut runners
              </p>
            </div>
          </div>
        </Reveal>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { v: 100, s: "%", l: "Genuine spares used" },
            { v: 3, s: "", l: "Tool types serviced" },
            { v: 48, s: "h", l: "Typical turnaround" },
          ].map((st) => (
            <Reveal key={st.l}>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center">
                <p className="font-display text-4xl font-bold text-gradient-neo">
                  <Counter value={st.v} suffix={st.s} />
                </p>
                <p className="mt-2 text-sm text-steel-400">{st.l}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* What we service */}
      <section className="container-px py-12">
        <SectionHeading
          align="center"
          eyebrow="What We Service"
          title="Every nut runner, fully restored"
          subtitle="From air-driven to fully electric, our workshop services and certifies the tightening tools your line depends on."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {serviced.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-neo-600/30 hover:bg-white/[0.04]"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-neo-600/15 text-neo-400 transition group-hover:scale-110">
                <f.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-white">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-steel-400">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Inauguration gallery */}
      <section className="container-px py-12">
        <SectionHeading
          align="center"
          eyebrow="Inside the Workshop"
          title="Our Nuclear Service Workshop"
          subtitle="A look inside our tools & tackles equipped NSW facility and its inauguration with Atlas Copco Industrial Technique."
        />
        <div className="mt-14">
          <NSWGallery />
        </div>
      </section>

      {/* Promises + inquiry */}
      <section className="container-px py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <div>
              <SectionHeading
                eyebrow="The NSW Promise"
                title="A workshop built around your uptime"
                subtitle="Bring us any nut runner and our engineers restore it to factory accuracy — documented and certified."
              />
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {promises.map((s, i) => (
                  <motion.div
                    key={s}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-steel-200"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-neo-500" />
                    {s}
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-900 p-8">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-neo-600/10 blur-3xl" />
              <span className="eyebrow">Inquiry Now</span>
              <h3 className="mt-5 font-display text-2xl font-bold text-white">
                Book a tool service
              </h3>
              <p className="mt-3 text-steel-400">
                Tell us what needs servicing and our workshop team will arrange
                pick-up, diagnosis and a certified repair quote.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button onClick={() => setInquiryOpen(true)} className="btn-primary">
                  <MessageSquareQuote className="h-4 w-4" /> Inquiry Now
                </button>
                <Link to="/contact" className="btn-ghost">
                  Contact the workshop <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Modal
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        title="NSW Service Request"
        maxWidth="max-w-xl"
      >
        <InquiryForm productName="NSW · Nut Runner Service & Calibration" compact />
      </Modal>
    </>
  );
}
