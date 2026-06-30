import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { InquiryForm } from "@/components/InquiryForm";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/data/site";

const contactInfo = [
  { icon: MapPin, label: "Visit us", value: `${site.address.line1} ${site.address.line2}` },
  { icon: Phone, label: "Call us", value: site.phone, href: `tel:${site.phoneDial}` },
  { icon: Mail, label: "Email us", value: site.email, href: `mailto:${site.email}` },
  { icon: Clock, label: "Working hours", value: site.hours.short },
];

export function ContactSection() {
  return (
    <section className="relative py-16">
      <div className="container-px">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading
              eyebrow="Let's Talk"
              title="Request a quote or talk to an engineer"
              subtitle="Tell us about your line and we'll recommend the right tools — with pricing, lead times and integration support."
            />

            <div className="mt-10 space-y-4">
              {contactInfo.map((c, i) => (
                <Reveal key={c.label} delay={i * 0.06}>
                  <a
                    href={c.href ?? "#"}
                    className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-white/20"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-neo-600/15 text-neo-400">
                      <c.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-steel-500">
                        {c.label}
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-white">
                        {c.value}
                      </p>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.1}>
            <div className="gradient-border p-6 sm:p-8">
              <h3 className="font-display text-lg font-semibold text-white">
                Send us an inquiry
              </h3>
              <p className="mt-1 text-sm text-steel-400">
                Fill in the form and our team will respond within one business day.
              </p>
              <div className="mt-6">
                <InquiryForm />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
