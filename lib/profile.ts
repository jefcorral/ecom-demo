import { UserPreferences } from "@/types";

export interface FlowerStyleOption {
  id: string;
  label: string;
  description: string;
  iconName: string;
}

export interface ColorPaletteOption {
  id: string;
  label: string;
  description: string;
  colors: string[];
}

export const FLOWER_STYLE_OPTIONS: FlowerStyleOption[] = [
  {
    id: "modern-minimalist",
    label: "Modern Minimalist",
    description: "Clean sculptural lines, architectural foliage, and monochromatic simplicity.",
    iconName: "filter_vintage",
  },
  {
    id: "classic-romance",
    label: "Classic Romance",
    description: "Garden roses, lush ranunculus, soft textures, and graceful rounded silhouettes.",
    iconName: "favorite",
  },
  {
    id: "wild-organic",
    label: "Wild & Organic",
    description: "Textural field blooms, airy greenery, cascading stems, and botanical movement.",
    iconName: "local_florist",
  },
  {
    id: "bohemian-chic",
    label: "Bohemian Chic",
    description: "Dried sun-bleached florals, pampas grass, warm rust, and tactile earthy accents.",
    iconName: "spa",
  },
  {
    id: "english-garden",
    label: "English Garden",
    description: "Abundant fragrant blooms, sweet peas, delphiniums, and timeless cottage elegance.",
    iconName: "park",
  },
  {
    id: "bold-statement",
    label: "Bold & Sculptural",
    description: "Exotic anthuriums, birds of paradise, rich statement foliage, and dramatic presence.",
    iconName: "flare",
  },
];

export const COLOR_PALETTE_OPTIONS: ColorPaletteOption[] = [
  {
    id: "soft-pastels",
    label: "Soft Pastels",
    description: "Blush, creamy ivory, delicate peach, lilac, and pale sage.",
    colors: ["#F7DCDC", "#FFF5EB", "#E7E0F8", "#E2EBD8"],
  },
  {
    id: "bold-vibrant",
    label: "Bold & Vibrant",
    description: "Golden honey, bright coral, vivid fuchsia, and energetic citrus.",
    colors: ["#F2B705", "#E86A58", "#D83A56", "#FF9F45"],
  },
  {
    id: "neutral-earth",
    label: "Warm Earth Tones",
    description: "Terracotta, toasted caramel, amber, dried taupe, and bronze.",
    colors: ["#C47B57", "#D4A373", "#817660", "#4F4633"],
  },
  {
    id: "white-green",
    label: "Monochromatic White & Green",
    description: "Crisp white, silver dollar eucalyptus, pearlescent petals, and forest greens.",
    colors: ["#FFFFFF", "#F5F3EE", "#8A9A86", "#354F3F"],
  },
  {
    id: "moody-jewel",
    label: "Moody Jewel Tones",
    description: "Deep burgundy, plum, midnight navy, and rich amethyst.",
    colors: ["#541212", "#431C5D", "#192E5B", "#795900"],
  },
];

export const PRESET_AVATARS = [
  {
    id: "sarah",
    name: "Editorial Floral Portrait",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "botanist",
    name: "Botanical Garden Warmth",
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "creative",
    name: "Natural Studio Light",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "artisan",
    name: "Morning Sun Glow",
    url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
  },
];

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  phone: "+1 (555) 234-8910",
  birthday: "1994-05-18",
  flowerStyles: ["Modern Minimalist", "Classic Romance"],
  flowerColors: ["Soft Pastels", "Monochromatic White & Green"],
  favoriteBlooms: "Ranunculus, White Peonies, Seeded Eucalyptus",
  emailConsent: true,
  smsConsent: true,
  avatarUrl: PRESET_AVATARS[0].url,
};

const PREFERENCES_KEY_PREFIX = "ecom_user_prefs_";

export function getUserPreferences(userId?: string): UserPreferences {
  if (typeof window === "undefined") {
    return DEFAULT_USER_PREFERENCES;
  }
  const key = `${PREFERENCES_KEY_PREFIX}${userId ?? "default"}`;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return DEFAULT_USER_PREFERENCES;
    }
    const parsed = JSON.parse(raw) as Partial<UserPreferences>;
    return {
      ...DEFAULT_USER_PREFERENCES,
      ...parsed,
    };
  } catch {
    return DEFAULT_USER_PREFERENCES;
  }
}

export function saveUserPreferences(
  userIdOrPrefs?: string | Partial<UserPreferences>,
  maybePrefs?: Partial<UserPreferences>
): UserPreferences {
  let userId: string | undefined;
  let partialPrefs: Partial<UserPreferences>;

  if (typeof userIdOrPrefs === "string") {
    userId = userIdOrPrefs;
    partialPrefs = maybePrefs ?? {};
  } else if (typeof userIdOrPrefs === "object" && userIdOrPrefs !== null) {
    userId = undefined;
    partialPrefs = userIdOrPrefs;
  } else {
    partialPrefs = maybePrefs ?? {};
  }

  if (typeof window === "undefined") {
    return { ...DEFAULT_USER_PREFERENCES, ...partialPrefs };
  }

  const current = getUserPreferences(userId);
  const merged: UserPreferences = {
    ...current,
    ...partialPrefs,
  };

  const key = `${PREFERENCES_KEY_PREFIX}${userId ?? "default"}`;
  try {
    localStorage.setItem(key, JSON.stringify(merged));
    window.dispatchEvent(new Event("bloom-user-preferences"));
  } catch {
    // Ignore quota issues
  }
  return merged;
}

export function clearUserPreferences(userId?: string): void {
  if (typeof window === "undefined") return;
  const key = `${PREFERENCES_KEY_PREFIX}${userId ?? "default"}`;
  try {
    localStorage.removeItem(key);
    window.dispatchEvent(new Event("bloom-user-preferences"));
  } catch {
    // Ignore
  }
}
