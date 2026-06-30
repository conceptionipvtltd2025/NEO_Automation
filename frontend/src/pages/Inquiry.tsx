import { useSearchParams } from "react-router-dom";
import { CheckCircle2, Clock, ShieldCheck, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { InquiryHeaderArt } from "@/components/ui/HeaderArt";
import { InquiryForm } from "@/components/InquiryForm";
import { useCatalog } from "@/store/useCatalog";
import { Reveal } from "@/components/ui/Reveal";

const perks = [
  { icon: Clock, title: "Fast response", text: "We reply within one business day." },
  { icon: ShieldCheck, title: "Genuine equipment", text: "Authorised, warranty-backed products." },
  { icon: Sparkles, title: "Expert guidance", text: "Engineers help you pick the right tool." },
];

export default function Inquiry() {
  const [params] = useSearchParams();
  const products = useCatalog((s) => s.products);
  const product = products.find((p) => p.slug === params.get("product"));

  return (
    <>
      <PageHeader
        eyebrow="Get a Quote"
        title="Tell us what you need"
        subtitle="Share your requirement and our team will get back with pricing, availability and recommendations."
        crumbs={[{ label: "Inquiry" }]}
        media={<InquiryHeaderArt />}
      />

      <section className="container-px pb-24">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-4">
            {perks.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-neo-600/15 text-neo-400">
                    <p.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-semibold text-white">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-sm text-steel-400">{p.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}

            <Reveal delay={0.3}>
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-neo-600/10 to-transparent p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <CheckCircle2 className="h-4 w-4 text-neo-500" /> Trusted by 1200+ installations
                </div>
                <p className="mt-2 text-sm text-steel-400">
                  Join leading manufacturers who rely on Neo Automation for their
                  critical assembly and finishing needs.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="gradient-border p-6 sm:p-8">
              <InquiryForm
                productId={product?.id}
                productName={product?.name}
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
