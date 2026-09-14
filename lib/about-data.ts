import {
  CraftsmanshipStep,
  FloristProfile,
  GrowerPartnership,
  PressQuote,
  SustainabilityPillar,
} from "@/types";

export const FOUNDER_STORY = {
  name: "Eleanor Vance",
  title: "Founder & Creative Director",
  yearFounded: 2018,
  location: "Portland, Oregon",
  headline: "Born from a love of untamed Pacific Northwest flora.",
  storyParagraphs: [
    "Bloom & Stem began in the spring of 2018 inside a sun-drenched greenhouse in Northwest Portland. Disillusioned by mass-produced, chemically preserved imports wrapped in single-use plastic, founder Eleanor Vance envisioned a slower, more deliberate floral atelier—one rooted in seasonal honesty, architectural form, and ecological care.",
    "What started as bespoke bouquets delivered to local neighborhood cafes has grown into a premier Pacific Northwest florist studio. Yet our ethos remains unchanged: every single arrangement is treated as a fleeting piece of living art, composed by master florists using stems cut just hours before delivery.",
  ],
  quote:
    "Floristry is an architectural dialogue between human emotion and botanical wildness. We don't tame flowers—we give them the stage to tell their story.",
  portraitUrl:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
  studioHeroUrl:
    "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?auto=format&fit=crop&w=1200&q=80",
};

export const FLORISTS_DATA: FloristProfile[] = [
  {
    id: "eleanor",
    name: "Eleanor Vance",
    role: "Founder & Creative Director",
    bio: "Trained in classical Dutch botanical painting and English naturalism, Eleanor leads the creative direction and seasonal collections at Bloom & Stem.",
    quote: "Every stem carries a natural gesture. Our work is simply listening to how it wants to curve.",
    favoriteBloom: "Garden Peonies & Tree Dahlia",
    imageUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    yearsWithStudio: 8,
    specialties: ["Large-Scale Installations", "Color Theory", "Seasonal Editorial"],
  },
  {
    id: "clara",
    name: "Clara Thorne",
    role: "Master Arranger",
    bio: "With over a decade of floral craft experience, Clara specializes in multi-textured garden bouquets and delicate wedding compositions.",
    quote: "Texture is everything. A wild sprig of scented geranium transforms an entire arrangement.",
    favoriteBloom: "Butterfly Ranunculus & Hellebore",
    imageUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
    yearsWithStudio: 5,
    specialties: ["Garden-Style Bouquets", "Sympathy Artistry", "Bespoke Packaging"],
  },
  {
    id: "sophia",
    name: "Sophia Rossi",
    role: "Botanical Stylist",
    bio: "Sophia brings an interior design background to Bloom & Stem, focusing on vessel selection, dried botanical sculpture, and living plant curation.",
    quote: "The vessel should embrace the flora as naturally as the soil it came from.",
    favoriteBloom: "Coral Charm Peony & Slipper Orchid",
    imageUrl:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80",
    yearsWithStudio: 4,
    specialties: ["Vessel Styling", "Terrariums & Plants", "Dried Botanicals"],
  },
  {
    id: "liam",
    name: "Liam Chen",
    role: "Director of Sourcing & Cold Chain",
    bio: "Liam partners directly with regional growers across Oregon and Washington to guarantee unmatched freshness from soil to studio.",
    quote: "Freshness isn't a buzzword; it's a precise chain of humidity, hydration, and timing.",
    favoriteBloom: "Café au Lait Dahlia & Sweet Pea",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    yearsWithStudio: 6,
    specialties: ["Sustainable Sourcing", "Cold-Chain Logistics", "Farm Relations"],
  },
];

export const GROWER_PARTNERSHIPS: GrowerPartnership[] = [
  {
    id: "mount-hood",
    farmName: "Mount Hood Peony & Rose Estate",
    location: "Hood River Valley, Oregon",
    specialty: "Coral charm peonies, garden roses, and heirloom lilacs",
    distance: "42 miles from studio",
    description: "Nestled at the base of Mount Hood, this family-run farm benefits from volcanic, mineral-rich soil and cool alpine nights, producing exceptionally sturdy stems and vibrant blooms.",
    practices: ["100% Pesticide-free", "Salmon-Safe Certified", "Drip Irrigation"],
    imageUrl:
      "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "columbia-gorge",
    farmName: "Columbia River Dahlia Collective",
    location: "White Salmon, Washington",
    specialty: "Dinnerplate dahlias, zinnias, and autumn cosmos",
    distance: "65 miles from studio",
    description: "Cultivating over 80 heritage dahlia varieties under warm Gorge sunlight and wind-protected terraces. Harvested by hand every morning at 5:30 AM.",
    practices: ["Regenerative Soil Health", "Organic Composting", "Native Pollinator Corridors"],
    imageUrl:
      "https://images.unsplash.com/photo-1563241527-3004b7be025f?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "willamette-ranunculus",
    farmName: "Willamette Valley Ranunculus Fields",
    location: "Canby, Oregon",
    specialty: "Butterfly ranunculus, anemones, and sweet peas",
    distance: "28 miles from studio",
    description: "Specializing in delicate, paper-thin petals with multi-week vase life. Stems are conditioned immediately on-site in temperature-controlled spring water.",
    practices: ["Unheated Greenhouses", "Zero Chemical Preservatives", "Rainwater Catchment"],
    imageUrl:
      "https://images.unsplash.com/photo-1487530811176-3780de880c0d?auto=format&fit=crop&w=600&q=80",
  },
];

