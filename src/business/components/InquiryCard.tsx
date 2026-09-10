import { Link } from "react-router-dom";
import type { EndorsementInquiry } from "../endorsementTypes";
import { EndorsementStatusBadge, VerificationLevelBadge } from "./StatusBadge";
import { Icon } from "../../shared/Icon";
import { formatLocation, timeAgo } from "./format";

export default function InquiryCard({
  inquiry,
  detailPath,
  trailing
}: {
  inquiry: EndorsementInquiry;
  detailPath: string;
  trailing?: React.ReactNode;
}) {
  return (
    <article className="card flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="chip">{inquiry.category}</span>
        <EndorsementStatusBadge status={inquiry.status} />
      </div>

      <h2 className="font-display mt-4 text-2xl leading-tight">
        <Link to={detailPath} className="transition-colors hover:text-accent-green">
          {inquiry.category} endorsement
        </Link>
      </h2>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-ink-soft">
        <span className="inline-flex items-center gap-1.5">
          <Icon name="pin" className="h-3.5 w-3.5 text-ink-faint" />
          {formatLocation(inquiry.location)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Icon name="clock" className="h-3.5 w-3.5 text-ink-faint" />
          {timeAgo(inquiry.updatedAt)}
        </span>
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-6 text-ink-soft">{inquiry.summary}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <VerificationLevelBadge level={inquiry.verificationLevel} />
        {inquiry.commercialMode === "SAVEITRIP_SPONSORED" && (
          <span className="badge bg-accent-amber-soft text-accent-amber">Sponsored</span>
        )}
      </div>

      <div className="mt-auto pt-5">
        {trailing ? (
          trailing
        ) : (
          <Link to={detailPath} className="btn btn-outline w-full justify-center">
            View details
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        )}
      </div>
    </article>
  );
}