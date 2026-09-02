import ServiceDetail from "../shared/ServiceDetail";
import { services } from "../shared/services";
import { Icon, type IconName } from "../shared/Icon";

const service = services[1];

const capabilities: readonly { label: string; icon: IconName }[] = [
  { label: "Weather context", icon: "sparkles" },
  { label: "Rainfall and snow signals", icon: "clock" },
  { label: "Flood and landslide factors", icon: "alert" },
  { label: "Travel suitability notes", icon: "check" }
];

export default function PredictionPage() {
  return (
    <ServiceDetail service={service}>
      <p className="kicker">Preview</p>
      <h2 className="font-display mt-2 text-2xl leading-tight">Destination conditions, explained carefully</h2>
      <div className="mt-6 space-y-3">
        {capabilities.map(({ label, icon }) => (
          <div key={label} className="flex items-center justify-between rounded-lg border border-line bg-canvas p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-surface text-ink-faint">
                <Icon name={icon} className="h-4 w-4" />
              </span>
              <span className="text-sm font-medium">{label}</span>
            </div>
            <span className="badge bg-accent-amber-soft text-accent-amber">Coming Soon</span>
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm leading-6 text-ink-soft">
        No prediction scores, risk levels, or model output are generated in this release.
      </p>
    </ServiceDetail>
  );
}
