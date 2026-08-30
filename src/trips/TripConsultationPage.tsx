import AppShell from "../shared/AppShell";

const fields = ["Destination", "Travel dates", "Number of travelers", "Approximate budget", "Travel type", "Interests and preferences"];

export default function TripConsultationPage() {
  return (
    <AppShell>
      <section className="grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm text-ink-faint">Trip consultation</p>
          <h1 className="font-display mt-3 text-4xl leading-tight md:text-5xl">Shape the trip brief now. Intelligence comes later.</h1>
          <p className="mt-5 max-w-xl text-ink-soft">
            This form is the future intake surface for trip planning. It does not analyze, recommend, price, or call an ML service yet.
          </p>
          <div className="mt-8 rounded-sm bg-accent-amber-soft p-5 text-sm text-accent-amber">
            Trip Intelligence is being prepared.
          </div>
        </div>
        <form className="rounded-sm bg-surface p-6 shadow-[0_24px_70px_-45px_rgba(32,29,24,0.35)] md:p-8">
          <div className="grid gap-4 md:grid-cols-2">
            {fields.map((label) => (
              <label key={label} className={label.includes("Interests") ? "block md:col-span-2" : "block"}>
                <span className="text-sm text-ink-soft">{label}</span>
                {label.includes("Interests") ? (
                  <textarea className="mt-2 min-h-28 w-full rounded-sm border border-line bg-canvas px-4 py-3 outline-none focus:border-ink" placeholder="Food, mountains, heritage walks, slow travel..." />
                ) : (
                  <input className="mt-2 w-full rounded-sm border border-line bg-canvas px-4 py-3 outline-none focus:border-ink" placeholder={label} />
                )}
              </label>
            ))}
          </div>
          <button type="button" className="mt-6 w-full rounded-sm bg-ink px-5 py-3 text-sm font-medium text-canvas">
            Trip Intelligence is being prepared
          </button>
        </form>
      </section>
    </AppShell>
  );
}
