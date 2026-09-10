// API client — inquiries (business-side & admin).
import { authenticatedRequest } from "./client";
import type {
  AddEvidenceInput,
  CreateInquiryInput,
  EndorsementInquiry,
  Evidence,
  InquiryDetail,
  UpdateInquiryInput
} from "../endorsementTypes";

export async function createInquiry(input: CreateInquiryInput) {
  return authenticatedRequest<{ inquiry: EndorsementInquiry }>("/api/endorsements/inquiries", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function listMyInquiries() {
  return authenticatedRequest<{ inquiries: EndorsementInquiry[] }>(
    "/api/endorsements/inquiries/mine"
  );
}

export async function getInquiry(inquiryId: string) {
  return authenticatedRequest<{ inquiry: EndorsementInquiry }>(
    `/api/endorsements/inquiries/${inquiryId}`
  );
}

export async function updateInquiry(inquiryId: string, patch: UpdateInquiryInput) {
  return authenticatedRequest<{ inquiry: EndorsementInquiry }>(
    `/api/endorsements/inquiries/${inquiryId}`,
    { method: "PATCH", body: JSON.stringify(patch) }
  );
}

export async function submitInquiry(inquiryId: string) {
  return authenticatedRequest<{ inquiry: EndorsementInquiry }>(
    `/api/endorsements/inquiries/${inquiryId}/submit`,
    { method: "POST", body: JSON.stringify({}) }
  );
}

export async function respondToInformationRequest(inquiryId: string) {
  return authenticatedRequest<{ inquiry: EndorsementInquiry }>(
    `/api/endorsements/inquiries/${inquiryId}/respond`,
    { method: "POST", body: JSON.stringify({}) }
  );
}

export async function addEvidence(inquiryId: string, input: AddEvidenceInput) {
  return authenticatedRequest<{ evidence: Evidence }>(
    `/api/endorsements/inquiries/${inquiryId}/evidence`,
    { method: "POST", body: JSON.stringify(input) }
  );
}

export async function getAdminInquiryDetail(inquiryId: string) {
  return authenticatedRequest<InquiryDetail>(
    `/api/endorsements/admin/inquiries/${inquiryId}`
  );
}

export async function getInquiryPolicy(inquiryId: string) {
  return authenticatedRequest<{
    policy: { inspectionRequired: boolean; level: string; description: string };
  }>(`/api/endorsements/admin/inquiries/${inquiryId}/policy`);
}
