import { Category, Occasion, Product, Tag } from "@/types";

export const mockCategories: Category[] = [
  { id: "cat-1", name: "Birthday", description: "Celebrate their special day", isActive: true },
  { id: "cat-2", name: "Romance", description: "Romantic arrangements", isActive: true },
  { id: "cat-3", name: "Sympathy", description: "Thoughtful condolences", isActive: true },
  { id: "cat-4", name: "Plants", description: "Lush green plants", isActive: true },
  { id: "cat-5", name: "Gifts", description: "Curated gift sets", isActive: true },
  { id: "cat-6", name: "Just Because", description: "Spontaneous surprises", isActive: true },
];

export const mockTags: Tag[] = [
  { id: "tag-1", name: "White" },
  { id: "tag-2", name: "Elegant" },
  { id: "tag-3", name: "Large" },
  { id: "tag-4", name: "Premium" },
  { id: "tag-5", name: "Fast" },
];

export const mockOccasions: Occasion[] = [
  { id: "occ-1", name: "Birthday" },
  { id: "occ-2", name: "Wedding" },
  { id: "occ-3", name: "Sympathy" },
  { id: "occ-4", name: "Anniversary" },
  { id: "occ-5", name: "Just Because" },
];

const now = new Date().toISOString();

const baseImages = [
  "https://images.unsplash.com/photo-1563241527-3004b7be025f?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1487530811176-3780de880c0d?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1614594975525-e45890e2e126?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1602607688737-42708318dc64?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1525310072745-f49212b5ac82?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1559563458-527698bf5295?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1562690868-60bbe4fc8154?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1582794543139-8ac92e93ef08?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1494336934272-f0efcedfc8d7?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1459411552884-841db9b3cc5a?w=600&h=600&fit=crop",
];

const baseNames = [
  "The Juliet", "Morning Sun", "Pure Elegance", "Wild Meadow", "Monstera Deliciosa",
  "Candle & Bloom Box", "Spring Awakening", "Tulip Field", "Muted Majesty", "Modernist Arc",
  "Blush Peony Vase", "Succulent Garden", "Lavender Mist", "Golden Hour", "Velvet Rose",
  "Garden Grace", "Orchid Whisper", "Peach Bellini", "Citrus Splash", "Dahlia Dream",
  "Forest Fern", "Berry Blush", "Sunset Glow", "Eucalyptus Breeze", "Wild Poppy",
  "Crystal Vase", "Petite Posy", "Grand Gala", "Soft Serenade", "Harvest Hues",
  "Ocean Mist", "Desert Bloom", "Tropical Paradise", "English Garden", "Parisian Charm",
];

const descriptors = [
  "A lush bouquet", "A cheerful arrangement", "An elegant centerpiece", "A garden-style mix",
  "A striking plant", "A curated gift set", "A soft pastel collection", "A vibrant display",
  "A wild centerpiece", "A minimalist design", "A delicate vase", "A charming trio",
  "A fragrant bundle", "A sunny selection", "A romantic classic", "A modern creation",
  "A thoughtful gift", "A seasonal favorite", "A boutique arrangement", "A premium hand-tied",
];

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function generateProducts(count: number): Product[] {
  return Array.from({ length: count }, (_, i) => {
    const index = i + 1;
    const nameBase = baseNames[i % baseNames.length];
    const variant = Math.floor(i / baseNames.length) > 0 ? ` ${Math.floor(i / baseNames.length) + 1}` : "";
    const name = `${nameBase}${variant}`;
    const category = mockCategories[i % mockCategories.length];
    const basePrice = 40 + Math.floor(seededRandom(index) * 130);
    const isSale = seededRandom(index + 100) > 0.85;
    const salePrice = isSale ? Math.floor(basePrice * 0.8) : null;
    const sameDayDelivery = seededRandom(index + 200) > 0.6;
    const isBestSeller = seededRandom(index + 300) > 0.85;
    const stock = Math.floor(seededRandom(index + 400) * 35);

    return {
      id: `prod-${index}`,
      name,
      sku: `SKU-${String(index).padStart(4, "0")}`,
      description: `${descriptors[i % descriptors.length]} perfect for any occasion.`,
      imageUrl: `${baseImages[i % baseImages.length]}&index=${index}`,
      price: basePrice,
      stock,
      lowStockThreshold: 5,
      isActive: true,
      categoryId: category.id,
      category,
      createdAt: now,
      updatedAt: now,
      sameDayDelivery,
      salePrice,
      isBestSeller,
    };
  });
}

export const mockProducts: Product[] = generateProducts(124);
