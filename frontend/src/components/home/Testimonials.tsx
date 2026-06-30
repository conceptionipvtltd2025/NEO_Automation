import { Quote, Star } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { StaggerGroup, StaggerItem } from "@/components/ui/Reveal";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  accent: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "Neo's SWF deployment cut our tightening rejections to almost zero. The traceability gives our quality team total confidence on every vehicle.",
    name: "Rakesh Menon",
    role: "Plant Head",
    company: "Automotive OEM, Sanand",
    accent: "237,28,36",
  },
  {
    quote:
      "Genuine Atlas Copco tools, calibrated on-site, with spares that actually arrive next day. Their engineers feel like part of our own team.",
    name: "Anita Deshpande",
    role: "Manufacturing Manager",
    company: "Aerospace Components",
    accent: "34,184,255",
  },
  {
    quote:
      "From specification to go-live, Neo handled everything. Our new assembly cell was running at target cycle time within a week of install.",
    name: "Suresh Patel",
    role: "Operations Director",
    company: "EV Powertrain, Pune",
    accent: "16,185,129",
  },
];

export function Testimonials() {
  return (
    <section className="container-px py-16">
      <SectionHeading
        align="center"
        eyebrow="Trusted on the Floor"
        title="What India's makers say about Neo"
        subtitle="Quality, aerospace and EV manufacturers rely on Neo Automation to keep their most critical lines precise and productive."
      />

      <StaggerGroup className="mt-14 grid gap-5 md:grid-cols-3">
        {testimonials.map((t) => (
          <StaggerItem key={t.name} className="h-full">
            <figure
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-7 transition-colors duration-300 hover:border-white/20"
              style={{ ["--accent" as string]: t.accent }}
            >
              <div
                className="pointer-events-none absolute -left-10 -top-10 h-28 w-28 rounded-full opacity-60 blur-2xl"
                style={{ background: `rgba(${t.accent},0.18)` }}
              />
              <Quote
                className="h-8 w-8"
                style={{ color: `rgb(${t.accent})` }}
              />
              <div className="mt-4 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-steel-200">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-6 border-t border-white/10 pt-5">
                <p className="font-display text-base font-semibold text-white">
                  {t.name}
                </p>
                <p className="text-xs text-steel-400">
                  {t.role} · {t.company}
                </p>
              </figcaption>
            </figure>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}
