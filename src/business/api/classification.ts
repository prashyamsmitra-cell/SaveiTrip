// API client — classification (admin).
import { authenticatedRequest } from "./client";
import type { EndorsementClassification } from "../endorsementTypes";

export async function listClassifications() {
  return authenticatedRequest<{ classifications: EndorsementClassification[] }>(
    "/api/endorsements/admin/classifications"
  );
}
