import type { CommercialArrangement } from "../endorsementTypes";
import { SponsorshipStatusBadge } from "./StatusBadge";
import { Icon } from "../../shared/Icon";
import { formatDate } from "./format";

export default function SponsorshipStatus({ arrangement }: { arrangement: CommercialArrangement }) {
  const sponsored = arrangement.commercialMode === "SAVEITRIP_SPONSORED";

  return (
    <div className="rounded-xl border border-line bg-surface p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-amber-soft text-accent-amber">
            <Icon name="trend" className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">Commercial arrangement</p>
            <p className="text-xs text-ink-faint">{sponsored ? "SaveiTrip sponsored" : "Normal paid"}</p>
          </div>
        </div>
        {arrangement.sponsorshipStatus && (
          <SponsorshipStatusBadge status={arrangement.sponsorshipStatus} />
        )}
      </div>

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <Row label="Mode" value={sponsored ? "Sponsored" : "Normal paid"} />
        <Row
          label="Approved by"
          value={arrangement.approvedByName ? arrangement.approvedByName : "—"}
        />
        <Row label="Start date" value={formatDate(arrangement.sponsorshipStartDate)} />
        <Row label="End date" value={formatDate(arrangement.sponsorshipEndDate)} />
      </dl>

      {arrangement.sponsorshipReason && (
        <p className="mt-4 text-sm leading-6 text-ink-soft">
          <span className="font-medium text-ink">Reason:</span> {arrangement.sponsorshipReason}
        </p>
      )}
      {arrangement.reviewComment && (
        <p className="mt-2 text-sm leading-6 text-ink-soft">
          <span className="font-medium text-ink">Review comment:</span> {arrangement.reviewComment}
        </p>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-ink-faint">{label}</dt>
      <dd className="mt-0.5 font-medium text-ink">{value}</dd>
    </div>
  );
}