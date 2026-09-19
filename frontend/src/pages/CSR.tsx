import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  HeartPulse,
  Droplets,
  GraduationCap,
  HandHeart,
  Users,
  Handshake,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SustainabilityHeaderArt } from "@/components/ui/HeaderArt";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { asset } from "@/lib/asset";

// Every claim on this page is evidenced by the photographs in
// public/images/csr/. No donor counts, litres or beneficiary numbers appear
// anywhere — those were never recorded, so they are never implied.

/** Pair a CSR slug with its full-size and grid-sized files. */
const img = (slug: string) => ({
  full: asset(`images/csr/${slug}.jpg`),
  thumb: asset(`images/csr/${slug}-thumb.jpg`),
});

type CSRPhoto = {
  /** Optimised full-size image, shown in the lightbox and project blocks. */
  full: string;
  /** Smaller image used in the grid. */
  thumb: string;
  /** Accessible caption / alt text. */
  caption: string;
};

type Project = {
  id: string;
  icon: typeof HeartPulse;
  /** Icon-medallion classes — one pastel accent per project. */
  accent: string;
  eyebrow: string;
  title: string;
  partner: string;
  body: string[];
  photo: CSRPhoto;
};

const projects: Project[] = [
  {
    id: "blood-donation",
    icon: HeartPulse,
    accent: "bg-neo-600/15 text-neo-400",
    eyebrow: "Project 01",
    title: "Blood Donation Camp",
    partner: "With the Rotary Club of Ahmedabad Majesty Stars",
    body: [
      "We opened the Neo Automation premises for a blood donation camp run jointly with the Rotary Club of Ahmedabad Majesty Stars, bringing the collection van to our own gate so colleagues could step off the floor and give.",
      "Donors were registered and screened on site, and each one received an Indian Red Cross Society certificate for their donation.",
      "Hosting the camp at our office was deliberate — it turned a working day into a day of giving without anyone needing to travel for it.",
    ],
    photo: {
      ...img("blood-donation-team"),
      caption:
        "The Neo Automation team with Rotary volunteers outside the office at the blood donation camp",
    },
  },
  {
    id: "water-for-all",
    icon: Droplets,
    accent: "bg-volt-500/15 text-volt-400",
    eyebrow: "Project 02",
    title: "Water for All",
    partner: "With the Rotary Club of Ahmedabad Majesty Stars & Team Atulya",
    body: [
      "Neo Automation donated a water cooler — a public drinking-water parab — for the neighbourhood at Sayona City, Vibhag-1, Chankyapuri.",
      "It was inaugurated on 1st July 2025, garlanded with marigolds, alongside the Rotary Club of Ahmedabad Majesty Stars and Team Atulya.",
      "The parab stays where people actually need it: on the street, open to anyone, through the Gujarat summer.",
    ],
    photo: {
      ...img("water-for-all-parab"),
      caption:
        "The donated water parab at its inauguration in Sayona City, Vibhag-1, Chankyapuri",
    },
  },
  {
    id: "sanand-girls-school",
    icon: GraduationCap,
    accent: "bg-aurora-500/15 text-aurora-400",
    eyebrow: "Project 03",
    title: "Sanand Girls School — Kurti Distribution",
    partner: "At the JDG school, Sanand",
    body: [
      "We visited the JDG girls school in Sanand to distribute kurtis to its students, handing them over class by class rather than leaving a carton at the gate.",
      "Going in person mattered. The visit let our team meet the girls and their teachers, and see the school the donation supports.",
      "Education is the long game for the communities around our industrial belt, and we would rather back it directly.",
    ],
    photo: {
      ...img("sanand-girls-kurti"),
      caption: "Students of the JDG school in Sanand with the donated kurtis",
    },
  },
];

const principles = [
  {
    icon: HandHeart,
    title: "Local first",
    text: "We give where we operate — the neighbourhoods, schools and streets around our Ahmedabad base, not somewhere abstract.",
  },
  {
    icon: Handshake,
    title: "In partnership",
    text: "Each project runs with an established partner: the Rotary Club of Ahmedabad Majesty Stars, Team Atulya, the Indian Red Cross Society.",
  },
  {
    icon: Users,
    title: "Hands on the work",
    text: "Our own team shows up — donating, inaugurating, distributing. A cheque posted from the office is not what we mean by responsibility.",
  },
];

