// API client — sponsorship (admin).
import { authenticatedRequest } from "./client";
import type { CommercialArrangement, SponsorshipStatus } from "../endorsementTypes";

export async function listSponsorshipEligible() {
  return authenticatedRequest<{ eligible: { inquiryId: string; businessId: string; category: string; area: string }[] }>(
    "/api/endorsements/admin/sponsorship/eligible"
  );
}

export async function listSponsorships() {
  return authenticatedRequest<{ sponsorships: CommercialArrangement[] }>(
    "/api/endorsements/admin/sponsorship"
  );
}

export async function initiateSponsorship(inquiryId: string, sponsorshipReason: string) {
  return authenticatedRequest<{ arrangement: CommercialArrangement }>(
    `/api/endorsements/admin/sponsorship/${inquiryId}/initiate`,
    { method: "POST", body: JSON.stringify({ sponsorshipReason }) }
  );
}

export async function reviewSponsorship(
  arrangementId: string,
  decision: "APPROVED" | "REJECTED",
  input: {
    commercialMode?: "NORMAL_PAID" | "SAVEITRIP_SPONSORED";
    sponsorshipStatus?: SponsorshipStatus;
    sponsorshipReason?: string;
    sponsorshipStartDate?: string;
    sponsorshipEndDate?: string;
    reviewComment?: string;
  }
) {
  return authenticatedRequest<{ arrangement: CommercialArrangement }>(
    `/api/endorsements/admin/sponsorship/${arrangementId}/review`,
    { method: "POST", body: JSON.stringify({ decision, ...input }) }
  );
}

export async function endSponsorship(arrangementId: string, reason: string) {
  return authenticatedRequest<{ arrangement: CommercialArrangement }>(
    `/api/endorsements/admin/sponsorship/${arrangementId}/end`,
    { method: "POST", body: JSON.stringify({ reason }) }
  );
}
