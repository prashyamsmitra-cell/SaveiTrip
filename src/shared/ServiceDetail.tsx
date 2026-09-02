import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import AppShell from "./AppShell";
import { Icon } from "./Icon";
import { statusTone, type Service } from "./services";

export default function ServiceDetail({ service, children }: { service: Service; children: ReactNode }) {
  return (
    <AppShell>
      <Link
        to="/dashboard"
        className="group inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
      >
        <Icon name="arrow-left" className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        Back to dashboard
      </Link>
      <section className="mt-8 grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-display text-5xl leading-none text-ink-faint">{service.number}</span>
            <span className={`badge ${statusTone(service.status)}`}>{service.status}</span>
          </div>
          <h1 className="font-display mt-4 text-4xl leading-[1.05] md:text-5xl">{service.title}</h1>
          <p className="mt-5 max-w-xl leading-7 text-ink-soft">{service.summary}</p>
          <ul className="mt-8 space-y-3">
            {service.purpose.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-ink-soft">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-green-soft text-accent-green">
                  <Icon name="check" className="h-3 w-3" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-6 md:p-8">{children}</div>
      </section>
    </AppShell>
  );
}
