export type ServiceSlug = "assistant" | "helpers" | "comparison" | "sos";

export type Service = {
  slug: ServiceSlug;
  number: string;
  title: string;
  status: string;
  cta: string;
  summary: string;
  purpose: string[];
};

export const services: Service[] = [
  {
    slug: "assistant",
    number: "01",
    title: "Travel Assistant",
    status: "Live",
    cta: "Open",
    summary: "Your unified AI travel companion for Indian destinations.",
    purpose: [
      "conversational trip planning",
      "risk and safety assessment",
      "budget estimation",
      "destination intelligence"
    ]
  },
  {
    slug: "helpers",
    number: "02",
    title: "Travel Helper",
    status: "Live",
    cta: "Browse",
    summary: "Find verified local guides and helpers across India.",
    purpose: [
      "local guide discovery",
      "verified helpers",
      "regional expertise",
      "authentic experiences"
    ]
  },
  {
    slug: "comparison",
    number: "03",
    title: "Market Analysis",
    status: "Live",
    cta: "Explore",
    summary: "Understand what your trip should cost before you book.",
    purpose: [
      "market price range",
      "trusted provider comparison",
      "package differences",
      "best-value options"
    ]
  },
  {
    slug: "sos",
    number: "04",
    title: "Emergency SOS",
    status: "Under Research",
    cta: "Learn More",
    summary: "Researching emergency communication for limited-connectivity areas.",
    purpose: [
      "offline communication research",
      "limited-connectivity travel support",
      "emergency preparedness",
      "future field validation"
    ]
  }
];

export function statusTone(status: string): string {
  if (status === "Under Research") {
    return "bg-accent-amber-soft text-accent-amber";
  }
  return "bg-accent-green-soft text-accent-green";
}

export const getService = (slug: ServiceSlug) => services.find((service) => service.slug === slug);
