import { fetchApi } from "@/lib/api";

export type ContentSectionId = "announcement" | "hero" | "campaign" | "featured" | "occasions" | "spotlights" | "testimonials";
export type ContentStatus = "draft" | "published";

export interface AnnouncementContent { enabled: boolean; message: string; linkLabel: string; linkUrl: string; theme: "forest" | "gold" | "cream"; startsAt: string; endsAt: string; }
export interface HeroContent { enabled: boolean; eyebrow: string; headline: string; copy: string; primaryLabel: string; primaryUrl: string; secondaryLabel: string; secondaryUrl: string; desktopImage: string; mobileImage: string; alignment: "left" | "center" | "right"; }
export interface CampaignContent { enabled: boolean; name: string; headline: string; description: string; audience: string; startsAt: string; endsAt: string; image: string; }
export interface FeaturedContentProduct { id: string; name: string; price: number; image: string; stock: number; }
export interface SpotlightContent { id: string; title: string; description: string; link: string; image: string; enabled: boolean; }
export interface TestimonialContent { id: string; quote: string; customer: string; rating: number; product: string; published: boolean; }
export interface StorefrontContentData {
  status: ContentStatus;
  lastPublished: string;
  announcement: AnnouncementContent;
  hero: HeroContent;
  campaign: CampaignContent;
  featured: FeaturedContentProduct[];
  catalog: FeaturedContentProduct[];
  occasions: string[];
  spotlights: SpotlightContent[];
  testimonials: TestimonialContent[];
}

const images = [
  "https://images.unsplash.com/photo-1563241527-3004b7be025f?w=1000&h=700&fit=crop",
  "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=1000&h=700&fit=crop",
  "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=1000&h=700&fit=crop",
  "https://images.unsplash.com/photo-1487530811176-3780de880c0d?w=1000&h=700&fit=crop",
  "https://images.unsplash.com/photo-1582794543139-8ac92e93ef08?w=1000&h=700&fit=crop",
  "https://images.unsplash.com/photo-1494336934272-f0efcedfc8d7?w=1000&h=700&fit=crop",
];

const catalog: FeaturedContentProduct[] = [
  { id: "prod-1", name: "The Mayfair Grand Urn", price: 240, image: images[0], stock: 12 },
  { id: "prod-2", name: "Frosted Ranunculus & Eucalyptus", price: 135, image: images[1], stock: 8 },
  { id: "prod-3", name: "Nocturne Garden Rose Bundle", price: 160, image: images[2], stock: 5 },
  { id: "prod-4", name: "Tuscan Olive & Citrus Wreath", price: 155, image: images[3], stock: 15 },
  { id: "prod-5", name: "White Orchid Reserve", price: 185, image: images[4], stock: 4 },
  { id: "prod-6", name: "Spring Peony Atelier Vase", price: 195, image: images[5], stock: 10 },
];

const defaultContent: StorefrontContentData = {
  status: "published",
  lastPublished: "Today at 4:18 PM by Eleanor Vance",
  announcement: { enabled: true, message: "Complimentary cold-chain delivery on bespoke seasonal orders over $120", linkLabel: "Use code SOLSTICE", linkUrl: "/collections/solstice", theme: "forest", startsAt: "2026-11-01", endsAt: "2026-12-31" },
  hero: { enabled: true, eyebrow: "Autumn / Winter Solstice Botanicals", headline: "Living Floristry Sculpted for the Modern Sanctuary", copy: "Hand-harvested seasonal stems, slow-conditioned and wrapped in biodegradable Hydra-Silk fibers.", primaryLabel: "Explore Collection", primaryUrl: "/collections/solstice", secondaryLabel: "Explore Atelier", secondaryUrl: "/about", desktopImage: images[0], mobileImage: images[4], alignment: "left" },
  campaign: { enabled: true, name: "Mayfair Garden Party", headline: "Winter Solstice Reserve", description: "Crown exclusivity on our flagship representative estate, each batch pre-rooted in aged terracotta planters and wrapped in natural linen cords.", audience: "All Store Visitors", startsAt: "2026-11-01", endsAt: "2026-12-31", image: images[2] },
  featured: catalog.slice(0, 4), catalog,
  occasions: ["Birthday", "Romance", "Sympathy", "Wedding", "New Baby", "Thank You", "Just Because"],
  spotlights: [
    { id: "spot-1", title: "Bespoke Bridal Dossiers", description: "Custom floral architecture, scent, and ceremony consultations.", link: "/collections/weddings", image: images[3], enabled: true },
    { id: "spot-2", title: "Corporate & Hospitality Guild", description: "Weekly living installations for refined commercial interiors.", link: "/collections/corporate", image: images[1], enabled: true },
    { id: "spot-3", title: "Rare Dutch Bulb Subscriptions", description: "Quarterly releases of dormant collector bulbs.", link: "/subscriptions", image: images[5], enabled: true },
  ],
  testimonials: [
    { id: "test-1", quote: "Bloom & Stem’s Solstice collection converted our conservatory into an ethereal winter sanctuary.", customer: "Lady Cornelia Fox, Kensington", rating: 5, product: "The Nocturne Grand Urn", published: true },
    { id: "test-2", quote: "The tactile sensation of the Hydra-Silk wrap and cold-chain precision is unmatched anywhere in Mayfair.", customer: "Architectural Digest", rating: 5, product: "Tuscan Olive Wreath", published: true },
  ],
};

function mergeDefaults(data: Partial<StorefrontContentData>): StorefrontContentData {
  return {
    status: data.status ?? defaultContent.status,
    lastPublished: data.lastPublished ?? defaultContent.lastPublished,
    announcement: data.announcement ?? defaultContent.announcement,
    hero: data.hero ?? defaultContent.hero,
    campaign: data.campaign ?? defaultContent.campaign,
    featured: data.featured ?? defaultContent.featured,
    catalog: data.catalog ?? defaultContent.catalog,
    occasions: data.occasions ?? defaultContent.occasions,
    spotlights: data.spotlights ?? defaultContent.spotlights,
    testimonials: data.testimonials ?? defaultContent.testimonials,
  };
}

export async function fetchStorefrontContent(): Promise<StorefrontContentData> {
  const res = await fetchApi("/storefront-content");
  if (!res.ok) return defaultContent;
  const data = (await res.json()) as Partial<StorefrontContentData>;
  return mergeDefaults(data);
}

export async function saveStorefrontDraft(next: StorefrontContentData): Promise<StorefrontContentData> {
  const res = await fetchApi("/admin/storefront-content/draft", {
    method: "POST",
    body: JSON.stringify(next),
  });
  if (!res.ok) throw new Error("Failed to save draft");
  return mergeDefaults((await res.json()) as Partial<StorefrontContentData>);
}

export async function publishStorefrontContent(next: StorefrontContentData): Promise<StorefrontContentData> {
  const res = await fetchApi("/admin/storefront-content/publish", {
    method: "POST",
    body: JSON.stringify(next),
  });
  if (!res.ok) throw new Error("Failed to publish content");
  return mergeDefaults((await res.json()) as Partial<StorefrontContentData>);
}
