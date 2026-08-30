import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import AppShell from "../shared/AppShell";
import { services } from "../shared/services";

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
      <section className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-stretch">
        <div className="rounded-sm bg-ink p-8 text-canvas md:p-12">
          <p className="text-sm text-canvas/65">SaveiTrip travel intelligence platform</p>
          <h1 className="font-display mt-5 max-w-2xl text-4xl leading-tight md:text-6xl">
            {greeting()}, {firstName}. Where are you planning to go?
          </h1>
          <p className="mt-6 max-w-xl text-canvas/75">
            Your product workspace is ready. The trip, market, intelligence and SOS modules are staged for upcoming MVPs.
          </p>
          <Link to="/trips/new" className="mt-8 inline-block rounded-sm bg-canvas px-6 py-3 text-sm font-medium text-ink transition hover:-translate-y-0.5">
            Start a Trip Consultation
          </Link>
        </div>
        <div className="relative min-h-80 overflow-hidden rounded-sm">
          <img src="https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1400&q=80" alt="Himalayan road and mountain landscape" className="h-full w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-6 text-canvas">
            <p className="text-sm text-canvas/75">Current workspace status</p>
            <p className="font-display mt-1 text-2xl">Foundation release</p>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm text-ink-faint">Product services</p>
            <h2 className="font-display mt-2 text-3xl">Explore what SaveiTrip will provide</h2>
          </div>
          <p className="max-w-md text-sm text-ink-soft">These modules are intentionally non-functional today. Each screen defines the future product boundary without fake results.</p>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {services.map((service) => (
            <article key={service.slug} className="flex min-h-80 flex-col rounded-sm bg-surface p-6 shadow-[0_24px_70px_-45px_rgba(32,29,24,0.35)] transition hover:-translate-y-1">
              <div className="flex items-start justify-between gap-4">
                <span className="font-display text-4xl text-ink-faint">{service.number}</span>
                <span className="rounded-sm bg-accent-green-soft px-3 py-1 text-xs font-medium text-accent-green">{service.status}</span>
              </div>
              <h3 className="font-display mt-6 text-2xl">{service.title}</h3>
              <p className="mt-3 text-sm text-ink-soft">{service.summary}</p>
              <ul className="mt-5 space-y-2 text-sm text-ink-soft">
                {service.purpose.slice(0, 3).map((item) => <li key={item}>- {item}</li>)}
              </ul>
              <Link to={`/${service.slug}`} className="mt-auto inline-flex w-fit rounded-sm border border-ink px-4 py-2 text-sm transition hover:bg-ink hover:text-canvas">
                {service.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
