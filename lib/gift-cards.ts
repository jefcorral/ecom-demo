import {
  GiftCardBalanceResult,
  GiftCardFormData,
  GiftCardTheme,
  GiftCardThemeId,
} from "@/types";

export const PRESET_AMOUNTS = [25, 50, 75, 100, 150, 200, 250];

export const GIFT_CARD_THEMES: Record<GiftCardThemeId, GiftCardTheme> = {
  botanical: {
    id: "botanical",
    name: "Botanical Signature",
    tagline: "Warm cream & signature golden foil petals",
    cardBgClass: "bg-[#FDFBF7] text-[#1B1C19]",
    accentClass: "text-[#B38600] border-[#E8DFC8]",
    badgeBgClass: "bg-[#F2B705]/20 text-[#654A00] border-[#E8DFC8]",
    textColorClass: "text-[#1B1C19]",
    subtextColorClass: "text-[#5C6B58]",
    borderClass: "border-[#E8DFC8]",
    previewGradient: "from-[#FDFBF7] via-[#F8F4EA] to-[#EFE7D4]",
  },
  rose: {
    id: "rose",
    name: "Rose & Blush",
    tagline: "Ethereal peony pink & soft rose gold trim",
    cardBgClass: "bg-[#FDF5F5] text-[#2C1C1D]",
    accentClass: "text-[#A84855] border-[#F2D6D9]",
    badgeBgClass: "bg-[#F7DCDC] text-[#745F60] border-[#F2D6D9]",
    textColorClass: "text-[#2C1C1D]",
    subtextColorClass: "text-[#7B6163]",
    borderClass: "border-[#F2D6D9]",
    previewGradient: "from-[#FDF5F5] via-[#FBEAEB] to-[#F5D8DB]",
  },
  forest: {
    id: "forest",
    name: "Forest Sanctuary",
    tagline: "Deep botanical olive & frosted eucalyptus",
    cardBgClass: "bg-[#1E2E1D] text-[#FDFBF6]",
    accentClass: "text-[#F2B705] border-[#364F34]",
    badgeBgClass: "bg-[#2C3E2A] text-[#F9BD14] border-[#3D573B]",
    textColorClass: "text-[#FDFBF6]",
    subtextColorClass: "text-[#BDCEBA]",
    borderClass: "border-[#364F34]",
    previewGradient: "from-[#223521] via-[#1E2E1D] to-[#142013]",
  },
  midnight: {
    id: "midnight",
    name: "Midnight Bloom",
    tagline: "Noir botanical canvas with radiant gilded foil",
    cardBgClass: "bg-[#1A1B19] text-[#FDFBF6]",
    accentClass: "text-[#F9BD14] border-[#3D3E3A]",
    badgeBgClass: "bg-[#30312E] text-[#FFDF9D] border-[#4A4B46]",
    textColorClass: "text-[#FDFBF6]",
    subtextColorClass: "text-[#D3C5AC]",
    borderClass: "border-[#333530]",
    previewGradient: "from-[#242521] via-[#1A1B19] to-[#0F100E]",
  },
};

export const QUICK_MESSAGES = [
  "Wishing you a birthday blooming with happiness!",
  "Thank you for your kindness and generous heart.",
  "Thinking of you and sending love and fresh blooms.",
  "Congratulations on this beautiful milestone!",
  "A little botanical joy just because you deserve it.",
];

export const INITIAL_GIFT_CARD_FORM: GiftCardFormData = {
  format: "digital",
  theme: "botanical",
  amount: 100,
  customAmount: "",
  isCustom: false,
  recipientName: "",
  recipientEmail: "",
  senderName: "",
  senderEmail: "",
  deliveryTiming: "instant",
  deliveryDate: "",
  deliveryAddress: {
    street: "",
    city: "",
    state: "",
    zip: "",
  },
  message: "",
  quantity: 1,
};
export interface FormErrors {
  recipientName?: string;
  recipientEmail?: string;
  senderName?: string;
  senderEmail?: string;
  customAmount?: string;
  deliveryDate?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export function validateGiftCardForm(form: GiftCardFormData): FormErrors {
  const errors: FormErrors = {};

  if (!form.recipientName.trim()) {
    errors.recipientName = "Please enter the recipient's name.";
  }

  if (form.format === "digital") {
    if (!form.recipientEmail.trim()) {
      errors.recipientEmail = "Recipient email is required for digital delivery.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.recipientEmail)) {
      errors.recipientEmail = "Please enter a valid email address.";
    }
  }

  if (!form.senderName.trim()) {
    errors.senderName = "Please enter your name.";
  }

  if (form.senderEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.senderEmail)) {
    errors.senderEmail = "Please enter a valid email address.";
  }

  if (form.isCustom) {
    const num = parseFloat(form.customAmount);
    if (isNaN(num) || num < 10) {
      errors.customAmount = "Minimum custom amount is $10.00.";
    } else if (num > 1000) {
      errors.customAmount = "Maximum amount per gift card is $1,000.00.";
    }
  }

  if (form.deliveryTiming === "scheduled" && !form.deliveryDate) {
    errors.deliveryDate = "Please choose a scheduled delivery date.";
  }

  if (form.format === "physical") {
    if (!form.deliveryAddress.street.trim()) {
      errors.street = "Street address is required for postal delivery.";
    }
    if (!form.deliveryAddress.city.trim()) {
      errors.city = "City is required.";
    }
    if (!form.deliveryAddress.state.trim()) {
      errors.state = "State is required.";
    }
    if (!form.deliveryAddress.zip.trim()) {
      errors.zip = "Postal/ZIP code is required.";
    }
  }

  return errors;
}

export const KNOWN_BALANCE_CODES: Record<string, GiftCardBalanceResult> = {
  "STEM-GOLD-2026": {
    code: "STEM-GOLD-2026",
    valid: true,
    balance: 75.0,
    currency: "USD",
    expiresAt: null,
    lastUsedAt: "2026-08-14",
    format: "digital",
  },
  "STEM-ROSE-8819": {
    code: "STEM-ROSE-8819",
    valid: true,
    balance: 120.0,
    currency: "USD",
    expiresAt: null,
    lastUsedAt: "2026-07-22",
    format: "physical",
  },
  "STEM-LEAF-4512": {
    code: "STEM-LEAF-4512",
    valid: true,
    balance: 25.0,
    currency: "USD",
    expiresAt: null,
    lastUsedAt: "2026-09-01",
    format: "digital",
  },
};

export async function checkGiftCardBalance(
  code: string,
  _pin?: string
): Promise<GiftCardBalanceResult> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const cleanCode = code.trim().toUpperCase();

  if (KNOWN_BALANCE_CODES[cleanCode]) {
    return KNOWN_BALANCE_CODES[cleanCode];
  }

  if (/^STEM-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(cleanCode)) {
    let hash = 0;
    for (let i = 0; i < cleanCode.length; i++) {
      hash = (hash << 5) - hash + cleanCode.charCodeAt(i);
      hash |= 0;
    }
    const pseudoBalance = 15 + (Math.abs(hash) % 185);
    return {
      code: cleanCode,
      valid: true,
      balance: pseudoBalance,
      currency: "USD",
      expiresAt: null,
      format: cleanCode.includes("PHY") ? "physical" : "digital",
    };
  }

  throw new Error(
    "Card number not recognized. Check the 14-character voucher code (e.g. STEM-XXXX-XXXX)."
  );
}
