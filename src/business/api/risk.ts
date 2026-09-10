// API client — risk intelligence.
import { authenticatedRequest } from "./client";
import type { RiskFeatureSet, RiskPredictionInput, RiskPredictionResult } from "../endorsementTypes";

export async function listRiskFeatures(area?: string) {
  const qs = area ? `?area=${encodeURIComponent(area)}` : "";
  return authenticatedRequest<{ riskFeatureSet: RiskFeatureSet }>(
    `/api/endorsements/risk/features${qs}`
  );
}

export async function predictRisk(input: RiskPredictionInput) {
  return authenticatedRequest<RiskPredictionResult>("/api/endorsements/admin/risk/predict", {
    method: "POST",
    body: JSON.stringify(input)
  });
}
