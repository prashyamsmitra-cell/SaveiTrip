import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import AppShell from "../shared/AppShell";
import { Icon } from "../shared/Icon";

const actions = [
  {
    title: "Manage your profile",
    summary: "Keep your destination, bio, and contact details ready for travelers.",
    to: "/helper/profile-setup",
    label: "Open profile",
    icon: "user" as const
  },
  {
    title: "Raise a local alert",
    summary: "Share verified weather, transport, safety, or accommodation updates.",
    to: "/helpers/alert",
    label: "Raise alert",
    icon: "shield" as const
  },
  {
    title: "Explore the helper network",
    summary: "See how travelers discover local expertise across India.",
    to: "/helpers",
    label: "Browse helpers",
    icon: "users" as const
  }
];

export default function HelperDashboardPage() {
  const { user } = useAuth();
  const firstName = user?.name.split(" ")[0] ?? "helper";

  return (
    <AppShell helperMode>
      <section className="overflow-hidden rounded-xl bg-ink text-canvas shadow-panel">
        <div className="grid gap-8 p-8 md:p-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-canvas/55">
              <Icon name="users" className="h-4 w-4 text-accent-amber" />
              Helper workspace
            </div>
            <h1 className="font-display mt-5 max-w-xl text-4xl leading-[1.05] md:text-5xl">
              Welcome, {firstName}. <span className="italic text-canvas/75">Your local knowledge matters.</span>
            </h1>
            <p className="mt-5 max-w-xl leading-7 text-canvas/70">
              Help travelers make better decisions with practical local insight, timely alerts, and a profile they can trust.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/helper/profile-setup" className="btn btn-canvas">
                <Icon name="user" className="h-4 w-4" />
                Complete your profile
              </Link>
              <Link to="/helpers/alert" className="btn btn-outline-light">
                <Icon name="shield" className="h-4 w-4" />
                Raise an alert
              </Link>
            </div>
          </div>
          <div className="border-t border-canvas/15 pt-6 lg:border-l lg:border-t-0 lg:pl-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-canvas/50">Helper status</p>
            <p className="font-display mt-3 text-3xl">Ready to contribute</p>
            <p className="mt-2 text-sm leading-6 text-canvas/65">
              Your account is active. Keep your profile current so travelers know what you can offer.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <p className="kicker">Your workspace</p>
        <h2 className="font-display mt-2 text-3xl">Useful next steps</h2>
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {actions.map((action) => (
            <article key={action.title} className="card flex flex-col p-6">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent-green-soft text-accent-green">
                <Icon name={action.icon} className="h-5 w-5" />
              </div>
              <h3 className="font-display mt-5 text-2xl">{action.title}</h3>
              <p className="mt-2.5 flex-1 text-sm leading-6 text-ink-soft">{action.summary}</p>
              <Link to={action.to} className="btn btn-outline mt-6 w-full justify-center">
                {action.label}
                <Icon name="arrow-right" className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
