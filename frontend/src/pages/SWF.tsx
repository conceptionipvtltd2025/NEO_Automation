import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Play,
  ShieldCheck,
  GitBranch,
  Workflow,
  Gauge,
  Wrench,
  Cpu,
  CheckCircle2,
  ArrowUpRight,
  MessageSquareQuote,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { Modal } from "@/components/ui/Modal";
import { InquiryForm } from "@/components/InquiryForm";
import { Counter } from "@/components/ui/Counter";

const features = [
  { icon: ShieldCheck, title: "Error-Proofing", text: "Guided, verified tightening stops defects before they reach the next station." },
  { icon: GitBranch, title: "Full Traceability", text: "Every torque & angle result logged, time-stamped and audit-ready." },
  { icon: Workflow, title: "Smart Sequencing", text: "Operators are guided step-by-step through complex assembly routines." },
  { icon: Gauge, title: "Live Quality Data", text: "Real-time analytics dashboards across every tool on the line." },
  { icon: Wrench, title: "Tool Orchestration", text: "Manage multiple tools and strategies from a single controller." },
  { icon: Cpu, title: "Industry 4.0 Ready", text: "Open protocols integrate seamlessly with your MES and PLCs." },
];

const services = [
  "On-site installation & commissioning",
  "Calibration & certification",
  "Operator training programs",
  "Preventive maintenance contracts",
  "Genuine spares & rapid support",
  "Line audits & process optimisation",
];

export default function SWF() {
  const [videoOpen, setVideoOpen] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <>
      <PageHeader
        eyebrow="Atlas Copco · Smart Workflow Feature"
        title="The Smart Workflow Feature"
        subtitle="Connect every Atlas Copco tool into one intelligent, error-proofed workflow — with total traceability across your assembly line."
        crumbs={[{ label: "SWF · Atlas Copco" }]}
      />

      {/* Hero video band */}
      <section className="container-px pb-16">
        <Reveal>
          <div className="force-dark relative aspect-[16/9] overflow-hidden rounded-3xl border border-white/10 shadow-card sm:aspect-[21/9]">
            <img
              src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=2000&q=80"
              alt="Atlas Copco service centre"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-ink-950/50" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,rgba(5,5,7,0.7))]" />
            {/* cinematic bottom scrim — keeps the caption readable in both themes */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/75 to-transparent" />
            <button
              onClick={() => setVideoOpen(true)}
              className="group absolute inset-0 grid place-items-center"
            >
              <span className="relative grid h-20 w-20 place-items-center rounded-full bg-neo-600/90 text-pure shadow-glow transition group-hover:scale-110">
                <span className="absolute inset-0 animate-ping rounded-full bg-neo-600/40" />
                <Play className="h-8 w-8 fill-pure" />
              </span>
            </button>
            <div className="absolute bottom-6 left-6">
              <p className="font-display text-lg font-semibold text-pure">
                Inside the Atlas Copco Service Centre
              </p>
              <p className="text-sm text-pure/70">2:45 · Watch the walkthrough</p>
            </div>
          </div>
        </Reveal>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { v: 100, s: "%", l: "Torque traceability" },
            { v: 40, s: "%", l: "Fewer line defects" },
            { v: 99.2, s: "%", l: "Line uptime", d: 1 },
          ].map((st) => (
            <Reveal key={st.l}>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center">
                <p className="font-display text-4xl font-bold text-gradient-neo">
                  <Counter value={st.v} suffix={st.s} decimals={st.d ?? 0} />
                </p>
                <p className="mt-2 text-sm text-steel-400">{st.l}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container-px py-12">
        <SectionHeading
          align="center"
          eyebrow="Why SWF"
          title="One platform, total control"
          subtitle="Everything you need to make your assembly line smarter, safer and fully traceable."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-volt-500/30 hover:bg-white/[0.04]"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-volt-500/15 text-volt-400 transition group-hover:scale-110">
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

      {/* Services + inquiry */}
      <section className="container-px py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <div>
              <SectionHeading
                eyebrow="Service Centre"
                title="Beyond the tool — full lifecycle support"
                subtitle="Our Atlas Copco-certified service team keeps your tools precise and your line running."
              />
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {services.map((s, i) => (
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
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-volt-500/10 blur-3xl" />
              <span className="eyebrow border-volt-500/30 bg-volt-500/10 text-volt-400">
                Inquiry Now
              </span>
              <h3 className="mt-5 font-display text-2xl font-bold text-white">
                Bring SWF to your line
              </h3>
              <p className="mt-3 text-steel-400">
                Request a consultation and our specialists will assess your
                assembly process and recommend the ideal SWF configuration.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button onClick={() => setInquiryOpen(true)} className="btn-primary">
                  <MessageSquareQuote className="h-4 w-4" /> Inquiry Now
                </button>
                <Link to="/products?brand=atlas-copco" className="btn-ghost">
                  Atlas Copco range <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Modal open={videoOpen} onClose={() => setVideoOpen(false)} maxWidth="max-w-3xl">
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
          <iframe
            className="h-full w-full"
            src="https://www.youtube.com/embed/Zk3lwbCYUjM?rel=0&modestbranding=1"
            title="Atlas Copco SWF"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </Modal>

      <Modal
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        title="SWF Consultation Request"
        maxWidth="max-w-xl"
      >
        <InquiryForm productName="Atlas Copco · Smart Workflow Feature (SWF)" compact />
      </Modal>
    </>
  );
}
