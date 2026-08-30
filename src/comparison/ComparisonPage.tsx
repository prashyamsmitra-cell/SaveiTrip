import ServiceDetail from "../shared/ServiceDetail";
import { services } from "../shared/services";

const service = services[0];

export default function ComparisonPage() {
  return (
    <ServiceDetail service={service}>
      <p className="text-sm text-ink-faint">Preview</p>
      <h2 className="font-display mt-2 text-3xl">Market clarity before booking</h2>
      <div className="mt-6 grid gap-3">
        {["Expected budget range", "Provider reputation", "Package differences", "Value notes"].map((item) => (
          <div key={item} className="rounded-sm border border-line bg-canvas p-4">
            <p className="font-medium">{item}</p>
            <p className="mt-1 text-sm text-ink-soft">Reserved for the future market analysis MVP. No live provider data is shown.</p>
          </div>
        ))}
      </div>
    </ServiceDetail>
  );
}
