// API client — claims (admin review).
import { authenticatedRequest } from "./client";
import type { BusinessClaim, ClaimStatus } from "../endorsementTypes";

export async function listClaims() {
  return authenticatedRequest<{ claims: BusinessClaim[] }>("/api/endorsements/admin/claims");
}

export async function startClaimReview(claimId: string) {
  return authenticatedRequest<{ claim: BusinessClaim }>(
    `/api/endorsements/admin/claims/${claimId}/start-review`,
    { method: "POST", body: JSON.stringify({}) }
  );
}

export async function decideClaim(
  claimId: string,
  decision: "APPROVED" | "REJECTED",
  reason?: string
) {
  return authenticatedRequest<{ claim: BusinessClaim }>(
    `/api/endorsements/admin/claims/${claimId}/decide`,
    { method: "POST", body: JSON.stringify({ decision, reason }) }
  );
}

export type { ClaimStatus };
