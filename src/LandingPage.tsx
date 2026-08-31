import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { services } from "./shared/services";
import { useReveal } from "./hooks/useReveal";

function Reveal({
  children,
  dir,
  delay = 0,
  className = ""
}: {
  children: ReactNode;
  dir?: "up" | "left" | "right" | "scale";
  delay?: number;
  className?: string;
}) {
  const ref = useReveal<HTMLDivElement>();
  const dataDir = dir === "up" ? undefined : dir;
  return (
    <div
      ref={ref}
      data-dir={dataDir}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={className}
    >
      {children}
    </div>
  );
}

const navLinks = [
  { label: "Platform", href: "#platform" },
  { label: "Services", href: "#services" },
  { label: "How it works", href: "#how" },
  { label: "Principles", href: "#principles" }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <LedgerLine />

      <Header />

      <Hero />

      <main>
        <TrustStrip />
        <PlatformSection />
        <ServicesSection />
        <ShowcaseBand />
        <HowItWorks />
        <PrinciplesSection />
        <FinalCta />
      </main>

      <Footer />
    </div>
  );
}

function LedgerLine() {
  return <div className="h-px w-full bg-line/60" aria-hidden="true" />;
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-canvas/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link to="/" className="font-display text-xl">
          Savei<span className="text-accent-green">Trip</span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-ink-soft transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-ink-soft transition-colors hover:text-ink">
            Log in
          </Link>
          <Link
            to="/signup"
            className="rounded-sm bg-ink px-4 py-2 text-sm font-medium text-canvas transition hover:-translate-y-0.5"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-[86dvh] items-center overflow-hidden md:items-end">
      <img
        src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2400&q=80"
        alt="Open road through a mountain valley at sunrise"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/55 to-ink/25" />
      <div className="absolute inset-0 bg-[radial-gradient(90%_120%_at_20%_80%,rgba(32,29,24,0.45),transparent_60%)]" />
      <div className="relative mx-auto w-full max-w-7xl px-5 pb-20 pt-28 md:px-8">
        <Reveal>
          <h1 className="font-display max-w-4xl text-5xl leading-[1.02] text-canvas md:text-7xl [text-shadow:0_2px_24px_rgba(0,0,0,0.35)]">
            Know where you're going, <em className="text-canvas">before you go.</em>
          </h1>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-canvas/90">
            SaveiTrip is a travel-tech workspace for trip planning, market analysis, destination
            intelligence and emergency preparedness. Your account foundation is live and secure.
          </p>
        </Reveal>
        <Reveal delay={220}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/signup"
              className="rounded-sm bg-canvas px-6 py-3 text-sm font-medium text-ink transition hover:-translate-y-0.5"
            >
              Get started
            </Link>
            <Link
              to="/login"
              className="rounded-sm border border-canvas/60 bg-ink/30 px-6 py-3 text-sm text-canvas backdrop-blur-sm transition hover:bg-canvas/10"
            >
              Explore the demo
            </Link>
          </div>
        </Reveal>
        <Reveal delay={320}>
          <div className="mt-12 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
            <HeroCapability icon="shield" label="JWT-secured sessions" />
            <HeroCapability icon="basecamp" label="Account foundation live" />
            <HeroCapability icon="pin" label="Built for India's destinations" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const heroIcons = {
  shield: (
    <>
      <path d="M12 3 5 6v5c0 5 3 8.4 7 10 4-1.6 7-5 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  basecamp: (
    <>
      <path d="M3 19h18M6 19v-8M10 19V6m4 13V6m4 13v-8" />
      <path d="m12 6-3 4h6l-3-4Z" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <circle cx="12" cy="10" r="1.4" />
    </>
  )
} as const;

function HeroCapability({ icon, label }: { icon: keyof typeof heroIcons; label: string }) {
  return (
    <span className="group inline-flex items-center gap-3 rounded-sm border border-canvas/20 bg-gradient-to-b from-canvas/15 to-canvas/5 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md transition-all duration-400 hover:-translate-y-0.5 hover:border-accent-amber/60 hover:from-canvas/20 hover:to-canvas/10">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-accent-amber text-canvas shadow-[0_4px_14px_-4px_rgba(167,116,47,0.7)] transition-transform duration-400 group-hover:scale-110">
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
          {heroIcons[icon]}
        </svg>
      </span>
      <span className="text-sm font-medium text-canvas/90">{label}</span>
    </span>
  );
}

function TrustStrip() {
  const partners = [
    { mark: "M", name: "Meridian Routes" },
    { mark: "N", name: "Northface Travel Co." },
    { mark: "G", name: "Gharial Ventures" },
    { mark: "SK", name: "Sattva Koop" },
    { mark: "C", name: "Circa Himalaya" },
    { mark: "TS", name: "Tile & Stone Expeditions" }
  ];

  return (
    <section id="platform" className="relative overflow-hidden border-b border-line/60 bg-canvas-alt/50 py-10">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-ink-faint">
          Guiding work informed by leading travel research
        </p>
        <div className="relative mt-8 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-canvas-alt to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-canvas-alt to-transparent" />
          <div className="marquee-track gap-12 pr-12">
            {[...partners, ...partners].map((partner, i) => (
              <div
                key={`${partner.name}-${i}`}
                className="flex shrink-0 items-center gap-3 text-ink-faint"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-sm border border-line bg-surface font-display text-sm text-ink-soft">
                  {partner.mark}
                </span>
                <span className="text-sm">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PlatformSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 md:px-8">
      <Reveal dir="up">
        <p className="text-xs uppercase tracking-[0.2em] text-ink-faint">The foundation</p>
        <h2 className="font-display mt-4 max-w-2xl text-4xl leading-tight md:text-5xl">
          A solid base for every journey, already in place.
        </h2>
      </Reveal>
      <div className="mt-14 grid gap-5 md:grid-cols-3">
        <Reveal dir="up">
          <PlatformCard
            number="01"
            title="Secure accounts, live now"
            body="Create your workspace and sign in with confidence. Sessions are protected with signed JWT tokens, so your saved ideas stay yours."
            accent="green"
          />
        </Reveal>
        <Reveal dir="up" delay={90}>
          <PlatformCard
            number="02"
            title="One place for trip ideas"
            body="Your dashboard is your basecamp: a home for destinations you want to explore, questions you want answered, and plans to revisit."
            accent="amber"
          />
        </Reveal>
        <Reveal dir="up" delay={180}>
          <PlatformCard
            number="03"
            title="Built to grow with real data"
            body="New intelligence services map onto the same account. Nothing future-facing is faked; what's not live yet is clearly marked."
            accent="green"
          />
        </Reveal>
      </div>
    </section>
  );
}

const cardAccents = {
  green: "text-accent-green",
  amber: "text-accent-amber",
  red: "text-accent-red"
} as const;

function PlatformCard({
  number,
  title,
  body,
  accent
}: {
  number: string;
  title: string;
  body: string;
  accent: keyof typeof cardAccents;
}) {
  return (
    <article className="lift-card group flex h-full flex-col rounded-sm bg-surface p-7 shadow-[0_24px_70px_-45px_rgba(32,29,24,0.35)] hover:shadow-[0_32px_80px_-40px_rgba(32,29,24,0.45)]">
      <span className={`font-display text-4xl ${cardAccents[accent]}`}>{number}</span>
      <h3 className="font-display mt-6 text-2xl">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-ink-soft">{body}</p>
      <span className="mt-auto pt-6" aria-hidden="true">
        <svg
          className="h-5 w-5 text-ink-faint transition-transform duration-500 group-hover:translate-x-1"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path d="M4 10h12m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </article>
  );
}

function ServicesSection() {
  return (
    <section id="services" className="mx-auto max-w-7xl px-5 py-24 md:px-8">
      <Reveal dir="up">
        <p className="text-xs uppercase tracking-[0.2em] text-ink-faint">The roadmap</p>
        <h2 className="font-display mt-4 max-w-2xl text-4xl leading-tight md:text-5xl">
          Intelligence services, staged honestly.
        </h2>
        <p className="mt-5 max-w-xl leading-7 text-ink-soft">
          Three capabilities are mapped onto your account. Each is researched and planned; the status
          of each is communicated plainly so you always know what to expect.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {services.map((service, i) => (
          <Reveal key={service.slug} dir="up" delay={i * 90}>
            <ServiceCard service={service} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ServiceCard({ service }: { service: (typeof services)[number] }) {
  return (
    <article className="lift-card group flex h-full flex-col rounded-sm border border-line bg-surface p-7 transition-colors hover:border-accent-green">
      <div className="flex items-center justify-between">
        <span className="font-display text-4xl text-ink-faint">{service.number}</span>
        <span className="rounded-sm bg-accent-green-soft px-3 py-1 text-xs font-medium text-accent-green">
          {service.status}
        </span>
      </div>
      <h3 className="font-display mt-6 text-2xl">{service.title}</h3>
      <p className="mt-3 text-sm leading-6 text-ink-soft">{service.summary}</p>

      <ul className="mt-6 space-y-2 border-t border-line pt-5">
        {service.purpose.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-ink-soft">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-green" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6">
        <span className="inline-flex items-center gap-2 text-sm font-medium text-accent-green">
          {service.cta}
          <svg
            className="h-4 w-4 transition-transform duration-400 group-hover:translate-x-1"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path d="M4 10h12m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </article>
  );
}

function HowItWorks() {
  const steps = [
    {
      title: "Create your workspace",
      body: "Sign up with just your name, email and a password. Your account is protected and ready in seconds."
    },
    {
      title: "Save what matters",
      body: "Use your dashboard as a basecamp for destinations and questions you want answered before you travel."
    },
    {
      title: "Return as intelligence lands",
      body: "New market analysis, destination insights and safety research arrive on the same account as they launch."
    }
  ];

  return (
    <section id="how" className="border-y border-line/60 bg-canvas-alt/40 py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal dir="up">
          <p className="text-xs uppercase tracking-[0.2em] text-ink-faint">How it works</p>
          <h2 className="font-display mt-4 max-w-2xl text-4xl leading-tight md:text-5xl">
            From first sign-in to fully informed travel.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal key={step.title} dir="up" delay={i * 100}>
              <div className="lift-card flex h-full flex-col rounded-sm border border-line bg-surface p-7">
                <span className="font-display text-5xl text-accent-green">{`0${i + 1}`}</span>
                <h3 className="font-display mt-6 text-xl">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-ink-soft">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function PrinciplesSection() {
  const principles = [
    {
      title: "Honest staging",
      body: "Every service carries its real status. We never pretend a future feature is shipping today."
    },
    {
      title: "Research before rollout",
      body: "New capabilities start as research, not marketing. You only see what's been validated."
    },
    {
      title: "Safety as a feature",
      body: "Emergency preparedness is designed in from the start, not bolted on later."
    },
    {
      title: "Your data is yours",
      body: "Secure sessions and clear account boundaries keep your saved travel work private."
    }
  ];

  return (
    <section id="principles" className="mx-auto max-w-7xl px-5 py-24 md:px-8">
      <Reveal dir="up">
        <p className="text-xs uppercase tracking-[0.2em] text-ink-faint">Principles</p>
        <h2 className="font-display mt-4 max-w-2xl text-4xl leading-tight md:text-5xl">
          How we build, so you can trust the journey.
        </h2>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-line bg-line md:grid-cols-2">
        {principles.map((principle, i) => (
          <Reveal key={principle.title} dir="up" delay={i * 80} className="h-full">
            <div className="lift-card group flex h-full flex-col justify-between gap-8 bg-surface p-8 transition-colors hover:bg-canvas-alt">
              <h3 className="font-display text-2xl">{principle.title}</h3>
              <div className="flex items-end justify-between gap-4">
                <p className="max-w-sm text-sm leading-7 text-ink-soft">{principle.body}</p>
                <span className="font-display text-5xl text-ink-faint/40">{`0${i + 1}`}</span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ShowcaseBand() {
  const places = [
    {
      img: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=70",
      name: "Pangong Tso, Ladakh",
      tag: "High-altitude lakes"
    },
    {
      img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=70",
      name: "Himachal foothills",
      tag: "Hidden valley trails"
    },
    {
      img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=70",
      name: "India's heritage",
      tag: "Monuments & local culture"
    }
  ];

  return (
    <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">
      <Reveal dir="up">
        <div className="grid gap-5 md:grid-cols-3">
          {places.map((place, i) => (
            <Reveal key={place.name} dir="up" delay={i * 110} className="h-full">
              <figure className="lift-card group relative aspect-[4/5] overflow-hidden rounded-sm bg-ink">
                <img
                  src={place.img}
                  alt={`${place.name} destination`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-6">
                  <p className="text-xs uppercase tracking-[0.18em] text-canvas/70">{place.tag}</p>
                  <p className="font-display mt-2 text-2xl text-canvas">{place.name}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8">
      <Reveal dir="scale">
        <div className="relative overflow-hidden rounded-sm bg-ink px-8 py-20 text-center md:px-16">
          <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-accent-green/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-accent-amber/20 blur-3xl" />
          <div className="relative">
            <h2 className="font-display mx-auto max-w-3xl text-4xl leading-tight text-canvas md:text-5xl">
              Start your basecamp today.
            </h2>
            <p className="mx-auto mt-5 max-w-xl leading-7 text-canvas/70">
              Create a free account and see what a travel intelligence workspace looks like. Explore
              the product with one click.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/signup"
                className="rounded-sm bg-canvas px-6 py-3 text-sm font-medium text-ink transition hover:-translate-y-0.5"
              >
                Get started
              </Link>
              <Link
                to="/login"
                className="rounded-sm border border-canvas/40 px-6 py-3 text-sm text-canvas transition hover:bg-canvas/10"
              >
                Explore the demo
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line bg-canvas-alt/50">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <span className="font-display text-2xl">
              Savei<span className="text-accent-green">Trip</span>
            </span>
            <p className="mt-4 max-w-xs text-sm leading-6 text-ink-soft">
              A travel intelligence foundation. Research-led, honestly staged, and built for India's
              destinations.
            </p>
            <p className="mt-6 text-xs text-ink-faint">Foundation release 2026</p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.18em] text-ink-faint">Platform</h4>
            <ul className="mt-4 space-y-3 text-sm text-ink-soft">
              <li><a href="#platform" className="transition-colors hover:text-ink">The foundation</a></li>
              <li><a href="#services" className="transition-colors hover:text-ink">Services</a></li>
              <li><a href="#how" className="transition-colors hover:text-ink">How it works</a></li>
              <li><a href="#principles" className="transition-colors hover:text-ink">Principles</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.18em] text-ink-faint">Account</h4>
            <ul className="mt-4 space-y-3 text-sm text-ink-soft">
              <li><Link to="/login" className="transition-colors hover:text-ink">Log in</Link></li>
              <li><Link to="/signup" className="transition-colors hover:text-ink">Create account</Link></li>
              <li><Link to="/#platform" className="transition-colors hover:text-ink">The platform</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.18em] text-ink-faint">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm text-ink-soft">
              <li>support@saveitrip.com</li>
              <li>Mon–Fri, 9:00–18:00</li>
              <li className="text-ink-faint">Delhi, India</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 text-xs text-ink-faint">
          <span>© 2026 SaveiTrip. All rights reserved.</span>
          <div className="flex items-center gap-5">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Status</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
