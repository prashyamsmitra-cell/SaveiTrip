import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import AppShell from "./AppShell";
import type { Service } from "./services";

export default function ServiceDetail({ service, children }: { service: Service; children: ReactNode }) {
  return (
    <AppShell>
      <Link to="/dashboard" className="text-sm text-ink-soft underline underline-offset-4">Back to dashboard</Link>
      <section className="mt-6 grid gap-8 md:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="font-display text-5xl text-ink-faint">{service.number}</p>
          <h1 className="font-display mt-4 text-4xl leading-tight md:text-5xl">{service.title}</h1>
          <p className="mt-5 max-w-xl text-ink-soft">{service.summary}</p>
          <span className="mt-6 inline-block rounded-sm bg-accent-green-soft px-3 py-1 text-sm font-medium text-accent-green">{service.status}</span>
          <ul className="mt-8 space-y-3 text-sm text-ink-soft">
            {service.purpose.map((item) => <li key={item}>- {item}</li>)}
          </ul>
        </div>
        <div className="rounded-sm bg-surface p-6 shadow-[0_24px_70px_-45px_rgba(32,29,24,0.35)] md:p-8">
          {children}
        </div>
      </section>
    </AppShell>
  );
}
