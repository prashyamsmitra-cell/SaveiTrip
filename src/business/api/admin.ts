// API client — business profiles + admin console actions.
import { authenticatedRequest } from "./client";
import type {
  AddEvidenceInput,
  AdminDashboard,
  AuditLogEntry,
  BusinessProfile,
  CreateBusinessInput,
  EndorsementInquiry,
  EndorsementStatus,
  Evidence,
  InspectionResult,
  UpdateBusinessInput
} from "../endorsementTypes";

// --- Business profiles ---
export async function createBusinessProfile(input: CreateBusinessInput) {
  return authenticatedRequest<{ business: BusinessProfile }>(
    "/api/endorsements/businesses",
    { method: "POST", body: JSON.stringify(input) }
  );
}

export async function listMyBusinesses() {
  return authenticatedRequest<{ businesses: BusinessProfile[] }>(
    "/api/endorsements/businesses/me"
  );
}

export async function getBusiness(businessId: string) {
  return authenticatedRequest<{ business: BusinessProfile }>(
    `/api/endorsements/businesses/${businessId}`
  );
}

export async function updateBusiness(businessId: string, patch: UpdateBusinessInput) {
  return authenticatedRequest<{ business: BusinessProfile }>(
    `/api/endorsements/businesses/${businessId}`,
    { method: "PATCH", body: JSON.stringify(patch) }
  );
}

// --- Admin: dashboard & inquiries ---
export async function getDashboard() {
  return authenticatedRequest<{ dashboard: AdminDashboard }>(
    "/api/endorsements/admin/dashboard"
  );
}

export async function listAdminInquiries(status?: EndorsementStatus) {
  const qs = status ? `?status=${status}` : "";
  return authenticatedRequest<{ inquiries: EndorsementInquiry[] }>(
    `/api/endorsements/admin/inquiries${qs}`
  );
}

export async function startInquiryReview(inquiryId: string) {
  return authenticatedRequest<{ inquiry: EndorsementInquiry }>(
    `/api/endorsements/admin/inquiries/${inquiryId}/start-review`,
    { method: "POST", body: JSON.stringify({}) }
  );
}

export async function requestAdditionalInformation(inquiryId: string, note?: string) {
  return authenticatedRequest<{ inquiry: EndorsementInquiry }>(
    `/api/endorsements/admin/inquiries/${inquiryId}/additional-info`,
    { method: "POST", body: JSON.stringify({ note }) }
  );
}

export async function requireInspection(
  inquiryId: string,
  input: {
    assignedTo?: string;
    assignedToName?: string;
    checklist?: string[];
    scheduledDate?: string;
    note?: string;
  }
) {
  return authenticatedRequest<{
    inquiry: EndorsementInquiry;
    inspection: unknown;
  }>(`/api/endorsements/admin/inquiries/${inquiryId}/inspection`, {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function requestEvidence(inquiryId: string, input: AddEvidenceInput) {
  return authenticatedRequest<{ evidence: Evidence }>(
    `/api/endorsements/admin/inquiries/${inquiryId}/evidence`,
    { method: "POST", body: JSON.stringify(input) }
  );
}

export async function approveInquiry(
  inquiryId: string,
  opts: { reason?: string; validUntil?: string; reviewComment?: string }
) {
  return authenticatedRequest<{ inquiry: EndorsementInquiry }>(
    `/api/endorsements/admin/inquiries/${inquiryId}/approve`,
    { method: "POST", body: JSON.stringify(opts) }
  );
}

export async function rejectInquiry(inquiryId: string, reason: string) {
  return authenticatedRequest<{ inquiry: EndorsementInquiry }>(
    `/api/endorsements/admin/inquiries/${inquiryId}/reject`,
    { method: "POST", body: JSON.stringify({ reason }) }
  );
}

export async function activateInquiry(
  inquiryId: string,
  opts: { reason?: string; validUntil?: string }
) {
  return authenticatedRequest<{ inquiry: EndorsementInquiry }>(
    `/api/endorsements/admin/inquiries/${inquiryId}/activate`,
    { method: "POST", body: JSON.stringify(opts) }
  );
}

export async function revokeInquiry(inquiryId: string, reason: string) {
  return authenticatedRequest<{ inquiry: EndorsementInquiry }>(
    `/api/endorsements/admin/inquiries/${inquiryId}/revoke`,
    { method: "POST", body: JSON.stringify({ reason }) }
  );
}

export async function addInternalNote(inquiryId: string, note: string) {
  return authenticatedRequest<{ inquiry: EndorsementInquiry }>(
    `/api/endorsements/admin/inquiries/${inquiryId}/notes`,
    { method: "POST", body: JSON.stringify({ note }) }
  );
}

export async function reviewEvidence(
  evidenceId: string,
  decision: "APPROVED" | "REJECTED",
  notes?: string
) {
  return authenticatedRequest<{ evidence: Evidence }>(
    `/api/endorsements/admin/evidence/${evidenceId}`,
    { method: "PATCH", body: JSON.stringify({ decision, notes }) }
  );
}

// --- Admin: audit & listings ---
export async function getAudit(entityType?: string, entityId?: string) {
  const params = new URLSearchParams();
  if (entityType) params.set("entityType", entityType);
  if (entityId) params.set("entityId", entityId);
  const qs = params.toString();
  return authenticatedRequest<{ auditLog: AuditLogEntry[] }>(
    `/api/endorsements/admin/audit${qs ? `?${qs}` : ""}`
  );
}

export async function listBusinesses() {
  return authenticatedRequest<{ businesses: BusinessProfile[] }>(
    "/api/endorsements/admin/businesses"
  );
}

// --- Admin: inspections helper re-exports ---
export type { InspectionResult };
