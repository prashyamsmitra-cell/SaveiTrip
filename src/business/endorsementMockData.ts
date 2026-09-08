import type { EndorsementOpportunity } from "./endorsementTypes";

const minutesAgo = (mins: number) => new Date(Date.now() - mins * 60_000).toISOString();

export const endorsementMockOpportunities: EndorsementOpportunity[] = [
  {
    id: "opp-01",
    businessName: "Annapurna Family Kitchen",
    category: "Food & Restaurants",
    location: "Gangtok, Sikkim",
    distanceKm: 1.2,
    scale: "Small · ₹5L–₹25L/yr",
    postedAt: minutesAgo(18),
    status: "available",
    summary: "Home-style Sikkimese thalis loved by locals. Wants weekend travellers to discover the tasting menu and momo workshop."
  },
  {
    id: "opp-02",
    businessName: "Riverstone Homestay",
    category: "Accommodation & Stays",
    location: "Lachung, North Sikkim",
    distanceKm: 48.5,
    scale: "Mid · ₹25L–₹1Cr/yr",
    postedAt: minutesAgo(44),
    status: "available",
    summary: "Family-run riverside homestay with view of the valley. Seeking endorsement for the winter trekking season."
  },
  {
    id: "opp-03",
    businessName: "Kanchenjunga Trail Guides",
    category: "Tours & Experiences",
    location: "Yuksom, Sikkim",
    distanceKm: 96.3,
    scale: "Small · ₹5L–₹25L/yr",
    postedAt: minutesAgo(75),
    status: "available",
    summary: "Certified high-altitude trekking guides offering small-group expeditions on the old Silk Route."
  },
  {
    id: "opp-04",
    businessName: "Brew & Bloom Café",
    category: "Cafes & Bakeries",
    location: "M.G. Marg, Gangtok",
    distanceKm: 0.8,
    scale: "Micro · < ₹5L/yr",
    postedAt: minutesAgo(132),
    status: "claimed",
    summary: "Speciality coffee roastery plus a scratch bakery. Wants a photo-verified review for the new alfresco deck."
  },
  {
    id: "opp-05",
    businessName: "Himalayan Handlooms",
    category: "Shopping & Handicrafts",
    location: "Namchi, Sikkim",
    distanceKm: 64.1,
    scale: "Small · ₹5L–₹25L/yr",
    postedAt: minutesAgo(190),
    status: "claimed",
    summary: "Cooperative of weavers producing traditional Lepcha and Bhutia textiles for export."
  },
  {
    id: "opp-06",
    businessName: "Tashi Heritage Museum",
    category: "Heritage & Museums",
    location: "Pelling, Sikkim",
    distanceKm: 111.7,
    scale: "Micro · < ₹5L/yr",
    postedAt: minutesAgo(305),
    status: "under-review",
    summary: "Private collection of rare thankas and local artefacts. Wants endorsement for guided heritage walks."
  },
  {
    id: "opp-07",
    businessName: "Green Trails Exotics",
    category: "Adventure & Sports",
    location: "Pelling, Sikkim",
    distanceKm: 112.2,
    scale: "Mid · ₹25L–₹1Cr/yr",
    postedAt: minutesAgo(410),
    status: "under-review",
    summary: "Paragliding and river-rafting outfitters requesting an on-ground safety and quality inspection."
  },
  {
    id: "opp-08",
    businessName: "Cherry Orchard Ayurveda",
    category: "Wellness & Spas",
    location: "Ravangla, Sikkim",
    distanceKm: 88.9,
    scale: "Small · ₹5L–₹25L/yr",
    postedAt: minutesAgo(540),
    status: "endorsed",
    summary: "Authentic Panchakarma retreat verified for hygiene and service. Endorsement published last week."
  },
  {
    id: "opp-09",
    businessName: "Singalila Valley Cabs",
    category: "Transport & Cabs",
    location: "Darjeeling, West Bengal",
    distanceKm: 122.4,
    scale: "Mid · ₹25L–₹1Cr/yr",
    postedAt: minutesAgo(720),
    status: "endorsed",
    summary: "Verified fleet for airport transfers and hill-station day trips. Endorsement active for the season."
  },
  {
    id: "opp-10",
    businessName: "North Star Souvenirs",
    category: "Shopping & Handicrafts",
    location: "Gangtok, Sikkim",
    distanceKm: 1.5,
    scale: "Micro · < ₹5L/yr",
    postedAt: minutesAgo(980),
    status: "not-endorsed",
    summary: "Discontinued after inspection failed the authenticity checklist. Re-submission allowed in 90 days."
  },
  {
    id: "opp-11",
    businessName: "Ban Jhakri Mini Hotel",
    category: "Accommodation & Stays",
    location: "Rumtek, Sikkim",
    distanceKm: 24.6,
    scale: "Micro · < ₹5L/yr",
    postedAt: minutesAgo(1240),
    status: "not-endorsed",
    summary: "Budget stay near Rumtek Monastery declined pending separate clearance on fire-safety documentation."
  }
];