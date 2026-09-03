import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import AppShell from "../shared/AppShell";
import { Icon } from "../shared/Icon";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

const features = [
  {
    title: "Travel Assistant",
    summary: "Chat naturally to plan trips, check risks, estimate budgets, and explore destinations.",
    icon: "sparkles" as const,
    to: "/assistant",
    cta: "Open Assistant",
    live: true,
  },
  {
    title: "Travel Helper",
    summary: "Find verified local guides and helpers for authentic travel experiences.",
    icon: "users" as const,
    to: "/helpers",
    cta: "Browse Helpers",
    live: true,
  },
  {
    title: "Market Analysis",
    summary: "Compare live accommodation prices across multiple providers.",
    icon: "scale" as const,
    to: "/comparison",
    cta: "Compare Prices",
    live: true,
  },
  {
    title: "Emergency SOS",
    summary: "Emergency communication support for limited-connectivity areas.",
    icon: "shield" as const,
    to: "/sos",
    cta: "Learn More",
    live: false,
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.name.split(" ")[0] ?? "traveller";

  return (
    <AppShell>
      <section className="overflow-hidden rounded-xl shadow-panel">
        <div className="grid lg:grid-cols-[1.12fr_0.88fr]">
          <div className="relative z-10 bg-ink p-8 text-canvas md:p-12">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-canvas/55">
              <Icon name="compass" className="h-4 w-4 text-accent-amber" />
              SaveiTrip travel intelligence
            </div>
            <h1 className="font-display mt-5 max-w-xl text-4xl leading-[1.05] md:text-5xl">
              {greeting()}, {firstName}.{" "}
              <span className="italic text-canvas/75">Where are you headed?</span>
            </h1>
            <p className="mt-5 max-w-lg leading-7 text-canvas/70">
              Your unified travel assistant is ready. Plan trips, check safety, compare prices, and find local helpers — all in one place.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/assistant" className="btn btn-canvas">
                <Icon name="sparkles" className="h-4 w-4" />
                Open Travel Assistant
              </Link>
              <Link to="/comparison" className="btn btn-outline-light">
                <Icon name="scale" className="h-4 w-4" />
                Compare live prices
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-canvas/15 pt-6 text-[0.8rem] text-canvas/65">
              <span className="inline-flex items-center gap-2">
                <Icon name="shield-check" className="h-4 w-4 text-accent-amber" />
                JWT-secured session
              </span>
              <span className="inline-flex items-center gap-2">
                <Icon name="sparkles" className="h-4 w-4" />
                One assistant, many capabilities
              </span>
              <span className="inline-flex items-center gap-2">
                <Icon name="zap" className="h-4 w-4" />
                Built for India's destinations
              </span>
            </div>
          </div>
          <div className="relative min-h-64 lg:min-h-full">
            <img
              src="https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1400&q=80"
              alt="Himalayan road and mountain landscape"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 from-25% via-ink/30 to-transparent lg:bg-gradient-to-r lg:from-ink/65 lg:via-transparent lg:to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-canvas/55">Workspace status</p>
              <p className="font-display mt-1.5 text-2xl">Travel Assistant live</p>
              <p className="mt-1.5 text-[0.8rem] text-canvas/70">
                Live: Assistant · Helpers · Market Analysis · Staged: SOS
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="kicker">Product services</p>
            <h2 className="font-display mt-2 text-3xl">Everything you need for Indian travel</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-ink-soft">
            Your travel workspace — one assistant with multiple capabilities.
          </p>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="card group flex min-h-[16rem] flex-col p-6 hover:shadow-card-hover"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-canvas text-ink-faint transition-colors group-hover:bg-accent-green-soft group-hover:text-accent-green">
                  <Icon name={feature.icon} className="h-5 w-5" />
                </div>
                <span className={`badge ${feature.live ? "bg-accent-green-soft text-accent-green" : "bg-accent-amber-soft text-accent-amber"}`}>
                  {feature.live ? "Live" : "Coming Soon"}
                </span>
              </div>
              <h3 className="font-display mt-5 text-2xl">{feature.title}</h3>
              <p className="mt-2.5 text-sm leading-6 text-ink-soft">{feature.summary}</p>
              <Link
                to={feature.to}
                className="btn btn-outline mt-auto w-full justify-center group-hover:border-ink group-hover:bg-ink group-hover:text-canvas"
              >
                {feature.cta}
                <Icon name="arrow-right" className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
