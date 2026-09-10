// API client — helper endorsements.
import { authenticatedRequest } from "./client";
import type {
  HelperEndorsement,
  HelperEndorsementStatus,
  SubmitHelperEndorsementInput
} from "../endorsementTypes";

export async function submitHelperEndorsement(input: SubmitHelperEndorsementInput) {
  return authenticatedRequest<{ endorsement: HelperEndorsement }>(
    "/api/endorsements/helper-endorsements",
    { method: "POST", body: JSON.stringify(input) }
  );
}

export async function listMyHelperEndorsements() {
  return authenticatedRequest<{ endorsements: HelperEndorsement[] }>(
    "/api/endorsements/helper-endorsements/mine"
  );
}

export async function listHelperEndorsementsByBusiness(businessId: string) {
  return authenticatedRequest<{ endorsements: HelperEndorsement[] }>(
    `/api/endorsements/helper-endorsements/business/${businessId}`
  );
}

export async function withdrawHelperEndorsement(endorsementId: string, reason?: string) {
  return authenticatedRequest<{ endorsement: HelperEndorsement }>(
    `/api/endorsements/helper-endorsements/${endorsementId}/withdraw`,
    { method: "POST", body: JSON.stringify(reason ? { reason } : {}) }
  );
}

export async function listAdminHelperEndorsements(status?: HelperEndorsementStatus) {
  const qs = status ? `?status=${status}` : "";
  return authenticatedRequest<{ endorsements: HelperEndorsement[] }>(
    `/api/endorsements/admin/helper-endorsements${qs}`
  );
}

export async function startHelperEndorsementReview(endorsementId: string) {
  return authenticatedRequest<{ endorsement: HelperEndorsement }>(
    `/api/endorsements/admin/helper-endorsements/${endorsementId}/start-review`,
    { method: "POST", body: JSON.stringify({}) }
  );
}

export async function reviewHelperEndorsement(
  endorsementId: string,
  decision: "VERIFIED" | "REJECTED",
  notes?: string
) {
  return authenticatedRequest<{ endorsement: HelperEndorsement }>(
    `/api/endorsements/admin/helper-endorsements/${endorsementId}/review`,
    { method: "POST", body: JSON.stringify({ decision, notes }) }
  );
}
