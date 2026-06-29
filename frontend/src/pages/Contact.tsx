import { MapPin, Phone, Mail, Clock, Navigation } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { InquiryForm } from "@/components/InquiryForm";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/data/site";

const info = [
  { icon: MapPin, label: "Address", value: `${site.address.line1} ${site.address.line2}` },
  { icon: Phone, label: "Phone", value: site.phone, href: `tel:${site.phoneDial}` },
  { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
  { icon: Clock, label: "Hours", value: site.hours.short },
];

const mapQuery = encodeURIComponent(site.map.query);
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

export default function Contact() {
  return (
    <>
      <PageHeader
        eyebrow="Contact Us"
        title="We'd love to hear from you"
        subtitle="Reach out for quotes, demos, service or just to talk shop. Our engineers are ready to help."
        crumbs={[{ label: "Contact" }]}
      />

      <section className="container-px pb-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <div className="grid gap-4 sm:grid-cols-2">
              {info.map((c, i) => (
                <Reveal key={c.label} delay={i * 0.06}>
                  <a
                    href={c.href ?? "#"}
                    className="flex h-full items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-white/20"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-neo-600/15 text-neo-400">
                      <c.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-steel-500">
                        {c.label}
                      </p>
                      <p className="mt-1 text-sm font-medium text-white">{c.value}</p>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>

            {/* Map */}
            <Reveal delay={0.2}>
              <div className="group relative mt-6 overflow-hidden rounded-3xl border border-white/10">
                <iframe
                  title="Neo Automation location"
                  src={`https://maps.google.com/maps?q=${mapQuery}&z=15&output=embed`}
                  className="h-72 w-full grayscale transition-all duration-500 group-hover:grayscale-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-ink-900/90 px-4 py-2 text-xs font-medium text-white backdrop-blur-md transition hover:bg-neo-600"
                >
                  <Navigation className="h-3.5 w-3.5" /> Get directions
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div className="gradient-border p-6 sm:p-8">
              <h3 className="font-display text-xl font-bold text-white">
                Send a message
              </h3>
              <p className="mt-1 text-sm text-steel-400">
                We'll get back to you within one business day.
              </p>
              <div className="mt-6">
                <InquiryForm />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