export const SUSTAINABILITY_PILLARS: SustainabilityPillar[] = [
  {
    id: "foam-free",
    title: "100% Floral Foam Free",
    metric: "0% Microplastics",
    description: "We refuse toxic synthetic foam.",
    detail: "We use reusable Japanese kenzan (metal pin frogs), Agra-Wool, and chicken wire armatures for all arrangements.",
  },
  {
    id: "local-first",
    title: "Pacific Northwest Local Sourcing",
    metric: "85%+ Regional",
    description: "Harvested within 150 miles in season.",
    detail: "Direct relationships with family growers across Oregon and Washington eliminate excessive air freight and cold storage.",
  },
  {
    id: "eco-packaging",
    title: "Compostable & Recycled Packaging",
    metric: "100% Recyclable",
    description: "Zero single-use plastics.",
    detail: "Our signature gift wraps are made from unbleached kraft paper, plant-based hydration pouches, and organic hemp twine.",
  },
  {
    id: "green-fleet",
    title: "Carbon-Neutral Local Couriers",
    metric: "100% Offset",
    description: "Low-impact urban delivery.",
    detail: "Our temperature-managed delivery fleet uses route optimization and carbon-offset partnerships for all metro deliveries.",
  },
];

export const CRAFTSMANSHIP_STEPS: CraftsmanshipStep[] = [
  {
    step: 1,
    title: "Dawn Harvest & Conditioning",
    tagline: "Cut at peak hydration",
    description: "Blooms are cut in the cool morning mist, recut under water, and conditioned for 4 hours to ensure maximum longevity.",
    detail: "Every stem is inspected for petal integrity, strong foliage, and pristine hydration before styling.",
  },
  {
    step: 2,
    title: "Bespoke Botanical Composition",
    tagline: "Layered textures & organic gesture",
    description: "Our master florists hand-tie each arrangement using the spiral technique, giving each stem breathing room to open naturally.",
    detail: "We pair focal blooms with textural secondary foliage and cascading greens to create an editorial silhouette.",
  },
  {
    step: 3,
    title: "Eco-Luxury Packaging & Water Bagging",
    tagline: "Wrapped for safe travel",
    description: "Stems are nestled into compostable hydration packs and wrapped in heavy textured botanical kraft with your custom handwritten note.",
    detail: "Finished with our embossed seal and botanical care instructions.",
  },
  {
    step: 4,
    title: "Climate-Guarded Doorstep Delivery",
    tagline: "Handed over with love",
    description: "Dedicated couriers transport arrangements upright in temperature-controlled vehicles directly to the recipient's hands.",
    detail: "Live delivery status notifications keep sender and recipient informed every step of the way.",
  },
];

export const PRESS_QUOTES: PressQuote[] = [
  {
    id: "ad",
    publication: "Architectural Digest",
    quote: "Bloom & Stem transforms the classic bouquet into a sculptural celebration of Pacific Northwest flora.",
    year: "2026",
    featuredArticle: "The New Wave of Botanical Atelier Design",
  },
  {
    id: "pm",
    publication: "Portland Monthly",
    quote: "The gold standard of sustainable artisanal floristry in the Pacific Northwest. Freshness that speaks for itself.",
    year: "2025",
    featuredArticle: "Best of the City: Artisans & Creators",
  },
  {
    id: "vl",
    publication: "Vogue Living",
    quote: "Eleanor Vance's poetic arrangements celebrate natural imperfection with unparalleled elegance and modern warmth.",
    year: "2025",
    featuredArticle: "Living with Botanicals: Pacific Northwest Edition",
  },
  {
    id: "br",
    publication: "The Botanical Journal",
    quote: "Proving luxury floral design and deep ecological responsibility can bloom together with effortless grace.",
    year: "2024",
    featuredArticle: "Sustainable Floristry Leaders",
  },
];
