import ServiceDetail from "../shared/ServiceDetail";
import { services } from "../shared/services";

const service = services[2];

export default function SosPage() {
  return (
    <ServiceDetail service={service}>
      <p className="text-sm text-ink-faint">Research note</p>
      <h2 className="font-display mt-2 text-3xl">Emergency communication is not active yet</h2>
      <p className="mt-4 text-ink-soft">
        SaveiTrip is reserving this space for future emergency and limited-connectivity research. This release does not send SOS messages, contact authorities, use Bluetooth, or create mesh networking.
      </p>
      <div className="mt-6 rounded-sm bg-accent-amber-soft p-5 text-sm text-accent-amber">
        Under Research. Use official emergency services and local authorities for real emergencies.
      </div>
    </ServiceDetail>
  );
}
