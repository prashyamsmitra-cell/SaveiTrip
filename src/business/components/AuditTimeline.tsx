import type { AuditLogEntry } from "../endorsementTypes";
import { Icon } from "../../shared/Icon";
import { formatDateTime } from "./format";

export default function AuditTimeline({ entries }: { entries: AuditLogEntry[] }) {
  if (entries.length === 0) {
    return <p className="py-4 text-sm text-ink-soft">No audit activity recorded yet.</p>;
  }

  return (
    <ol className="relative space-y-5 border-l border-line pl-5">
      {entries.map((entry) => (
        <li key={entry.id} className="relative">
          <span className="absolute -left-[1.42rem] top-0.5 grid h-5 w-5 place-items-center rounded-full bg-accent-green-soft text-accent-green">
            <Icon name="check" className="h-3 w-3" />
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-ink">{entry.action.replaceAll("_", " ")}</span>
            {entry.fromStatus && entry.toStatus && (
              <span className="text-xs text-ink-soft">
                {entry.fromStatus} → {entry.toStatus}
              </span>
            )}
            <span className="text-xs text-ink-faint">{formatDateTime(entry.createdAt)}</span>
          </div>
          <p className="mt-0.5 text-xs text-ink-soft">
            {entry.entityType.replace("_", " ")} · by {entry.actorRole ?? "system"}
          </p>
          {entry.details && (
            <p className="mt-1 text-xs text-ink-soft">{entry.details}</p>
          )}
        </li>
      ))}
    </ol>
  );
}
