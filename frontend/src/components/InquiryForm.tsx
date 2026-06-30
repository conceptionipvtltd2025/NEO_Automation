import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Send, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { useInquiries } from "@/store/useInquiries";
import { cn } from "@/lib/utils";

type Field = "name" | "email" | "phone" | "address" | "message";

const PHONE_MIN_DIGITS = 7;
const PHONE_MAX_DIGITS = 15;

// Simple math CAPTCHA — two single-digit numbers the user adds together.
const makeCaptcha = () => ({
  a: Math.floor(Math.random() * 9) + 1,
  b: Math.floor(Math.random() * 9) + 1,
});

const fieldMeta: { id: Field; label: string; type: string; full?: boolean; placeholder: string }[] = [
  { id: "name", label: "Full Name", type: "text", placeholder: "Jane Doe" },
  { id: "email", label: "Email", type: "email", placeholder: "you@company.com" },
  { id: "phone", label: "Phone", type: "tel", placeholder: "+91 90000 00000" },
  { id: "address", label: "Address / City", type: "text", placeholder: "Ahmedabad, Gujarat" },
  { id: "message", label: "Message", type: "textarea", full: true, placeholder: "Tell us what you need a quote for…" },
];

export function InquiryForm({
  productId,
  productName,
  compact = false,
  className,
}: {
  productId?: string;
  productName?: string;
  compact?: boolean;
  className?: string;
}) {
  const addInquiry = useInquiries((s) => s.addInquiry);
  const [values, setValues] = useState<Record<Field, string>>({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  // Anti-bot: math challenge + honeypot (a hidden field bots tend to fill).
  const [captcha, setCaptcha] = useState(makeCaptcha);
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState<string | undefined>();
  const [honeypot, setHoneypot] = useState("");

  const newCaptcha = () => {
    setCaptcha(makeCaptcha());
    setCaptchaInput("");
    setCaptchaError(undefined);
  };

  const validate = () => {
    const e: Partial<Record<Field, string>> = {};
    if (!values.name.trim()) e.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) e.email = "Valid email required";
    const digits = values.phone.replace(/\D/g, "");
    if (!values.phone.trim()) e.phone = "Phone is required";
    else if (!/^\+?[\d\s-]+$/.test(values.phone)) e.phone = "Only digits, spaces, - and + allowed";
    else if (digits.length < PHONE_MIN_DIGITS || digits.length > PHONE_MAX_DIGITS)
      e.phone = `Phone must be ${PHONE_MIN_DIGITS}–${PHONE_MAX_DIGITS} digits`;
    if (values.message.trim().length < 10) e.message = "Tell us a bit more (10+ chars)";
    setErrors(e);

    let captchaOk = true;
    if (Number(captchaInput) !== captcha.a + captcha.b) {
      setCaptchaError("Incorrect answer — please try again");
      captchaOk = false;
    } else {
      setCaptchaError(undefined);
    }

    return Object.keys(e).length === 0 && captchaOk;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    setTimeout(() => {
      addInquiry(
        { ...values, productId, productName },
        {
          captchaA: captcha.a,
          captchaB: captcha.b,
          captchaAnswer: Number(captchaInput),
          company: honeypot,
        }
      );
      setStatus("done");
    }, 900);
  };

  const onChange = (id: Field, v: string) => {
    // Phone: allow only digits, spaces, dashes and a leading +, and cap digit count
    if (id === "phone") {
      v = v.replace(/[^\d\s+-]/g, "");
      const digits = v.replace(/\D/g, "");
      if (digits.length > PHONE_MAX_DIGITS) return; // block extra digits
    }
    setValues((s) => ({ ...s, [id]: v }));
    if (errors[id]) setErrors((e) => ({ ...e, [id]: undefined }));
  };

  return (
    <div className={cn("relative", className)}>
      <AnimatePresence mode="wait">
        {status === "done" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.06] p-10 text-center"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
              className="grid h-16 w-16 place-items-center rounded-full bg-emerald-500 text-white"
            >
              <Check className="h-8 w-8" />
            </motion.span>
            <h3 className="mt-5 font-display text-xl font-bold text-white">
              Inquiry received!
            </h3>
            <p className="mt-2 max-w-sm text-sm text-steel-300">
              Thank you, {values.name.split(" ")[0] || "there"}. Our team will
              reach out shortly. A confirmation has been sent to{" "}
              <span className="text-white">{values.email}</span>.
            </p>
            <button
              onClick={() => {
                setValues({ name: "", email: "", phone: "", address: "", message: "" });
                setHoneypot("");
                newCaptcha();
                setStatus("idle");
              }}
              className="btn-ghost mt-6 text-[13px]"
            >
              Submit another
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={submit}
            className="space-y-4"
          >
            {productName && (
              <div className="rounded-xl border border-neo-600/30 bg-neo-600/[0.08] px-4 py-3 text-sm">
                <span className="text-steel-400">Inquiry for: </span>
                <span className="font-semibold text-white">{productName}</span>
              </div>
            )}
            <div className={cn("grid gap-4", !compact && "sm:grid-cols-2")}>
              {fieldMeta.map((f) => (
                <div key={f.id} className={cn(f.full && "sm:col-span-2")}>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-steel-400">
                    {f.label}
                  </label>
                  {f.type === "textarea" ? (
                    <textarea
                      rows={compact ? 3 : 4}
                      value={values[f.id]}
                      onChange={(e) => onChange(f.id, e.target.value)}
                      placeholder={f.placeholder}
                      className={cn(
                        "w-full resize-none rounded-xl border bg-white/[0.02] px-4 py-3 text-sm text-white outline-none transition placeholder:text-steel-600 focus:border-neo-600/60 focus:bg-white/[0.04]",
                        errors[f.id] ? "border-red-500/60" : "border-white/10"
                      )}
                    />
                  ) : (
                    <input
                      type={f.type}
                      inputMode={f.id === "phone" ? "tel" : undefined}
                      value={values[f.id]}
                      onChange={(e) => onChange(f.id, e.target.value)}
                      placeholder={f.placeholder}
                      className={cn(
                        "w-full rounded-xl border bg-white/[0.02] px-4 py-3 text-sm text-white outline-none transition placeholder:text-steel-600 focus:border-neo-600/60 focus:bg-white/[0.04]",
                        errors[f.id] ? "border-red-500/60" : "border-white/10"
                      )}
                    />
                  )}
                  {errors[f.id] && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-red-400">
                      <AlertCircle className="h-3 w-3" /> {errors[f.id]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Honeypot — visually hidden & off the tab order; real users never fill it. */}
            <div aria-hidden className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
              <label>
                Company
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </label>
            </div>

            {/* Math CAPTCHA */}
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-steel-400">
                Verify you're human
              </label>
              <div className="flex items-center gap-3">
                <span className="select-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white">
                  {captcha.a} + {captcha.b} =
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={captchaInput}
                  onChange={(e) => {
                    setCaptchaInput(e.target.value.replace(/\D/g, "").slice(0, 3));
                    if (captchaError) setCaptchaError(undefined);
                  }}
                  placeholder="?"
                  aria-label={`What is ${captcha.a} plus ${captcha.b}?`}
                  className={cn(
                    "w-20 rounded-xl border bg-white/[0.02] px-4 py-3 text-center text-sm text-white outline-none transition placeholder:text-steel-600 focus:border-neo-600/60 focus:bg-white/[0.04]",
                    captchaError ? "border-red-500/60" : "border-white/10"
                  )}
                />
                <button
                  type="button"
                  onClick={newCaptcha}
                  aria-label="New question"
                  className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 text-steel-300 transition hover:border-neo-600/50 hover:text-white"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
              {captchaError && (
                <p className="mt-1 flex items-center gap-1 text-xs text-red-400">
                  <AlertCircle className="h-3 w-3" /> {captchaError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-primary w-full justify-center disabled:opacity-70"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                </>
              ) : (
                <>
                  Submit Inquiry <Send className="h-4 w-4" />
                </>
              )}
            </button>
            <p className="text-center text-xs text-steel-500">
              Protected against spam · We reply within one business day.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
