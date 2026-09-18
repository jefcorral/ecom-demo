export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
export const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" || !process.env.NEXT_PUBLIC_API_URL;
export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
