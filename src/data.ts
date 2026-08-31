export type Outlook = "Good" | "Moderate" | "Caution";

export interface Destination {
  id: string;
  name: string;
  state: string;
  image: string;
  temp: string;
  condition: string;
  outlookScore: string;
  outlook: Outlook;
  landslideRisk: "Low" | "Moderate" | "High";
  weather: "Good" | "Fair" | "Poor";
  whyGo: string;
  consider: string;
  recommendation: string;
}

export const destinations: Destination[] = [
  {
    id: "manali",
    name: "Manali",
    state: "Himachal Pradesh",
    image: "https://images.unsplash.com/photo-1597167231350-d057a45dc868?auto=format&fit=crop&w=1400&q=80",
    temp: "24 C",
    condition: "Partly Cloudy",
    outlookScore: "4.2 / 10",
    outlook: "Moderate",
    landslideRisk: "Low",
    weather: "Good",
    whyGo: "Beautiful conditions for sightseeing and photography.",
    consider: "Recent rainfall may increase landslide risk on some routes.",
    recommendation: "Suitable with reasonable precautions.",
  },
  {
    id: "sikkim",
    name: "Sikkim",
    state: "Sikkim",
    image: "https://images.unsplash.com/photo-1517373263199-baee103d2980?auto=format&fit=crop&w=1400&q=80",
    temp: "18 C",
    condition: "Overcast",
    outlookScore: "5.8 / 10",
    outlook: "Moderate",
    landslideRisk: "Moderate",
    weather: "Fair",
    whyGo: "Dramatic valleys and monasteries, quieter than peak season.",
    consider: "Mountain routes may see intermittent closures after rain.",
    recommendation: "Check route conditions before departure.",
  },
  {
    id: "kashmir",
    name: "Kashmir",
    state: "Jammu & Kashmir",
    image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1400&q=80",
    temp: "16 C",
    condition: "Clear",
    outlookScore: "7.6 / 10",
    outlook: "Good",
    landslideRisk: "Low",
    weather: "Good",
    whyGo: "Crisp air, calm lakes, and excellent visibility for houseboats.",
    consider: "Evenings turn cold, so pack for a wide temperature swing.",
    recommendation: "A strong window to travel.",
  },
  {
    id: "darjeeling",
    name: "Darjeeling",
    state: "West Bengal",
    image: "https://images.unsplash.com/photo-1746175832129-fddb132c075c?auto=format&fit=crop&w=1400&q=80",
    temp: "19 C",
    condition: "Misty",
    outlookScore: "6.4 / 10",
    outlook: "Good",
    landslideRisk: "Low",
    weather: "Fair",
    whyGo: "Tea gardens and toy-train views, best in the early morning light.",
    consider: "Morning mist can delay Tiger Hill sunrise viewpoints.",
    recommendation: "Good time to visit, plan mornings loosely.",
  },
  {
    id: "kerala",
    name: "Kerala",
    state: "Kerala",
    image: "https://images.unsplash.com/photo-1785932413547-cdd1159e1f1e?auto=format&fit=crop&w=1400&q=80",
    temp: "29 C",
    condition: "Humid",
    outlookScore: "6.9 / 10",
    outlook: "Good",
    landslideRisk: "Low",
    weather: "Good",
    whyGo: "Calm backwaters and houseboats, comfortable outside monsoon.",
    consider: "Humidity is high through the afternoon.",
    recommendation: "Favourable for a backwaters itinerary.",
  },
  {
    id: "goa",
    name: "Goa",
    state: "Goa",
    image: "https://images.unsplash.com/photo-1695411560235-595738c0dbda?auto=format&fit=crop&w=1400&q=80",
    temp: "31 C",
    condition: "Sunny",
    outlookScore: "8.1 / 10",
    outlook: "Good",
    landslideRisk: "Low",
    weather: "Good",
    whyGo: "Clear skies across both coasts, calm surf for beach days.",
    consider: "Peak-season crowds at popular beaches.",
    recommendation: "Excellent conditions for a coastal trip.",
  },
];

export const heroImage = "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=2400&q=80";
export const loginImage = "https://images.unsplash.com/photo-1597167231350-d057a45dc868?auto=format&fit=crop&w=1400&q=80";

export const aiExchanges = [
  {
    question: "I'm planning a family trip to Sikkim next week. Should I go?",
    answer: "Current conditions are generally favorable, although recent rainfall may increase landslide risk on some mountain routes. Check route conditions before departure and avoid unnecessary night travel.",
  },
  {
    question: "Is Goa safe for a long weekend in late August?",
    answer: "Conditions look excellent, with clear skies, calm surf, and low weather risk. It is a strong window for a relaxed coastal itinerary.",
  },
  {
    question: "We'd like to drive Manali to Leh. Advise on roads?",
    answer: "High passes are open but thin air and a few moderate-landslide patches warrant caution. Plan altitude stops and check local advisories before each leg.",
  },
];

export const stats = [
  { value: "6,000+", label: "Destinations assessed" },
  { value: "40,000+", label: "Travel decisions supported" },
  { value: "28", label: "States covered across India" },
  { value: "4.8 / 5", label: "Average traveller rating" },
];

export const insights = [
  { title: "Route-level risk", description: "Go beyond a city weather forecast and understand the specific roads, passes and valleys on your route." },
  { title: "Recency you can trust", description: "Assessments combine current conditions with historical patterns so you see both the season and the day." },
  { title: "A plain recommendation", description: "No data dumps. You get a clear outlook, the reasons behind it, and a simple recommendation." },
];

export const pricingPlans = [
  { name: "Free", price: "Rs 0", features: ["1 AI Travel Assessment per day", "Basic destination intelligence", "Basic risk overview"], cta: "Start Free", highlight: false },
  { name: "Explorer", price: "Coming Soon", features: ["Unlimited assessments", "Detailed travel intelligence", "Personalized recommendations"], cta: "Coming Soon", highlight: true },
  { name: "Pro", price: "Coming Soon", features: ["Advanced intelligence", "Route-level analysis", "Priority alerts"], cta: "Coming Soon", highlight: false },
];
