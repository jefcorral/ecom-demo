export type GiftCardFormat = "digital" | "physical";

export type GiftCardThemeId = "botanical" | "rose" | "forest" | "midnight";

export interface GiftCardTheme {
  id: GiftCardThemeId;
  name: string;
  tagline: string;
  cardBgClass: string;
  accentClass: string;
  badgeBgClass: string;
  textColorClass: string;
  subtextColorClass: string;
  borderClass: string;
  previewGradient: string;
}

export interface GiftCardDeliveryAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface GiftCardFormData {
  format: GiftCardFormat;
  theme: GiftCardThemeId;
  amount: number;
  customAmount: string;
  isCustom: boolean;
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  senderEmail: string;
  deliveryTiming: "instant" | "scheduled";
  deliveryDate: string;
  deliveryAddress: GiftCardDeliveryAddress;
  message: string;
  quantity: number;
}

export interface GiftCardBalanceResult {
  code: string;
  valid: boolean;
  balance: number;
  currency: string;
  expiresAt: string | null;
  lastUsedAt?: string;
  format: GiftCardFormat;
}
