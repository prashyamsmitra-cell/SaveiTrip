const API_URL = import.meta.env.VITE_API_URL ?? "";
const TOKEN_KEY = "saveitrip_token";

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

export type HelperPost = {
  id: string;
  imageUrl: string;
  caption: string;
  likes: number;
  destination: string;
  date: string;
};

export type HelperSocialLinks = {
  instagram?: string;
  website?: string;
};

export type TravelHelper = {
  id: string;
  name: string;
  region: string;
  speciality: string[];
  languages: string[];
  rating: number;
  reviewCount: number;
  experience: string;
  phone: string;
  available: boolean;
  priceRange: string;
  accountType: "VERIFIED" | "DEMO";
  avatarUrl: string;
  bio: string;
  location: string;
  nearbyDestination: string;
  distanceKm: number;
  posts: HelperPost[];
  socialLinks: HelperSocialLinks;
  isVerified: boolean;
  yearsActive: number;
};

export async function listHelpers() {
  return authedRequest<{ helpers: TravelHelper[] }>("/api/helpers");
}

export async function searchHelpers(region?: string, speciality?: string) {
  const params = new URLSearchParams();
  if (region) params.set("region", region);
  if (speciality) params.set("speciality", speciality);
  const qs = params.toString();
  return authedRequest<{ helpers: TravelHelper[] }>(`/api/helpers/search${qs ? `?${qs}` : ""}`);
}

export async function getHelper(id: string) {
  return authedRequest<{ helper: TravelHelper }>(`/api/helpers/${id}`);
}
