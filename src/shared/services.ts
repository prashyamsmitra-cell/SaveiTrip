export type ServiceSlug = "comparison" | "prediction" | "sos";

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
    slug: "comparison",
    number: "01",
    title: "Travel Market Analysis",
    status: "Coming Soon",
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
    slug: "prediction",
    number: "02",
    title: "Travel Intelligence",
    status: "Coming Soon",
    cta: "Explore",
    summary: "Prepare for destination conditions with future ML-powered context.",
    purpose: [
      "weather and rainfall signals",
      "floods, landslides and snowfall",
      "destination conditions",
      "travel suitability context"
    ]
  },
  {
    slug: "sos",
    number: "03",
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
