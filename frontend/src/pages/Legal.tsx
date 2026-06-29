import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/ui/Reveal";

const content = {
  terms: {
    title: "Terms & Conditions",
    eyebrow: "Legal",
    sections: [
      { h: "1. Acceptance of Terms", p: "By accessing and using the Neo Automation website, you accept and agree to be bound by these Terms & Conditions. If you do not agree, please discontinue use of the site." },
      { h: "2. Products & Pricing", p: "All products are supplied as authorised distribution. Prices shown are indicative, exclude applicable taxes, and are subject to change without notice. Final pricing is confirmed at the time of quotation." },
      { h: "3. Inquiries & Quotations", p: "Submitting an inquiry does not constitute a binding order. Quotations are valid for the period stated and subject to stock availability and confirmation." },
      { h: "4. Intellectual Property", p: "All brand names, logos and trademarks remain the property of their respective owners. Content on this site may not be reproduced without written consent." },
      { h: "5. Limitation of Liability", p: "Neo Automation shall not be liable for any indirect or consequential loss arising from the use of this website or the products listed herein." },
      { h: "6. Governing Law", p: "These terms are governed by the laws of India, with jurisdiction in the courts of Ahmedabad, Gujarat." },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    eyebrow: "Legal",
    sections: [
      { h: "1. Information We Collect", p: "We collect information you provide through inquiry forms, including name, email, phone, address and message content, solely to respond to your request." },
      { h: "2. How We Use Information", p: "Your information is used to process inquiries, provide quotations, and communicate about products and services. We do not sell your data to third parties." },
      { h: "3. Data Security", p: "We implement industry-standard measures including encryption and access controls to protect your personal information." },
      { h: "4. Cookies", p: "This site may use cookies to improve your browsing experience and analyse traffic. You can control cookies through your browser settings." },
      { h: "5. Your Rights", p: "You may request access to, correction of, or deletion of your personal data at any time by contacting us." },
      { h: "6. Contact", p: "For privacy-related queries, please reach us at info@neoautomation.com." },
    ],
  },
};

export default function Legal({ kind }: { kind: "terms" | "privacy" }) {
  const c = content[kind];
  return (
    <>
      <PageHeader eyebrow={c.eyebrow} title={c.title} crumbs={[{ label: c.title }]} />
      <section className="container-px pb-24">
        <div className="mx-auto max-w-3xl space-y-8">
          {c.sections.map((s, i) => (
            <Reveal key={s.h} delay={i * 0.04}>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <h2 className="font-display text-lg font-semibold text-white">{s.h}</h2>
                <p className="mt-3 leading-relaxed text-steel-400">{s.p}</p>
              </div>
            </Reveal>
          ))}
          <p className="text-sm text-steel-500">Last updated: June 2026</p>
        </div>
      </section>
    </>
  );
}
