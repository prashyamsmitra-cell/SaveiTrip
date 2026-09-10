import type {
  ClaimStatus,
  EndorsementStatus,
  EvidenceStatus,
  HelperEndorsementStatus,
  InspectionStatus,
  InspectionResult,
  OpportunityStatus,
  SponsorshipStatus,
  VerificationLevel
} from "../endorsementTypes";
import { titleCase } from "./format";

type BadgeTone = "green" | "amber" | "red" | "neutral" | "blue" | "purple";

const toneClass: Record<BadgeTone, string> = {
  green: "bg-accent-green text-canvas",
  amber: "bg-accent-amber-soft text-accent-amber",
  red: "bg-accent-red-soft text-accent-red",
  neutral: "bg-canvas-alt text-ink-soft",
  blue: "bg-accent-green-soft text-accent-green",
  purple: "bg-accent-amber-soft text-accent-amber"
};

const endorsementTone: Record<EndorsementStatus, BadgeTone> = {
  DRAFT: "neutral",
  SUBMITTED: "blue",
  UNDER_REVIEW: "amber",
  ADDITIONAL_INFORMATION_REQUIRED: "amber",
  INSPECTION_REQUIRED: "amber",
  VERIFIED: "green",
  ACTIVE: "green",
  REJECTED: "red",
  EXPIRED: "neutral",
  REVOKED: "red"
};

const helperEndorsementTone: Record<HelperEndorsementStatus, BadgeTone> = {
  SUBMITTED: "blue",
  UNDER_REVIEW: "amber",
  VERIFIED: "green",
  REJECTED: "red",
  WITHDRAWN: "neutral"
};

const opportunityTone: Record<OpportunityStatus, BadgeTone> = {
  OPEN: "green",
  CLAIMED: "amber",
  ENDORSED: "green",
  WITHDRAWN: "neutral",
  EXPIRED: "neutral",
  CLOSED: "neutral"
};

const claimTone: Record<ClaimStatus, BadgeTone> = {
  SUBMITTED: "blue",
  UNDER_REVIEW: "amber",
  APPROVED: "green",
  REJECTED: "red",
  WITHDRAWN: "neutral"
};

const inspectionTone: Record<InspectionStatus, BadgeTone> = {
  REQUESTED: "neutral",
  ASSIGNED: "blue",
  IN_PROGRESS: "amber",
  COMPLETED: "green",
  CANCELLED: "red"
};

const resultTone: Record<InspectionResult, BadgeTone> = {
  PENDING: "neutral",
  PASS: "green",
  PASS_WITH_CONDITIONS: "amber",
  FAIL: "red"
};

const sponsorshipTone: Record<SponsorshipStatus, BadgeTone> = {
  PENDING: "amber",
  APPROVED: "blue",
  REJECTED: "red",
  ACTIVE: "green",
  ENDED: "neutral"
};

const levelTone: Record<VerificationLevel, BadgeTone> = {
  STANDARD: "neutral",
  ELEVATED: "blue",
  HIGH: "purple"
};

const evidenceTone: Record<EvidenceStatus, BadgeTone> = {
  PENDING_REVIEW: "amber",
  APPROVED: "green",
  REJECTED: "red"
};

export function Badge({
  tone = "neutral",
  label,
  className = ""
}: {
  tone?: BadgeTone;
  label: string;
  className?: string;
}) {
  return <span className={`badge ${toneClass[tone]} ${className}`}>{label}</span>;
}

export function EndorsementStatusBadge({ status }: { status: EndorsementStatus }) {
  return <Badge tone={endorsementTone[status]} label={titleCase(status)} />;
}

export function HelperEndorsementStatusBadge({ status }: { status: HelperEndorsementStatus }) {
  return <Badge tone={helperEndorsementTone[status]} label={titleCase(status)} />;
}

export function OpportunityStatusBadge({ status }: { status: OpportunityStatus }) {
  return <Badge tone={opportunityTone[status]} label={titleCase(status)} />;
}

export function ClaimStatusBadge({ status }: { status: ClaimStatus }) {
  return <Badge tone={claimTone[status]} label={titleCase(status)} />;
}

export function InspectionStatusBadge({ status }: { status: InspectionStatus }) {
  return <Badge tone={inspectionTone[status]} label={titleCase(status)} />;
}

export function InspectionResultBadge({ result }: { result: InspectionResult }) {
  return <Badge tone={resultTone[result]} label={titleCase(result)} />;
}

export function SponsorshipStatusBadge({ status }: { status: SponsorshipStatus }) {
  return <Badge tone={sponsorshipTone[status]} label={titleCase(status)} />;
}

export function VerificationLevelBadge({ level }: { level: VerificationLevel }) {
  return <Badge tone={levelTone[level]} label={titleCase(level)} />;
}

export function EvidenceStatusBadge({ status }: { status: EvidenceStatus }) {
  return <Badge tone={evidenceTone[status]} label={titleCase(status)} />;
}
