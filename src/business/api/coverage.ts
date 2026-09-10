// API client — helper coverage.
import { authenticatedRequest } from "./client";
import type { HelperCoverage, PublicBusiness, SponsorPublicInfo } from "../endorsementTypes";

export async function listCoverage(area?: string, category?: string) {
  const params = new URLSearchParams();
  if (area) params.set("area", area);
  if (category) params.set("category", category);
  const qs = params.toString();
  return authenticatedRequest<{ coverage: HelperCoverage[] }>(
    `/api/endorsements/coverage${qs ? `?${qs}` : ""}`
  );
}

export async function listPublicBusinesses(area?: string, category?: string) {
  const params = new URLSearchParams();
  if (area) params.set("area", area);
  if (category) params.set("category", category);
  const qs = params.toString();
  return authenticatedRequest<{ businesses: PublicBusiness[] }>(
    `/api/endorsements/public/businesses${qs ? `?${qs}` : ""}`
  );
}

export async function getSponsorPublicInfo(businessId: string) {
  return authenticatedRequest<{ sponsorInfo: SponsorPublicInfo }>(
    `/api/endorsements/public/businesses/${businessId}/sponsor-info`
  );
}

export async function listAdminCoverage() {
  return authenticatedRequest<{ coverage: HelperCoverage[] }>(
    "/api/endorsements/admin/coverage"
  );
}
