import ServiceDetail from "../shared/ServiceDetail";
import { services } from "../shared/services";
import { Icon } from "../shared/Icon";

const service = services[2];

export default function SosPage() {
  return (
    <ServiceDetail service={service}>
      <p className="kicker">Research note</p>
      <h2 className="font-display mt-2 text-2xl leading-tight">Emergency communication is not active yet</h2>
      <p className="mt-4 leading-7 text-ink-soft">
        SaveiTrip is reserving this space for future emergency and limited-connectivity research.
        This release does not send SOS messages, contact authorities, use Bluetooth, or create mesh networking.
      </p>
      <div className="mt-6 flex items-start gap-3 rounded-lg border border-accent-amber/25 bg-accent-amber-soft px-5 py-4">
        <Icon name="shield" className="mt-0.5 h-4 w-4 shrink-0 text-accent-amber" />
        <div>
          <p className="text-sm font-medium text-accent-amber">Under Research</p>
          <p className="mt-1 text-xs text-accent-amber/70">
            Use official emergency services and local authorities for real emergencies.
          </p>
        </div>
      </div>
    </ServiceDetail>
  );
}
