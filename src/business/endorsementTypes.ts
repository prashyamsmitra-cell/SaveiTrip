// Business Endorsement module — frontend domain types.
//
// These mirror the backend contracts in backend/src/endorsements/endorsementsTypes.ts
// and the zod validation schemas in endorsementsValidation.ts. The backend is the
// source of truth for all statuses, request bodies and response shapes. Do not
// invent enum values here.

// ============================================================================
// Statuses
// ============================================================================

export type EndorsementStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'ADDITIONAL_INFORMATION_REQUIRED'
  | 'INSPECTION_REQUIRED'
  | 'VERIFIED'
  | 'ACTIVE'
  | 'REJECTED'
  | 'EXPIRED'
  | 'REVOKED';

export const ENDORSEMENT_STATUSES: readonly EndorsementStatus[] = [
  'DRAFT',
  'SUBMITTED',
  'UNDER_REVIEW',
  'ADDITIONAL_INFORMATION_REQUIRED',
  'INSPECTION_REQUIRED',
  'VERIFIED',
  'ACTIVE',
  'REJECTED',
  'EXPIRED',
  'REVOKED'
] as const;

export type HelperEndorsementStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'REJECTED'
  | 'WITHDRAWN';

export const HELPER_ENDORSEMENT_STATUSES: readonly HelperEndorsementStatus[] = [
  'SUBMITTED',
  'UNDER_REVIEW',
  'VERIFIED',
  'REJECTED',
  'WITHDRAWN'
] as const;

export type OpportunityStatus =
  | 'OPEN'
  | 'CLAIMED'
  | 'ENDORSED'
  | 'WITHDRAWN'
  | 'EXPIRED'
  | 'CLOSED';

export const OPPORTUNITY_STATUSES: readonly OpportunityStatus[] = [
  'OPEN',
  'CLAIMED',
  'ENDORSED',
  'WITHDRAWN',
  'EXPIRED',
  'CLOSED'
] as const;

export type ClaimStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'WITHDRAWN';

export type InspectionStatus =
  | 'REQUESTED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type InspectionResult = 'PENDING' | 'PASS' | 'PASS_WITH_CONDITIONS' | 'FAIL';

export type VerificationLevel = 'STANDARD' | 'ELEVATED' | 'HIGH';

export type CommercialMode = 'NORMAL_PAID' | 'SAVEITRIP_SPONSORED';

export type SponsorshipStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'ENDED';

// ============================================================================
// Location & entities
// ============================================================================

export type LocationProfile = {
  city: string;
  state: string;
  region: string;
  landmark?: string;
};

