import type {
  EndorsementInquiryInput,
  EndorsementInquiryResult,
  EndorsementOpportunity,
  EndorsementStatus
} from "./endorsementTypes";
import { endorsementMockOpportunities } from "./endorsementMockData";

export type {
  EndorsementInquiryInput,
  EndorsementInquiryResult,
  EndorsementOpportunity,
  EndorsementStatus
};

// Mock service boundary for the Business Endorsement feature.
// Swap the bodies of these functions for real API calls later without touching any UI.

const MOCK_LATENCY_MS = 650;

function simulateLatency(ms = MOCK_LATENCY_MS) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

const store: EndorsementOpportunity[] = endorsementMockOpportunities.map((item) => ({ ...item }));

export async function submitEndorsementInquiry(
  _input: EndorsementInquiryInput
): Promise<EndorsementInquiryResult> {
  await simulateLatency();
  return {
    inquiryId: `INQ-${Date.now().toString(36).toUpperCase()}`
  };
}

export async function listEndorsementOpportunities(): Promise<{
  opportunities: EndorsementOpportunity[];
}> {
  await simulateLatency(550);
  const opportunities = store
    .map((item) => ({ ...item }))
    .sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
  return { opportunities };
}

export async function setEndorsementOpportunityStatus(
  id: string,
  status: EndorsementStatus
): Promise<{ opportunity: EndorsementOpportunity }> {
  await simulateLatency(500);
  const item = store.find((entry) => entry.id === id);
  if (!item) {
    throw new Error("Opportunity not found.");
  }
  item.status = status;
  return { opportunity: { ...item } };
}