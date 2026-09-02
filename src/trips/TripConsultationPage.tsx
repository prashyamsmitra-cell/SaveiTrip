import AppShell from "../shared/AppShell";
import { Icon } from "../shared/Icon";

const fields = [
  { label: "Destination", placeholder: "e.g. Ladakh, Kerala, Spiti" },
  { label: "Travel dates", placeholder: "e.g. October 15–22, 2026" },
  { label: "Number of travelers", placeholder: "2" },
  { label: "Approximate budget", placeholder: "e.g. ₹40,000–₹60,000" },
  { label: "Travel type", placeholder: "e.g. solo, couple, family" },
  { label: "Interests and preferences", placeholder: "Food, mountains, heritage walks, slow travel..." }
];

export default function TripConsultationPage() {
  return (
    <AppShell>
      <section className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <p className="kicker">Trip consultation</p>
          <h1 className="font-display mt-3 text-4xl leading-[1.05] md:text-5xl">
            Shape the trip brief now. Intelligence comes later.
          </h1>
          <p className="mt-5 max-w-xl leading-7 text-ink-soft">
            This form is the future intake surface for trip planning. It does not analyze, recommend, price, or call an ML service yet.
          </p>
          <div className="mt-8 flex items-start gap-3 rounded-lg border border-accent-amber/25 bg-accent-amber-soft px-5 py-4">
            <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0 text-accent-amber" />
            <div>
              <p className="text-sm font-medium text-accent-amber">Trip Intelligence is being prepared.</p>
              <p className="mt-1 text-xs text-accent-amber/70">This form captures your preferences for future processing.</p>
            </div>
          </div>
        </div>

        <form className="card p-6 md:p-8" onSubmit={(e) => e.preventDefault()}>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map(({ label, placeholder }) => (
              <label key={label} className={label.includes("Interests") ? "block sm:col-span-2" : "block"}>
                <span className="field-label">{label}</span>
                {label.includes("Interests") ? (
                  <textarea
                    className="input min-h-28"
                    placeholder={placeholder}
                  />
                ) : (
                  <input className="input" placeholder={placeholder} />
                )}
              </label>
            ))}
          </div>
          <button type="button" className="btn btn-primary mt-6 w-full justify-center opacity-75">
            <Icon name="lock" className="h-4 w-4" />
            Trip Intelligence is being prepared
          </button>
        </form>
      </section>
    </AppShell>
  );
}