/** Every CSR photograph, ordered to follow the projects above. */
const gallery: CSRPhoto[] = [
  {
    ...img("blood-donation-team"),
    caption:
      "The Neo Automation team with Rotary volunteers under the blood donation banner",
  },
  {
    ...img("blood-donation-donor"),
    caption: "A Neo team member donating blood aboard the collection van",
  },
  {
    ...img("blood-donation-kit"),
    caption:
      "A donor with her Indian Red Cross Society certificate outside the Neo Automation office",
  },
  {
    ...img("water-for-all-poster"),
    caption:
      "The Water for All event poster — donating a water cooler, 1st July 2025",
  },
  {
    ...img("water-for-all-parab"),
    caption: "The installed water parab, garlanded at its inauguration",
  },
  {
    ...img("sanand-girls-kurti"),
    caption: "Kurti distribution at the JDG girls school in Sanand",
  },
];

/**
 * Lightbox gallery — mirrors the NSWGallery pattern (uniform 4:3 tiles, arrow
 * and escape keys, scroll lock) but reads the CSR set defined above rather
 * than the NSW data module.
 */
function CSRGallery() {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const next = useCallback(
    () => setActive((i) => (i === null ? i : (i + 1) % gallery.length)),
    []
  );
  const prev = useCallback(
    () =>
      setActive((i) =>
        i === null ? i : (i - 1 + gallery.length) % gallery.length
      ),
    []
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, close, next, prev]);

  return (
    <>
      {/* Uniform grid — every tile is a 4:3 cell (object-cover crops to fit) so
          rows stay aligned with no ragged bottoms. Full image shows in lightbox. */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {gallery.map((photo, i) => (
          <motion.button
            key={photo.thumb}
            type="button"
            onClick={() => setActive(i)}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.06 }}
            className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-neo-500"
            aria-label={`View photo: ${photo.caption}`}
          >
            <img
              src={photo.thumb}
              alt={photo.caption}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
            <span className="absolute inset-x-0 bottom-0 translate-y-2 p-3 text-left text-xs font-medium text-pure opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
              {photo.caption}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] grid place-items-center p-4 sm:p-8"
          >
            <div
              className="absolute inset-0 bg-ink-950/90 backdrop-blur-md"
              onClick={close}
            />

            <button
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-xl border border-white/15 bg-ink-900/60 text-steel-200 transition hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <button
              onClick={prev}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-ink-900/60 text-steel-200 transition hover:text-white sm:left-6"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={next}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-ink-900/60 text-steel-200 transition hover:text-white sm:right-6"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <motion.figure
              key={active}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="relative z-[5] flex max-h-[88vh] max-w-5xl flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={gallery[active].full}
                alt={gallery[active].caption}
                className="max-h-[80vh] w-auto rounded-2xl border border-white/10 object-contain shadow-card"
              />
              <figcaption className="mt-4 text-center text-sm text-steel-300">
                {gallery[active].caption}
                <span className="ml-2 text-steel-500">
                  {active + 1} / {gallery.length}
                </span>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * One project block. Image and text swap columns on `lg` for odd-indexed
 * projects via order utilities, so the DOM order stays image-then-text on
 * every block and small screens always read photo first.
 */
function ProjectBlock({ project, flip }: { project: Project; flip: boolean }) {
  const Icon = project.icon;

  return (
    <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
      <Reveal className={flip ? "lg:order-2" : undefined}>
        <div className="force-dark group relative overflow-hidden rounded-3xl border border-white/10 shadow-card">
          <img
            src={project.photo.full}
            alt={project.photo.caption}
            loading="lazy"
            className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/10 to-transparent" />
          <p className="pointer-events-none absolute inset-x-0 bottom-0 p-5 text-sm leading-snug text-pure/80 sm:p-6">
            {project.photo.caption}
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.1} className={flip ? "lg:order-1" : undefined}>
        <div>
          <span
            className={`grid h-12 w-12 place-items-center rounded-2xl ${project.accent}`}
          >
            <Icon className="h-6 w-6" />
          </span>
          <p className="mt-5 text-[13px] font-semibold uppercase tracking-wider text-steel-500">
            {project.eyebrow}
          </p>
          <h3 className="mt-2 font-display text-[clamp(1.5rem,3.2vw,2.1rem)] font-bold leading-tight text-white">
            {project.title}
          </h3>
          <p className="mt-3 text-sm font-medium text-neo-400">
            {project.partner}
          </p>
          <div className="mt-5 space-y-4">
            {project.body.map((para) => (
              <p key={para} className="leading-relaxed text-steel-400">
                {para}
              </p>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

export default function CSR() {
  return (
    <>
      <PageHeader
        eyebrow="Corporate Social Responsibility"
        title="Giving back where we work"
        subtitle="Beyond the factory floor, Neo Automation supports the community around it — a blood donation camp at our own premises, drinking water on a public street and school supplies handed over in person."
        crumbs={[{ label: "Company", href: "/about" }, { label: "CSR" }]}
        media={<SustainabilityHeaderArt />}
      />

      {/* Intro + the principles behind how we choose projects */}
      <section className="container-px pb-8">
        <SectionHeading
          eyebrow="Our Commitment"
          title="Small projects, done properly"
          subtitle="We are a distributor of industrial tools, not a foundation. What we can offer is our premises, our people's time and a share of what the business earns — given to causes close enough that we can stand in front of them."
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <Reveal>
            <div className="space-y-4">
              <p className="text-lg leading-relaxed text-steel-300">
                Neo Automation's corporate social responsibility work is
                deliberately local and deliberately small. Every project so far
                has happened within reach of our Ahmedabad office, with a
                partner already doing the work on the ground.
              </p>
              <p className="leading-relaxed text-steel-400">
                That has meant opening our gate for a blood donation camp,
                donating a public drinking-water parab for a neighbourhood that
                needed one, and carrying kurtis to a girls school in Sanand
                ourselves. Three projects, each one finished rather than
                announced.
              </p>
              <p className="leading-relaxed text-steel-400">
                We do not publish donor counts or beneficiary numbers here. What
                we can show is the photographs from each day, and the partners
                whose names are on them.
              </p>
            </div>
          </Reveal>

          <StaggerGroup className="grid gap-5">
            {principles.map((p) => (
              <StaggerItem key={p.title}>
                <div className="flex h-full items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.04]">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-neo-600/15 text-neo-400">
                    <p.icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-base font-semibold text-white">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-steel-400">
                      {p.text}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* The three projects */}
      <section id="projects" className="container-px py-16">
        <SectionHeading
          align="center"
          eyebrow="What We've Done"
          title="Three projects, three partners"
          subtitle="Each of these ran with an established local partner, and each one our own team turned up for."
        />
        <div className="mt-14 space-y-16">
          {projects.map((project, i) => (
            <ProjectBlock
              key={project.id}
              project={project}
              flip={i % 2 === 1}
            />
          ))}
        </div>
      </section>

      {/* Photo gallery */}
      <section id="gallery" className="container-px py-16">
        <SectionHeading
          align="center"
          eyebrow="From the Days Themselves"
          title="Photographs from our CSR work"
          subtitle="The camp at our office, the parab at Sayona City and the classroom in Sanand — select any photograph to view it full size."
        />
        <div className="mt-14">
          <CSRGallery />
        </div>
      </section>

      {/* CTA */}
      <section className="container-px py-16">
        <Reveal>
          <div className="gradient-border relative overflow-hidden p-8 sm:p-12">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-neo-600/10 blur-3xl"
            />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <span className="eyebrow">Work With Us</span>
                <h2 className="mt-5 font-display text-[clamp(1.6rem,3.2vw,2.4rem)] font-bold leading-tight text-white">
                  Running a community project near Ahmedabad?
                </h2>
                <p className="mt-4 max-w-xl leading-relaxed text-steel-400">
                  If you are organising a camp, a donation drive or a school
                  initiative in or around our neighbourhood, we would like to
                  hear about it — our premises, our people and our support are
                  open to the right partner.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link to="/contact" className="btn-primary justify-center">
                  Get in touch
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/sustainability" className="btn-ghost justify-center">
                  Sustainability &amp; safety
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
