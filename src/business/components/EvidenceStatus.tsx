import type { Evidence } from "../endorsementTypes";
import { Badge } from "./StatusBadge";
import { Icon } from "../../shared/Icon";
import { formatDate } from "./format";

const kindLabel: Record<Evidence["kind"], string> = {
  document: "Document",
  image: "Image",
  link: "Link",
  note: "Note"
};

const statusTone: Record<Evidence["status"], "amber" | "green" | "red"> = {
  PENDING_REVIEW: "amber",
  APPROVED: "green",
  REJECTED: "red"
};

export default function EvidenceStatus({ evidence }: { evidence: Evidence }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-line/70 py-3 last:border-b-0">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-canvas-alt text-ink-soft">
          <Icon name={evidence.kind === "link" ? "external" : evidence.kind === "image" ? "sparkles" : "message-circle"} className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink">{evidence.title}</p>
          <p className="mt-0.5 truncate text-xs text-ink-soft">{evidence.reference}</p>
          <p className="mt-1 text-xs text-ink-faint">
            {kindLabel[evidence.kind]} · uploaded {formatDate(evidence.createdAt)}
          </p>
          {evidence.status === "REJECTED" && evidence.reviewNotes && (
            <p className="mt-1 text-xs text-accent-red">{evidence.reviewNotes}</p>
          )}
          {evidence.status === "APPROVED" && evidence.reviewNotes && (
            <p className="mt-1 text-xs text-accent-green">{evidence.reviewNotes}</p>
          )}
        </div>
      </div>
      <Badge tone={statusTone[evidence.status]} label={evidence.status.replace("_", " ")} />
    </div>
  );
}

export function EvidenceList({ evidence }: { evidence: Evidence[] }) {
  if (evidence.length === 0) {
    return (
      <p className="py-4 text-sm text-ink-soft">No evidence has been added yet.</p>
    );
  }
  return (
    <div className="divide-y divide-line/70">
      {evidence.map((item) => (
        <EvidenceStatus key={item.id} evidence={item} />
      ))}
    </div>
  );
}
