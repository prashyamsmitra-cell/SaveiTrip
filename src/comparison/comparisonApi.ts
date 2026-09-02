const API_URL = import.meta.env.VITE_API_URL ?? "";
const TOKEN_KEY = "saveitrip_token";

export type TravelQuery = {
  destination: string;
  dateFrom: string;
  dateTo: string;
  adults: number;
  children?: number;
  rooms?: number;
};

export type ComparisonOffer = {
  id: string;
  property: string;
  provider: string;
  price: number;
  currency: string;
  rating?: number;
  redirectUrl: string;
  imageUrl?: string;
  nightlyPrice?: number;
  nights?: number;
  bedrooms?: number;
  bathrooms?: number;
  maxOccupancy?: number;
  propertyType?: string;
  amenities?: string[];
  location?: {
    city?: string;
    country?: string;
  };
};

export type CheapestOffer = {
  id: string;
  property: string;
  provider: string;
  price: number;
  currency: string;
};

export type ComparisonSearchResult = {
  query: TravelQuery;
  results: ComparisonOffer[];
  allResults?: ComparisonOffer[];
  cheapest: CheapestOffer | null;
  lastChecked: string;
};

export type Analytics = {
  searches: number;
  offersDisplayed: number;
  byProvider: Record<string, number>;
};

async function authedRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message ?? "Request failed");
  }

  return response.json() as Promise<T>;
}

function toQueryString(query: TravelQuery): string {
  const params = new URLSearchParams({
    destination: query.destination,
    dateFrom: query.dateFrom,
    dateTo: query.dateTo,
    adults: String(query.adults),
  });
  if (query.children != null) params.set("children", String(query.children));
  if (query.rooms != null) params.set("rooms", String(query.rooms));
  return params.toString();
}

export async function searchOffers(query: TravelQuery) {
  return authedRequest<ComparisonSearchResult>(
    `/api/comparison/search?${toQueryString(query)}`
  );
}

export async function fetchAnalytics() {
  return authedRequest<Analytics>("/api/comparison/analytics");
}

export async function unlockAllResults() {
  return authedRequest<{ redirectUrl: string }>("/api/comparison/unlock");
}
