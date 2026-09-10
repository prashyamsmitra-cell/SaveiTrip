// API client — endorsement opportunities.
import { authenticatedRequest } from "./client";
import type {
  BusinessClaim,
  CreateOpportunityInput,
  EndorsementOpportunity
} from "../endorsementTypes";

export async function listOpportunities() {
  return authenticatedRequest<{ opportunities: EndorsementOpportunity[] }>(
    "/api/endorsements/opportunities"
  );
}

export async function getOpportunity(opportunityId: string) {
  return authenticatedRequest<{ opportunity: EndorsementOpportunity }>(
    `/api/endorsements/opportunities/${opportunityId}`
  );
}

export async function claimOpportunity(opportunityId: string, message?: string) {
  return authenticatedRequest<{ claim: BusinessClaim; inquiry: unknown }>(
    `/api/endorsements/opportunities/${opportunityId}/claims`,
    { method: "POST", body: JSON.stringify(message ? { message } : {}) }
  );
}

export async function listMyClaims() {
  return authenticatedRequest<{ claims: BusinessClaim[] }>("/api/endorsements/claims/mine");
}

export async function withdrawClaim(claimId: string) {
  return authenticatedRequest<{ claim: BusinessClaim }>(
    `/api/endorsements/claims/${claimId}/withdraw`,
    { method: "POST", body: JSON.stringify({}) }
  );
}

export async function createOpportunity(input: CreateOpportunityInput) {
  return authenticatedRequest<{ opportunity: EndorsementOpportunity }>(
    "/api/endorsements/admin/opportunities",
    { method: "POST", body: JSON.stringify(input) }
  );
}

export async function listAdminOpportunities() {
  return authenticatedRequest<{ opportunities: EndorsementOpportunity[] }>(
    "/api/endorsements/admin/opportunities"
  );
}

export async function closeOpportunity(opportunityId: string) {
  return authenticatedRequest<{ opportunity: EndorsementOpportunity }>(
    `/api/endorsements/admin/opportunities/${opportunityId}/close`,
    { method: "POST", body: JSON.stringify({}) }
  );
}
