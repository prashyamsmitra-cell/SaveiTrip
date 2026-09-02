import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import AppShell from "../shared/AppShell";
import { services, statusTone } from "../shared/services";
import { Icon, type IconName } from "../shared/Icon";

const serviceIcons: Record<string, IconName> = {
  comparison: "scale",
  prediction: "trend",
  sos: "shield"
};

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

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
              Your workspace is set up and secure. Compare live stays today; trip, intelligence and SOS modules are staged for upcoming releases.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/trips/new" className="btn btn-canvas">
                <Icon name="route" className="h-4 w-4" />
                Start a Trip Consultation
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
                <Icon name="route" className="h-4 w-4" />
                Basecamp for trip ideas
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
              <p className="font-display mt-1.5 text-2xl">Foundation release</p>
              <p className="mt-1.5 text-[0.8rem] text-canvas/70">
                Live: Market Analysis · Staged: Trip, Intelligence, SOS
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="kicker">Product services</p>
            <h2 className="font-display mt-2 text-3xl">Explore what SaveiTrip will provide</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-ink-soft">
            These modules define the product boundary. Each screen shows real status: what works today, and what is not yet released.
          </p>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.slug}
              className="card group flex min-h-[21rem] flex-col p-6 hover:shadow-card-hover"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-canvas text-ink-faint transition-colors group-hover:bg-accent-green-soft group-hover:text-accent-green">
                  <Icon name={serviceIcons[service.slug] ?? "sparkles"} className="h-5 w-5" />
                </div>
                <span className={`badge ${statusTone(service.status)}`}>{service.status}</span>
              </div>
              <h3 className="font-display mt-5 text-2xl">{service.title}</h3>
              <p className="mt-2.5 text-sm leading-6 text-ink-soft">{service.summary}</p>
              <ul className="mt-4 space-y-2 border-t border-line/70 pt-4 text-sm text-ink-soft">
                {service.purpose.slice(0, 3).map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Icon name="check" className="mt-1 h-3.5 w-3.5 shrink-0 text-accent-green" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to={`/${service.slug}`}
                className="btn btn-outline mt-auto w-full justify-center group-hover:border-ink group-hover:bg-ink group-hover:text-canvas"
              >
                {service.cta}
                <Icon name="arrow-right" className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
