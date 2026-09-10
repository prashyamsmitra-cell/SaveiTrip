// API client — inspections (admin).
import { authenticatedRequest } from "./client";
import type { Inspection, InspectionResult } from "../endorsementTypes";

export async function listInspections() {
  return authenticatedRequest<{ inspections: Inspection[] }>(
    "/api/endorsements/admin/inspections"
  );
}

export async function assignInspection(
  inspectionId: string,
  assignedTo?: string,
  assignedToName?: string
) {
  return authenticatedRequest<{ inspection: Inspection }>(
    `/api/endorsements/admin/inspections/${inspectionId}/assign`,
    { method: "POST", body: JSON.stringify({ assignedTo, assignedToName }) }
  );
}

export async function startInspection(inspectionId: string) {
  return authenticatedRequest<{ inspection: Inspection }>(
    `/api/endorsements/admin/inspections/${inspectionId}/start`,
    { method: "POST", body: JSON.stringify({}) }
  );
}

export async function completeInspection(
  inspectionId: string,
  input: { result: InspectionResult; report?: string; evidenceRefs?: string[] }
) {
  return authenticatedRequest<{ inspection: Inspection }>(
    `/api/endorsements/admin/inspections/${inspectionId}/complete`,
    { method: "POST", body: JSON.stringify(input) }
  );
}

export async function cancelInspection(inspectionId: string) {
  return authenticatedRequest<{ inspection: Inspection }>(
    `/api/endorsements/admin/inspections/${inspectionId}/cancel`,
    { method: "POST", body: JSON.stringify({}) }
  );
}
