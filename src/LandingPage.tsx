import { type ReactNode, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { services, statusTone } from "./shared/services";
import { Brand } from "./shared/ui";
import { Icon, type IconName } from "./shared/Icon";
import { useReveal } from "./hooks/useReveal";

function useScrollBelow(threshold = 20) {
  const [below, setBelow] = useState(false);
  useEffect(() => {
    const onScroll = () => setBelow(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return below;
}

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
  { label: "Destinations", href: "#destinations" },
  { label: "Services", href: "#services" },
  { label: "The journey", href: "#how" },
  { label: "Principles", href: "#principles" }
];

export default function LandingPage() {
  return (
    <div className="landing-page min-h-screen bg-canvas text-ink">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Header />

      <main id="main-content">
        <Hero />
        <TrustStrip />
        <DestinationsSection />
        <PlatformSection />
        <ServicesSection />
        <ExperienceBand />
        <HowItWorks />
        <PrinciplesSection />
        <FinalCta />
      </main>

      <Footer />
    </div>
  );
}

/* ───────────────────────── Header ───────────────────────── */

function Header() {
  const scrolled = useScrollBelow(20);
  return (
    <header
      className={`landing-header fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled
        ? "border-b border-line/70 bg-canvas/92 shadow-sm backdrop-blur-md"
        : "border-b border-transparent bg-transparent"
        }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">
        <Link to="/" aria-label="SaveiTrip home">
          <span
            className={`inline-flex items-center gap-2.5 font-display text-xl tracking-tight transition-colors ${scrolled ? "text-ink" : "text-canvas"
              }`}
          >
            <span
              className={`grid h-8 w-8 place-items-center rounded-lg transition-colors ${scrolled
                ? "bg-accent-green text-canvas"
                : "bg-canvas/15 text-canvas ring-1 ring-canvas/40 backdrop-blur-md"
                }`}
            >
              <Icon name="compass" className="h-4 w-4" />
            </span>
            <span>
              Savei<span className={scrolled ? "text-accent-green" : "text-amber-200"}>Trip</span>
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${scrolled
                ? "text-ink-soft hover:text-ink"
                : "text-canvas/85 hover:text-canvas [text-shadow:0_1px_12px_rgba(0,0,0,0.45)]"
                }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/choose-login"
            className={`inline-flex rounded-full px-4 py-2 text-sm font-medium transition ${scrolled
              ? "text-ink-soft hover:bg-surface hover:text-ink"
              : "text-canvas/90 ring-1 ring-canvas/40 backdrop-blur-md hover:bg-canvas/10 [text-shadow:0_1px_12px_rgba(0,0,0,0.45)]"
              }`}
          >
            Log in
          </Link>
          <Link
            to="/choose-signup"
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 ${scrolled
              ? "bg-ink text-canvas hover:bg-ink/90 shadow-md shadow-ink/20"
              : "bg-canvas text-ink shadow-lg shadow-ink/30 hover:bg-white"
              }`}
          >
            Explore
            <Icon name="arrow-right" className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ───────────────────────── Hero ───────────────────────── */

function Hero() {
  return (
    <section className="landing-hero relative flex min-h-dvh items-end overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=2600&q=80"
        alt="Majestic Himalayan lake at dawn"
        className="landing-hero-image absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-ink/95 via-ink/40 to-ink/20" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_140%_at_75%_110%,rgba(63,107,79,0.35),transparent_55%)]" />

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-32 md:px-8 md:pb-20">

        <Reveal delay={90}>
          <h1 className="font-display mt-6 max-w-4xl text-5xl leading-none text-canvas sm:text-6xl md:text-7xl lg:text-[5.2rem] [text-shadow:0_3px_30px_rgba(0,0,0,0.45)]">
            Know where you're going,{" "}
            <em className="text-accent-amber">before you go.</em>
          </h1>
        </Reveal>
        <Reveal delay={180}>
          <p className="mt-7 max-w-xl text-lg leading-8 text-canvas/85 [text-shadow:0_1px_16px_rgba(0,0,0,0.5)]">
            SaveiTrip is a premium travel-techn ogy workspace — trip planning, live market
            analysis, destination intelligence and emergency preparedness for the way you
            actually travel.
          </p>
        </Reveal>
        <Reveal delay={260}>
          <div className="mt-10 max-w-2xl rounded-2xl border border-canvas/20 bg-ink/40 p-3 shadow-2xl shadow-ink/40 backdrop-blur-xl">
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <div className="flex flex-1 items-center gap-3 px-3 py-2">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-canvas/10 text-accent-amber ring-1 ring-canvas/20">
                  <Icon name="compass" className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-canvas/55">Destination</p>
                  <p className="text-sm text-canvas/90">Where are you headed?</p>
                </div>
              </div>
              <div className="hidden h-10 w-px bg-canvas/20 md:block" />
              <div className="flex flex-1 items-center gap-3 px-3 py-2">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-canvas/10 text-accent-amber ring-1 ring-canvas/20">
                  <Icon name="calendar" className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-canvas/55">Travel dates</p>
                  <p className="text-sm text-canvas/90">Plan ahead, arrive prepared</p>
                </div>
              </div>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-amber px-6 py-4 text-sm font-semibold text-canvas transition hover:-translate-y-0.5 hover:bg-accent-amber/90 md:self-stretch"
              >
                Start my trip
                <Icon name="arrow-right" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal delay={340}>
          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-canvas/75 [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">
            <span className="inline-flex items-center gap-2">
              <Icon name="shield-check" className="h-4 w-4 text-accent-amber" /> Secure live account
            </span>
            <span className="inline-flex items-center gap-2">
              <Icon name="scale" className="h-4 w-4 text-accent-amber" /> Real market prices
            </span>
            <span className="inline-flex items-center gap-2">
              <Icon name="pin" className="h-4 w-4 text-accent-amber" /> Built for India's destinations
            </span>
          </div>
        </Reveal>
      </div>

      <div className="pointer-events-none absolute bottom-8 right-8 hidden items-center gap-2 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-canvas/50 lg:flex">
        Scroll
        <span className="h-px w-10 bg-canvas/40" />
      </div>
    </section>
  );
}

/* ───────────────────────── TrustStrip ───────────────────────── */

function TrustStrip() {
  const partners = [
    {
      logo: "https://upload.wikimedia.org/wikipedia/commons/6/61/Makemytrip_logo.svg",
      name: "MakeMyTrip",
    },
    {
      logo: "https://upload.wikimedia.org/wikipedia/commons/3/32/Goibibo_Logo.svg",
      name: "Goibibo",
    },
    {
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/f8/EaseMyTrip_Logo.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original",
      name: "EaseMyTrip",
    },
    {
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Ixigo_logo.svg/3840px-Ixigo_logo.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail",
      name: "ixigo",
    },
    {
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/f8/EaseMyTrip_Logo.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original",
      name: "EaseMyTrip",
    },
    {
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdUVqnCTQ0s3YmhbAb5j5ZfAL3KAQUeQLaIwNosnKg8w&s",
      name: "Yatra",
    },
    {
      logo: "https://wp.logos-download.com/wp-content/uploads/2020/06/Cleartrip_Logo.png?dl",
      name: "Cleartrip",
    },
    {
      logo: "https://e7.pngegg.com/pngimages/542/120/png-clipart-logo-agoda-com-hotel-brand-travel-agent-hotel-emblem-text.png",
      name: "Agoda",
    },
  ];

  return (
    <section id="platform" className="relative overflow-hidden border-y border-line/60 bg-canvas py-10">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-ink-faint">
          Guiding work informed by leading travel research
        </p>
        <div className="relative mt-8 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-linear-to-r from-canvas to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-linear-to-l from-canvas to-transparent" />
          <div className="marquee-track gap-14 pr-14">
            {[...partners, ...partners].map((partner, i) => (
              <div key={`${partner.name}-${i}`} className="flex shrink-0 items-center gap-3 opacity-70 text-ink-soft">
                <span className="flex h-10 w-16 items-center justify-center rounded-lg border border-line bg-surface px-2 shadow-sm">
                  <img
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    className="max-h-7 max-w-full object-contain"
                  />
                </span>
                <span className="text-sm font-medium">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Destinations ───────────────────────── */

function DestinationsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!section || !viewport || !track) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const updateScrollPosition = () => {
      frame = 0;
      if (reducedMotion.matches || window.innerWidth < 768) {
        track.style.transform = "none";
        section.style.removeProperty("height");
        return;
      }

      const maxShift = Math.max(0, track.scrollWidth - viewport.clientWidth);
      const travel = window.innerHeight + maxShift;
      const start = section.offsetTop;
      const progress = Math.min(1, Math.max(0, (window.scrollY - start) / travel));

      section.style.height = `${travel + window.innerHeight}px`;
      track.style.transform = `translate3d(${-maxShift * progress}px, 0, 0)`;
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateScrollPosition);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    reducedMotion.addEventListener("change", requestUpdate);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      reducedMotion.removeEventListener("change", requestUpdate);
    };
  }, []);

  const places = [
    {
      img: "https://images.unsplash.com/photo-1696887484490-715e7eb0e682?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      region: "AGRA · MUGHAL HERITAGE",
      name: "The Taj Mahal",
      widths: "md:col-span-4",
      aspect: "aspect-[4/5] md:aspect-[4/5]"
    },
    {
      img: "https://images.unsplash.com/photo-1624890240392-da0b1aa01c90?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      region: "LADAKH · MOUNTAINS & VALLEYS",
      name: "The Land of High Passes",
      widths: "md:col-span-4",
      aspect: "aspect-[4/5] md:aspect-[4/5]"
    },
    {
      img: "https://images.unsplash.com/photo-1686472886489-1d2d7e08ff9c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      region: "MEGHALAYA · NORTHEAST INDIA",
      name: "Misty Meghalaya",
      widths: "md:col-span-4",
      aspect: "aspect-[4/5] md:aspect-[4/5]"
    },
    {
      img: "https://images.unsplash.com/photo-1609115771934-4ddf685a4fa2?q=80&w=685&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      region: "KASHMIR · THE HIMALAYAS",
      name: "Paradise on Earth",
      widths: "md:col-span-4",
      aspect: "aspect-[4/5] md:aspect-[4/5]"
    },
    {
      img: "https://plus.unsplash.com/premium_photo-1730035378497-6f182674961c?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      region: "ANDAMAN · BAY OF BENGAL",
      name: "Andaman Islands",
      widths: "md:col-span-4",
      aspect: "aspect-[4/5] md:aspect-[4/5]"
    },
    {
      img: "https://images.unsplash.com/photo-1716534134003-ba47907e119b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      region: "RAJASTHAN · DESERT & HERITAGE",
      name: "Where Royalty Lives",
      widths: "md:col-span-4",
      aspect: "aspect-[4/5] md:aspect-[4/5]"
    }
  ];

  return (
    <section ref={sectionRef} id="destinations" className="destination-scroll-section mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-28">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <Reveal dir="up">
          <p className="kicker">Curated for India</p>
          <h2 className="font-display mt-4 max-w-xl text-4xl leading-[1.05] md:text-6xl">
            Destinations that stay with you.
          </h2>
        </Reveal>
        <Reveal dir="up" delay={120}>
          <p className="max-w-sm leading-7 text-ink-soft">
            From high-altitude valleys to heritage corridors — understand every place before you
            arrive.
          </p>
        </Reveal>
      </div>

      <div ref={viewportRef} className="destination-scroll-viewport mt-14 overflow-hidden">
        <div ref={trackRef} className="destination-scroll-track grid gap-5 md:grid-cols-12">
        {places.map((place, i) => (
          <Reveal key={place.name} dir="up" delay={i * 80} className={place.widths}>
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(`${place.name}, India`)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Search Google for ${place.name}`}
              className="block h-full"
            >
              <figure className="group relative w-full overflow-hidden rounded-2xl bg-ink">
                <img
                  src={place.img}
                  alt={`${place.name} destination`}
                  loading="lazy"
                  className={`${place.aspect} w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105`}
                />
                <div className="absolute inset-0 bg-linear-to-t from-ink/90 via-ink/15 to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-7">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent-amber">{place.region}</p>
                    <p className="font-display mt-2 text-2xl text-canvas md:text-3xl">{place.name}</p>
                  </div>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-canvas/15 text-canvas ring-1 ring-canvas/30 backdrop-blur-md transition-transform group-hover:translate-x-1">
                    <Icon name="arrow-right" className="h-4 w-4" />
                  </span>
                </figcaption>
              </figure>
            </a>
          </Reveal>
        ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Platform ───────────────────────── */

function PlatformSection() {
  return (
    <section className="border-y border-line/60 bg-canvas-alt/40 py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal dir="up">
          <p className="kicker">The foundation</p>
          <h2 className="font-display mt-4 max-w-2xl text-4xl leading-[1.05] md:text-6xl">
            A solid base for every journey, already in place.
          </h2>
        </Reveal>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <Reveal dir="up">
            <PlatformCard
              icon="shield-check"
              number="01"
              title="Secure accounts, live now"
              body="Create your workspace and sign in with confidence. Sessions are protected with signed JWT tokens, so your saved ideas stay yours."
              accent="green"
            />
          </Reveal>
          <Reveal dir="up" delay={90}>
            <PlatformCard
              icon="dashboard"
              number="02"
              title="One place for trip ideas"
              body="Your dashboard is your basecamp: a home for destinations you want to explore, questions you want answered, and plans to revisit."
              accent="amber"
            />
          </Reveal>
          <Reveal dir="up" delay={180}>
            <PlatformCard
              icon="trend"
              number="03"
              title="Built to grow with real data"
              body="New intelligence services map onto the same account. Nothing future-facing is faked; what's not live yet is clearly marked."
              accent="green"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const cardAccents = {
  green: "text-accent-green",
  amber: "text-accent-amber",
  red: "text-accent-red"
} as const;

const cardIconAccents = {
  green: "bg-accent-green-soft text-accent-green",
  amber: "bg-accent-amber-soft text-accent-amber",
  red: "bg-accent-red-soft text-accent-red"
} as const;

function PlatformCard({
  icon,
  number,
  title,
  body,
  accent
}: {
  icon: IconName;
  number: string;
  title: string;
  body: string;
  accent: keyof typeof cardAccents;
}) {
  return (
    <article className="card lift-card group flex h-full flex-col p-8">
      <div className="flex items-center justify-between">
        <span className={`grid h-12 w-12 place-items-center rounded-xl ${cardIconAccents[accent]}`}>
          <Icon name={icon} className="h-5 w-5" />
        </span>
        <span className={`font-display text-2xl ${cardAccents[accent]}`}>{number}</span>
      </div>
      <h3 className="font-display mt-7 text-2xl">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-ink-soft">{body}</p>
      <span className="mt-auto pt-7" aria-hidden="true">
        <Icon name="arrow-right" className="h-5 w-5 text-ink-faint transition-transform duration-500 group-hover:translate-x-1.5 group-hover:text-accent-green" />
      </span>
    </article>
  );
}

/* ───────────────────────── Services ───────────────────────── */

function ServicesSection() {
  return (
    <section id="services" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-28">
      <Reveal dir="up">
        <p className="kicker">The roadmap</p>
        <h2 className="font-display mt-4 max-w-2xl text-4xl leading-[1.05] md:text-6xl">
          Intelligence services, staged honestly.
        </h2>
        <p className="mt-6 max-w-xl leading-7 text-ink-soft">
          Three capabilities are mapped onto your account. Each is researched and planned; the status
          of each is communicated plainly so you always know what to expect.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {services.map((service, i) => (
          <Reveal key={service.slug} dir="up" delay={i * 90}>
            <ServiceCard service={service} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const serviceIcons: Record<string, IconName> = {
  assistant: "compass",
  helpers: "users",
  comparison: "scale",
  sos: "shield"
};

function ServiceCard({ service }: { service: (typeof services)[number] }) {
  return (
    <article className="card lift-card group flex h-full flex-col p-8">
      <div className="flex items-start justify-between gap-4">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-canvas text-ink-faint ring-1 ring-line transition-colors group-hover:bg-accent-green group-hover:text-canvas group-hover:ring-accent-green">
          <Icon name={serviceIcons[service.slug] ?? "sparkles"} className="h-5 w-5" />
        </span>
        <span className={`badge ${statusTone(service.status)}`}>{service.status}</span>
      </div>
      <h3 className="font-display mt-7 text-2xl">{service.title}</h3>
      <p className="mt-3 text-sm leading-6 text-ink-soft">{service.summary}</p>

      <ul className="mt-6 space-y-3 border-t border-line/70 pt-6">
        {service.purpose.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm text-ink-soft">
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-green-soft text-accent-green">
              <Icon name="check" className="h-3 w-3" />
            </span>
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-7">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent-green">
          {service.cta}
          <Icon name="arrow-right" className="h-4 w-4 transition-transform duration-400 group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}

/* ───────────────────────── Experience Band ───────────────────────── */

function ExperienceBand() {
  return (
    <section className="relative overflow-hidden border-y border-line/60 bg-ink py-24 text-canvas md:py-32">
      <img
        src="https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=2000&q=80"
        alt="Himalayan mountain road at golden hour"
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-linear-to-r from-ink via-ink/85 to-ink/40" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <Reveal dir="up">
          <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-accent-amber">
            <Icon name="sparkles" className="h-4 w-4" /> The experience
          </p>
          <h2 className="font-display mt-5 max-w-2xl text-4xl leading-[1.06] md:text-6xl">
            Plan with clarity. Travel with confidence.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-canvas/15 bg-canvas/15 sm:grid-cols-3">
          {[
            { icon: "search" as IconName, title: "Compare real prices", body: "Live market analysis across trusted providers so you always know a fair price before you book." },
            { icon: "trend" as IconName, title: "Understand conditions", body: "Destination and weather context researched carefully, so nothing catches you by surprise." },
            { icon: "shield" as IconName, title: "Stay prepared", body: "Emergency and limited-connectivity research designed in from the very start." }
          ].map((item, i) => (
            <div key={item.title} className="flex flex-col gap-4 bg-ink/70 p-8 backdrop-blur-sm">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-canvas/10 text-accent-amber ring-1 ring-canvas/20">
                <Icon name={item.icon} className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-canvas/45">0{i + 1}</p>
                <h3 className="font-display mt-2 text-xl">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-canvas/70">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── How It Works ───────────────────────── */

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
    <section id="how" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-28">
      <Reveal dir="up">
        <p className="kicker">How it works</p>
        <h2 className="font-display mt-4 max-w-2xl text-4xl leading-[1.05] md:text-6xl">
          From first sign-in to fully informed travel.
        </h2>
      </Reveal>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {steps.map((step, i) => (
          <Reveal key={step.title} dir="up" delay={i * 100}>
            <div className="relative h-full overflow-hidden rounded-2xl border border-line bg-surface p-8">
              <span className="absolute -right-2 -top-6 font-display text-[7rem] leading-none text-ink/5">
                {`0${i + 1}`}
              </span>
              <span className="grid h-12 w-12 place-items-center rounded-full bg-ink font-display text-lg text-canvas shadow-lg shadow-ink/20">
                {`0${i + 1}`}
              </span>
              <h3 className="font-display mt-7 text-2xl">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-ink-soft">{step.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────── Principles ───────────────────────── */

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
    <section id="principles" className="border-t border-line/60 bg-canvas-alt/40 py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal dir="up">
          <p className="kicker">Principles</p>
          <h2 className="font-display mt-4 max-w-2xl text-4xl leading-[1.05] md:text-6xl">
            How we build, so you can trust the journey.
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
          {principles.map((principle, i) => (
            <Reveal key={principle.title} dir="up" delay={i * 80}>
              <div className="group flex h-full flex-col justify-between gap-8 bg-surface p-8 transition-colors hover:bg-canvas md:p-10">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-2xl md:text-3xl">{principle.title}</h3>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent-green-soft text-sm font-semibold text-accent-green">
                    {`0${i + 1}`}
                  </span>
                </div>
                <p className="max-w-md text-sm leading-7 text-ink-soft">{principle.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Final CTA ───────────────────────── */

function FinalCta() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <img
        src="https://images.unsplash.com/photo-1646327537880-962a5276e4bf?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Sunrise over an open valley road"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-ink/30" />
      <Reveal dir="scale">
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <p className="inline-flex items-center gap-2.5 rounded-full bg-canvas/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-canvas/85 ring-1 ring-canvas/25 backdrop-blur-md">
            <Icon name="compass" className="h-3.5 w-3.5 text-accent-amber" /> Your basecamp awaits
          </p>
          <h2 className="font-display mt-6 text-4xl leading-[1.05] text-canvas md:text-6xl [text-shadow:0_3px_30px_rgba(0,0,0,0.4)]">
            Start your journey today.
          </h2>
          <p className="mx-auto mt-6 max-w-xl leading-7 text-canvas/80">
            Create a free account and see what a travel intelligence workspace looks like. Explore
            the product with one click.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link to="/signup" className="btn btn-canvas px-7! py-3.5! text-base">
              Get started
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
            <Link to="/login" className="btn btn-outline-light px-7! py-3.5! text-base">
              Explore the demo
            </Link>
            <Link to="/helper/signup" className="btn btn-outline-light px-7! py-3.5! text-base">
              Become a travel helper
              <Icon name="users" className="h-4 w-4" />
            </Link>
            <Link to="/helper/login" className="btn btn-outline-light px-7! py-3.5! text-base">
              Helper login
              <Icon name="users" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ───────────────────────── Footer ───────────────────────── */

function Footer() {
  return (
    <footer className="border-t border-line bg-canvas-alt/50">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Brand className="text-2xl" />
            <p className="mt-4 max-w-xs text-sm leading-6 text-ink-soft">
              A travel intelligence foundation. Research-led, honestly staged, and built for India's
              destinations.
            </p>
            <p className="mt-6 text-xs text-ink-faint">Foundation release 2026</p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.18em] text-ink-faint">Explore</h4>
            <ul className="mt-4 space-y-3 text-sm text-ink-soft">
              <li><a href="#destinations" className="transition-colors hover:text-ink">Destinations</a></li>
              <li><a href="#services" className="transition-colors hover:text-ink">Services</a></li>
              <li><a href="#how" className="transition-colors hover:text-ink">How it works</a></li>
              <li><a href="#principles" className="transition-colors hover:text-ink">Principles</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.18em] text-ink-faint">Account</h4>
            <ul className="mt-4 space-y-3 text-sm text-ink-soft">
              <li><Link to="/login" className="transition-colors hover:text-ink">Log in</Link></li>
              <li><Link to="/helper/login" className="transition-colors hover:text-ink">Helper login</Link></li>
              <li><Link to="/signup" className="transition-colors hover:text-ink">Create account</Link></li>
              <li><a href="#platform" className="transition-colors hover:text-ink">The platform</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.18em] text-ink-faint">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm text-ink-soft">
              <li><a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=saveitrip@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block transition-all duration-200 hover:scale-105 hover:text-accent-green hover:underline underline-offset-4"
              >
                saveitrip@gmail.com
              </a></li>
              <li>Mon–Fri, 9:00–18:00 IST</li>
              <li className="text-ink-faint">West Bengal, India</li>
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
