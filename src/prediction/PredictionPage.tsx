import ServiceDetail from "../shared/ServiceDetail";
import { services } from "../shared/services";

const service = services[1];

export default function PredictionPage() {
  return (
    <ServiceDetail service={service}>
      <p className="text-sm text-ink-faint">Preview</p>
      <h2 className="font-display mt-2 text-3xl">Destination conditions, explained carefully</h2>
      <div className="mt-6 space-y-3">
        {["Weather context", "Rainfall and snow signals", "Flood and landslide factors", "Travel suitability notes"].map((item) => (
          <div key={item} className="flex items-center justify-between rounded-sm border border-line bg-canvas p-4">
            <span className="font-medium">{item}</span>
            <span className="text-sm text-ink-faint">Coming Soon</span>
          </div>
        ))}
      </div>
      <p className="mt-5 text-sm text-ink-soft">No prediction scores, risk levels, or model output are generated in this release.</p>
    </ServiceDetail>
  );
}