export type BusinessProfile = {
  id: string;
  userId: string;
  name: string;
  category: string;
  subCategory?: string;
  description: string;
  location: LocationProfile;
  services: string[];
  establishedYear?: number;
  contactEmail?: string;
  contactPhone?: string;
  websiteUrl?: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type InternalNote = {
  id: string;
  authorId: string;
  authorName: string;
  note: string;
  createdAt: string;
};

export type ApprovalRecord = {
  approvedById: string;
  approvedByName: string;
  approvedAt: string;
  decision: 'APPROVED' | 'REJECTED';
  reason?: string;
  effectiveFrom?: string;
  validUntil?: string;
};

export type EndorsementInquiry = {
  id: string;
  businessId: string;
  userId: string;
  opportunityId?: string;
  status: EndorsementStatus;
  commercialMode: CommercialMode;
  requestedCommercialMode?: CommercialMode;
  category: string;
  location: LocationProfile;
  summary: string;
  supportingInfo: string[];
  submittedAt?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  approval?: ApprovalRecord;
  expiryAt?: string;
  verificationLevel: VerificationLevel;
  internalNotes: InternalNote[];
  createdAt: string;
  updatedAt: string;
};

export type EndorsementOpportunity = {
  id: string;
  businessId: string;
  createdBy: string;
  sourceInquiryId?: string;
  title: string;
  description: string;
  category: string;
  location: LocationProfile;
  status: OpportunityStatus;
  claimedBy?: string;
  eligibilityCriteria?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type BusinessClaim = {
  id: string;
  opportunityId: string;
  businessId: string;
  userId: string;
  status: ClaimStatus;
  message?: string;
  submittedAt?: string;
  decidedBy?: string;
  decidedAt?: string;
  decisionReason?: string;
  createdAt: string;
  updatedAt: string;
};

export type HelperEndorsement = {
  id: string;
  helperUserId: string;
  helperName: string;
  businessId: string;
  inquiryId?: string;
  reason: string;
  location: LocationProfile;
  category: string;
  evidenceRefs: string[];
  status: HelperEndorsementStatus;
  verification?: {
    reviewedBy?: string;
    reviewedByName?: string;
    reviewedAt?: string;
    decision?: 'VERIFIED' | 'REJECTED';
    isVerified: boolean;
    notes?: string;
  };
  withdrawnAt?: string;
  withdrawnReason?: string;
  createdAt: string;
  updatedAt: string;
};

export type Inspection = {
  id: string;
  inquiryId: string;
  businessId: string;
  assignedTo?: string;
  assignedToName?: string;
  assignedById: string;
  status: InspectionStatus;
  checklist?: string[];
  scheduledDate?: string;
  result: InspectionResult;
  report?: string;
  evidenceRefs?: string[];
  decidedBy?: string;
  decidedAt?: string;
  requestedAt: string;
  assignedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type RiskIndicator = {
  kind: string;
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
  detail?: string;
};

export type EndorsementClassification = {
  id: string;
  inquiryId: string;
  businessId: string;
  businessCategory: string;
  locationProfile: LocationProfile;
  services: string[];
  travelerRelevance: number;
  endorsementType: string;
  verificationLevel: VerificationLevel;
  riskIndicators: RiskIndicator[];
  confidence: number;
  method: 'RULE_BASED';
  version: string;
  explanation: string;
  createdBy: string;
  createdAt: string;
};

export type HelperCoverage = {
  area: string;
  category?: string;
  helperCount: number;
  endorsedBusinesses: number;
  categoriesCovered: string[];
  freshnessDays: number;
  coverageScore: number;
  computedAt: string;
};

export type EvidenceKind = 'document' | 'image' | 'link' | 'note';
export type EvidenceStatus = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';

export type Evidence = {
  id: string;
  inquiryId: string;
  businessId: string;
  kind: EvidenceKind;
  title: string;
  reference: string;
  uploadedBy: string;
  uploaderRole: string;
  status: EvidenceStatus;
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type NotificationDelivery = {
  id: string;
  type: EndorsementEventType;
  recipientUserId: string;
  recipientRole: string;
  entityType:
    | 'inquiry'
    | 'business'
    | 'opportunity'
    | 'claim'
    | 'helper_endorsement'
    | 'inspection'
    | 'sponsorship'
    | 'classification';
  entityId: string;
  message: string;
  data?: Record<string, unknown>;
  readAt?: string;
  createdAt: string;
};

export type AuditLogEntry = {
  id: string;
  entityType:
    | 'inquiry'
    | 'business'
    | 'opportunity'
    | 'claim'
    | 'helper_endorsement'
    | 'inspection'
    | 'classification'
    | 'sponsorship'
    | 'evidence';
  entityId: string;
  actorUserId?: string;
  actorRole?: string;
  action: string;
  fromStatus?: string;
  toStatus?: string;
  details?: string;
  createdAt: string;
};

export type EndorsementEventType =
  | 'INQUIRY_SUBMITTED'
  | 'CLAIM_SUBMITTED'
  | 'REVIEW_STARTED'
  | 'ADDITIONAL_INFORMATION_REQUESTED'
  | 'ADDITIONAL_INFORMATION_SUBMITTED'
  | 'INSPECTION_REQUESTED'
  | 'INSPECTION_COMPLETED'
  | 'HELPER_ENDORSEMENT_SUBMITTED'
  | 'HELPER_ENDORSEMENT_REVIEWED'
  | 'ENDORSEMENT_VERIFIED'
  | 'ENDORSEMENT_ACTIVATED'
  | 'ENDORSEMENT_REJECTED'
  | 'ENDORSEMENT_EXPIRED'
  | 'ENDORSEMENT_REVOKED'
  | 'SPONSORSHIP_REVIEWED'
  | 'SPONSORSHIP_ACTIVE'
  | 'SPONSORSHIP_ENDED'
  | 'CLASSIFICATION_UPDATED';

export type CommercialArrangement = {
  id: string;
  inquiryId: string;
  businessId: string;
  commercialMode: CommercialMode;
  sponsorshipStatus?: SponsorshipStatus;
  sponsorshipReason?: string;
  approvedById?: string;
  approvedByName?: string;
  approvedAt?: string;
  sponsorshipStartDate?: string;
  sponsorshipEndDate?: string;
  internalNotes: InternalNote[];
  reviewComment?: string;
  createdAt: string;
  updatedAt: string;
};

// ============================================================================
// Public & risk response shapes
// ============================================================================

export type PublicBusiness = {
  id: string;
  name: string;
  category: string;
  description: string;
  location: LocationProfile;
  services: string[];
  establishedYear?: number;
  websiteUrl?: string;
  avatarUrl?: string;
  commercialMode: CommercialMode;
  endorsementStatus: 'ACTIVE' | 'VERIFIED';
  helperRecommendationCount: number;
};

export type SponsorPublicInfo = {
  commercialMode: CommercialMode;
  sponsored: boolean;
};

export interface RiskFeatureBusiness {
  businessId: string;
  businessName: string;
  category: string;
  location: LocationProfile;
  verificationLevel: VerificationLevel;
  commercialMode: CommercialMode;
  sponsored: boolean;
  activeSince?: string;
  helperEndorsementCount: number;
  riskIndicators: RiskIndicator[];
}

export type RiskFeatureSet = {
  area?: string;
  generatedAt: string;
  source: 'verified_active_endorsements';
  verifiedActiveBusinessCount: number;
  helperCoverageCount: number;
  categoriesCovered: string[];
  freshnessDays: number;
  businesses: RiskFeatureBusiness[];
};

export type RiskPredictionResult = {
  features: RiskFeatureSet;
  prediction: {
    overall_score: number;
    level: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
    factors: {
      weather: number;
      flood: number;
      landslide: number;
      transport: number;
    };
    model_name: string;
    label_methodology_version: string;
  };
  request: Record<string, unknown>;
};

// ============================================================================
// API request input types (mirror zod schemas)
// ============================================================================

export type CreateBusinessInput = {
  name: string;
  category: string;
  subCategory?: string;
  description: string;
  location: LocationProfile;
  services: string[];
  establishedYear?: number;
  contactEmail?: string;
  contactPhone?: string;
  websiteUrl?: string;
  avatarUrl?: string;
};

export type UpdateBusinessInput = Partial<CreateBusinessInput>;

export type CreateInquiryInput = {
  businessId: string;
  category: string;
  location: LocationProfile;
  summary: string;
  supportingInfo?: string[];
  requestedCommercialMode?: CommercialMode;
  opportunityId?: string;
};

export type UpdateInquiryInput = {
  category?: string;
  location?: LocationProfile;
  summary?: string;
  supportingInfo?: string[];
  requestedCommercialMode?: CommercialMode;
};

export type CreateOpportunityInput = {
  businessId: string;
  sourceInquiryId?: string;
  title: string;
  description: string;
  category: string;
  location: LocationProfile;
  eligibilityCriteria?: string;
  expiresAt?: string;
};

export type SubmitHelperEndorsementInput = {
  businessId: string;
  inquiryId?: string;
  reason: string;
  location: LocationProfile;
  category: string;
  evidenceRefs?: string[];
};

export type AddEvidenceInput = {
  kind: EvidenceKind;
  title: string;
  reference: string;
};

export type RiskPredictionInput = {
  area?: string;
  travelMonth?: number;
  travelStyle?: 'budget' | 'mid-range' | 'luxury';
};

// ============================================================================
// Admin detail view (GET /admin/inquiries/:id)
// ============================================================================

export type InquiryDetail = {
  inquiry: EndorsementInquiry;
  classification: EndorsementClassification | null;
  verificationPolicy: {
    inspectionRequired: boolean;
    level: VerificationLevel;
    description: string;
  };
  arrangements: CommercialArrangement[];
  inspections: Inspection[];
  evidence: Evidence[];
  helperEndorsements: HelperEndorsement[];
};

export type AdminDashboard = {
  counts: {
    inquiries: number;
    draft: number;
    submitted: number;
    underReview: number;
    additionalInfo: number;
    inspectionRequired: number;
    verified: number;
    active: number;
    rejected: number;
  };
  helperEndorsement: {
    total: number;
    verified: number;
    pendingReview: number;
  };
  sponsorship: {
    pending: number;
    active: number;
  };
  coverage: HelperCoverage[];
  recentActivity: AuditLogEntry[];
};
