import { useState } from "react";
import AppShell from "../shared/AppShell";
import { Icon, type IconName } from "../shared/Icon";

const plans = [
  {
    id: "casual",
    name: "Casual Traveler",
    price: 199,
    description: "For easy weekend planning and the occasional escape.",
    icon: "compass" as IconName,
    accent: "bg-accent-green-soft text-accent-green",
    popular: false,
    features: [
      "30 assistant messages / month",
      "10 destination plans / month",
      "5 market comparisons / month",
      "Basic travel risk insights",
    ],
  },
  {
    id: "explorer",
    name: "Explorer",
    price: 399,
    description: "For travelers who plan often and go further.",
    icon: "route" as IconName,
    accent: "bg-ink text-canvas",
    popular: true,
    features: [
      "150 assistant messages / month",
      "40 destination plans / month",
      "25 market comparisons / month",
      "Advanced budget and risk insights",
    ],
  },
  {
    id: "adventurer",
    name: "Adventurer",
    price: 699,
    description: "For deep itineraries, frequent trips, and more context.",
    icon: "zap" as IconName,
    accent: "bg-accent-amber-soft text-accent-amber",
    popular: false,
    features: [
      "500 assistant messages / month",
      "Unlimited destination plans",
      "100 market comparisons / month",
      "Priority access to every module",
    ],
  },
] as const;

const modules = [
  {
    name: "Travel Assistant",
    summary: "Planning, budgets, recommendations",
    icon: "sparkles" as IconName,
    values: ["30 messages", "150 messages", "500 messages"],
  },
  {
    name: "Market Analysis",
    summary: "Compare stays and travel prices",
    icon: "scale" as IconName,
    values: ["5 comparisons", "25 comparisons", "100 comparisons"],
  },
  {
    name: "Travel Helper",
    summary: "Local guides and destination context",
    icon: "users" as IconName,
    values: ["Basic access", "Full access", "Priority access"],
  },
  {
    name: "Safety & SOS",
    summary: "Risk signals and emergency support",
    icon: "shield-check" as IconName,
    values: ["Basic insights", "Advanced insights", "Advanced + priority"],
  },
];

export default function PaymentsPage() {
  const [selectedPlan, setSelectedPlan] = useState("explorer");
  const activePlan = plans.find((plan) => plan.id === selectedPlan) ?? plans[1];

  return (
    <AppShell>
      <div className="page-fade mx-auto max-w-6xl">
        <section className="border-b border-line pb-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="kicker">Plans & usage</p>
              <h1 className="font-display mt-3 text-4xl leading-[1.05] md:text-5xl">
                More room to roam.
              </h1>
              <p className="mt-4 max-w-xl leading-7 text-ink-soft">
                Choose the travel workspace that matches how often you explore. This is a prototype preview; no payment is collected.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-line bg-surface-high px-4 py-3 text-sm shadow-card">
              <span className="grid h-8 w-8 place-items-center rounded-md bg-accent-green-soft text-accent-green">
                <Icon name="lock" className="h-4 w-4" />
              </span>
              <div>
                <p className="font-medium">Prototype checkout</p>
                <p className="text-xs text-ink-faint">No card required</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-xl border border-line bg-surface-high p-5 shadow-card md:flex md:items-center md:justify-between md:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-ink text-canvas">
              <Icon name="sparkles" className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-faint">Your preview plan</p>
              <p className="mt-1 font-display text-xl">{activePlan.name}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4 md:mt-0">
            <p className="text-sm text-ink-soft"><span className="font-semibold text-ink">{activePlan.price}</span> / month</p>
            <span className="badge bg-accent-amber-soft text-accent-amber">Preview only</span>
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => {
            const selected = selectedPlan === plan.id;
            return (
              <article
                key={plan.id}
                className={`relative flex flex-col rounded-xl border p-6 transition-all duration-200 hover:z-10 hover:scale-[1.02] ${
                  selected
                    ? "border-ink bg-surface-high shadow-panel"
                    : "border-line bg-surface-high/65 hover:border-line-strong hover:bg-surface-high"
                } ${plan.popular ? "hover:scale-[1.04]" : ""}`}
              >
                {plan.popular && (
                  <span className="absolute right-5 top-5 badge bg-accent-green-soft text-accent-green">Most popular</span>
                )}
                <div className={`grid h-10 w-10 place-items-center rounded-lg ${plan.accent}`}>
                  <Icon name={plan.icon} className="h-5 w-5" />
                </div>
                <h2 className="font-display mt-5 text-2xl">{plan.name}</h2>
                <p className="mt-2 min-h-12 text-sm leading-6 text-ink-soft">{plan.description}</p>
                <div className="mt-6 flex items-baseline gap-1 border-b border-line pb-5">
                  <span className="font-display text-4xl">₹{plan.price}</span>
                  <span className="text-sm text-ink-faint">/ month</span>
                </div>
                <ul className="mt-5 space-y-3 text-sm text-ink-soft">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-accent-green" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`btn mt-7 w-full justify-center ${selected ? "btn-primary" : "btn-outline"}`}
                >
                  {selected ? "Selected plan" : "Choose plan"}
                </button>
              </article>
            );
          })}
        </section>

        <section className="mt-12">
          <div className="flex flex-col gap-2 border-b border-line pb-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="kicker">Module access</p>
              <h2 className="font-display mt-2 text-3xl">Everything gets more capable</h2>
            </div>
            <p className="text-sm text-ink-faint">Monthly limits reset on your billing date</p>
          </div>

          <div className="mt-5 overflow-hidden rounded-xl border border-line bg-surface-high shadow-card">
            <div className="hidden grid-cols-[1.4fr_repeat(3,1fr)] border-b border-line bg-canvas-alt/60 px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-ink-faint md:grid">
              <span>Module</span>
              <span>Casual</span>
              <span>Explorer</span>
              <span>Adventurer</span>
            </div>
            {modules.map((module, index) => (
              <div key={module.name} className={`grid gap-4 px-5 py-5 md:grid-cols-[1.4fr_repeat(3,1fr)] md:items-center ${index < modules.length - 1 ? "border-b border-line" : ""}`}>
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-canvas text-ink-soft">
                    <Icon name={module.icon} className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{module.name}</p>
                    <p className="mt-1 text-xs text-ink-faint">{module.summary}</p>
                  </div>
                </div>
                {module.values.map((value, valueIndex) => (
                  <div key={value} className="flex items-center justify-between border-t border-line/70 pt-3 text-sm md:block md:border-0 md:pt-0">
                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-faint md:hidden">{plans[valueIndex].name}</span>
                    <span className={valueIndex === 1 ? "font-medium text-accent-green" : "text-ink-soft"}>{value}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        <p className="mt-8 pb-4 text-center text-xs text-ink-faint">
          Plan selection is for demonstration only. Payments, invoices, and subscription management are not connected yet.
        </p>
      </div>
    </AppShell>
  );
}
