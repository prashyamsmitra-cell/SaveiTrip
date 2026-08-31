import type { Outlook } from "../data";

const styles: Record<Outlook, string> = {
  Good: "bg-accent-green-soft text-accent-green",
  Moderate: "bg-accent-amber-soft text-accent-amber",
  Caution: "bg-accent-red-soft text-accent-red",
};

export default function OutlookBadge({ outlook }: { outlook: Outlook }) {
  return <span className={`rounded-sm px-2.5 py-1 text-xs font-medium ${styles[outlook]}`}>{outlook}</span>;
}
