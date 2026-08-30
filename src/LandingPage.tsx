import { Link } from "react-router-dom";
import { services } from "./shared/services";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="absolute inset-x-0 top-0 z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">
          <Link to="/" className="font-display text-xl text-canvas">SaveiTrip</Link>
          <nav className="flex items-center gap-4">
            <Link to="/login" className="text-sm text-canvas/85 hover:text-canvas">Log in</Link>
            <Link to="/signup" className="rounded-sm bg-canvas px-4 py-2 text-sm font-medium text-ink transition hover:-translate-y-0.5">Get started</Link>
          </nav>
        </div>
      </header>

      <section className="relative flex min-h-[92dvh] items-end overflow-hidden pb-16">
        <img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2400&q=80" alt="Open road through a mountain valley" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/35 to-ink/15" />
        <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
          <p className="text-sm text-canvas/75">Premium travel intelligence foundation</p>
          <h1 className="font-display mt-4 max-w-4xl text-5xl leading-[1.02] text-canvas md:text-7xl">SaveiTrip</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-canvas/82">
            A travel-tech workspace for trip consultation, market analysis, destination intelligence and emergency research. The intelligence services are staged for future MVPs; authentication and account foundations are active now.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/signup" className="rounded-sm bg-canvas px-6 py-3 text-sm font-medium text-ink transition hover:-translate-y-0.5">Create account</Link>
            <Link to="/login" className="rounded-sm border border-canvas/50 px-6 py-3 text-sm text-canvas transition hover:bg-canvas/10">Log in</Link>
          </div>
        </div>
      </section>

      <main>
        <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <div className="max-w-2xl">
            <p className="text-sm text-ink-faint">Product shell</p>
            <h2 className="font-display mt-3 text-4xl leading-tight">Everything planned is visible. Nothing future-facing is faked.</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {services.map((service) => (
              <article key={service.slug} className="rounded-sm bg-surface p-6 shadow-[0_24px_70px_-45px_rgba(32,29,24,0.35)]">
                <div className="flex items-center justify-between">
                  <span className="font-display text-4xl text-ink-faint">{service.number}</span>
                  <span className="rounded-sm bg-accent-green-soft px-3 py-1 text-xs font-medium text-accent-green">{service.status}</span>
                </div>
                <h3 className="font-display mt-6 text-2xl">{service.title}</h3>
                <p className="mt-3 text-sm text-ink-soft">{service.summary}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-line px-5 py-8 text-center text-sm text-ink-faint">
        SaveiTrip. Travel intelligence foundation release.
      </footer>
    </div>
  );
}
