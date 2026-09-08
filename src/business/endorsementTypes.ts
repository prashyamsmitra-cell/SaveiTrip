export type EndorsementStatus =
  | "available"
  | "claimed"
  | "under-review"
  | "endorsed"
  | "not-endorsed";

export interface EndorsementInquiryInput {
  businessName: string;
  category: string;
  location: string;
  contactPerson: string;
  contactNumber: string;
  description: string;
  scaleRange: string;
  webLink?: string;
  promotionGoal: string;
  additionalInfo?: string;
}

export interface EndorsementInquiryResult {
  inquiryId: string;
}

export interface EndorsementOpportunity {
  id: string;
  businessName: string;
  category: string;
  location: string;
  distanceKm: number;
  scale: string;
  postedAt: string;
  status: EndorsementStatus;
  summary: string;
}