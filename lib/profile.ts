import { fetchMe, updateProfile } from "@/lib/auth";
import type { User, UserPreferences } from "@/types";

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
  { id: "modern-minimalist", label: "Modern Minimalist", description: "Clean sculptural lines, architectural foliage, and monochromatic simplicity.", iconName: "filter_vintage" },
  { id: "classic-romance", label: "Classic Romance", description: "Garden roses, lush ranunculus, soft textures, and graceful rounded silhouettes.", iconName: "favorite" },
  { id: "wild-organic", label: "Wild & Organic", description: "Textural field blooms, airy greenery, cascading stems, and botanical movement.", iconName: "local_florist" },
  { id: "bohemian-chic", label: "Bohemian Chic", description: "Dried sun-bleached florals, pampas grass, warm rust, and tactile earthy accents.", iconName: "spa" },
  { id: "english-garden", label: "English Garden", description: "Abundant fragrant blooms, sweet peas, delphiniums, and timeless cottage elegance.", iconName: "park" },
  { id: "bold-statement", label: "Bold & Sculptural", description: "Exotic anthuriums, birds of paradise, rich statement foliage, and dramatic presence.", iconName: "flare" },
];

export const COLOR_PALETTE_OPTIONS: ColorPaletteOption[] = [
  { id: "soft-pastels", label: "Soft Pastels", description: "Blush, creamy ivory, delicate peach, lilac, and pale sage.", colors: ["#F7DCDC", "#FFF5EB", "#E7E0F8", "#E2EBD8"] },
  { id: "bold-vibrant", label: "Bold & Vibrant", description: "Golden honey, bright coral, vivid fuchsia, and energetic citrus.", colors: ["#F2B705", "#E86A58", "#D83A56", "#FF9F45"] },
  { id: "neutral-earth", label: "Warm Earth Tones", description: "Terracotta, toasted caramel, amber, dried taupe, and bronze.", colors: ["#C47B57", "#D4A373", "#817660", "#4F4633"] },
  { id: "white-green", label: "Monochromatic White & Green", description: "Crisp white, silver dollar eucalyptus, pearlescent petals, and forest greens.", colors: ["#FFFFFF", "#F5F3EE", "#8A9A86", "#354F3F"] },
  { id: "moody-jewel", label: "Moody Jewel Tones", description: "Deep burgundy, plum, midnight navy, and rich amethyst.", colors: ["#541212", "#431C5D", "#192E5B", "#795900"] },
];

export const PRESET_AVATARS = [
  { id: "sarah", name: "Editorial Floral Portrait", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" },
  { id: "botanist", name: "Botanical Garden Warmth", url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80" },
  { id: "creative", name: "Natural Studio Light", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" },
  { id: "artisan", name: "Morning Sun Glow", url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80" },
];

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  phone: "",
  birthday: "",
  flowerStyles: [],
  flowerColors: [],
  favoriteBlooms: "",
  emailConsent: true,
  smsConsent: false,
  avatarUrl: PRESET_AVATARS[0].url,
};

export function userToPreferences(user: User | null | undefined): UserPreferences {
  if (!user) return DEFAULT_USER_PREFERENCES;
  return {
    phone: user.phone ?? DEFAULT_USER_PREFERENCES.phone,
    birthday: user.birthday ?? DEFAULT_USER_PREFERENCES.birthday,
    flowerStyles: user.flowerStyles ?? DEFAULT_USER_PREFERENCES.flowerStyles,
    flowerColors: user.flowerColors ?? DEFAULT_USER_PREFERENCES.flowerColors,
    favoriteBlooms: user.favoriteBlooms ?? DEFAULT_USER_PREFERENCES.favoriteBlooms,
    emailConsent: user.emailConsent ?? DEFAULT_USER_PREFERENCES.emailConsent,
    smsConsent: user.smsConsent ?? DEFAULT_USER_PREFERENCES.smsConsent,
    avatarUrl: user.avatarUrl ?? DEFAULT_USER_PREFERENCES.avatarUrl,
  };
}

export async function fetchUserPreferences(): Promise<UserPreferences> {
  try {
    const user = await fetchMe();
    return userToPreferences(user);
  } catch {
    return DEFAULT_USER_PREFERENCES;
  }
}

export function getUserPreferences(user: User): UserPreferences;
export function getUserPreferences(userOrId?: User | string | null): Promise<UserPreferences>;
export function getUserPreferences(userOrId?: User | string | null): UserPreferences | Promise<UserPreferences> {
  if (typeof userOrId === "object" && userOrId !== null) {
    return userToPreferences(userOrId);
  }
  return fetchUserPreferences();
}

export async function saveUserPreferences(
  userIdOrPrefs?: string | Partial<UserPreferences>,
  maybePrefs?: Partial<UserPreferences>
): Promise<UserPreferences> {
  let partial: Partial<UserPreferences>;
  if (typeof userIdOrPrefs === "string") {
    partial = maybePrefs ?? {};
  } else if (typeof userIdOrPrefs === "object" && userIdOrPrefs !== null) {
    partial = userIdOrPrefs;
  } else {
    partial = maybePrefs ?? {};
  }

  const user = await fetchMe();
  const merged: UserPreferences = {
    ...userToPreferences(user),
    ...partial,
  };

  await updateProfile(merged);
  return merged;
}

export function clearUserPreferences(): void {
  // Preferences are now stored on the server; nothing to clear locally.
}
