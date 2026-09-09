export type DiscountType = "percentage" | "fixed" | "delivery";
export type DiscountStatus = "active" | "scheduled" | "expired";
export type AppliesTo = "all" | "collections" | "products";
export type CustomerEligibility = "all" | "vip" | "new" | "specific";

export interface Discount {
  id: string;
  code: string;
  name: string;
  type: DiscountType;
  value: number;
  minPurchase?: number;
  usageLimit?: number;
  perCustomerLimit?: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  appliesTo: AppliesTo;
  appliesToNames?: string[];
  customerEligibility: CustomerEligibility;
  combinability: "none" | "all" | "except_free_delivery";
  enabled: boolean;
}

const today = new Date();
const offsetDays = (days: number) => new Date(today.getTime() + days * 86400000).toISOString().split("T")[0];

let discounts: Discount[] = [
  { id: "disc-1", code: "BLOOM15", name: "Spring Bloom 15% Off", type: "percentage", value: 15, minPurchase: 0, usageLimit: 500, perCustomerLimit: 1, usedCount: 347, startDate: offsetDays(-7), endDate: offsetDays(23), appliesTo: "all", customerEligibility: "all", combinability: "all", enabled: true },
  { id: "disc-2", code: "MOTHERSDAY", name: "Mother’s Day Tribute", type: "fixed", value: 25, minPurchase: 120, usageLimit: 200, perCustomerLimit: 1, usedCount: 0, startDate: offsetDays(10), endDate: offsetDays(17), appliesTo: "all", customerEligibility: "all", combinability: "none", enabled: true },
  { id: "disc-3", code: "FREESHIP", name: "Complimentary Delivery", type: "delivery", value: 0, minPurchase: 75, usageLimit: 1000, perCustomerLimit: 0, usedCount: 892, startDate: offsetDays(-30), endDate: offsetDays(60), appliesTo: "all", customerEligibility: "all", combinability: "except_free_delivery", enabled: true },
  { id: "disc-4", code: "VIP25", name: "VIP Atelier Access", type: "percentage", value: 25, minPurchase: 0, usageLimit: 300, perCustomerLimit: 2, usedCount: 128, startDate: offsetDays(-14), endDate: offsetDays(16), appliesTo: "all", customerEligibility: "vip", combinability: "all", enabled: true },
  { id: "disc-5", code: "WELCOME10", name: "New Customer Welcome", type: "fixed", value: 10, minPurchase: 50, usageLimit: 400, perCustomerLimit: 1, usedCount: 0, startDate: offsetDays(3), endDate: offsetDays(33), appliesTo: "all", customerEligibility: "new", combinability: "none", enabled: true },
  { id: "disc-6", code: "SPRING23", name: "Spring 2023 Launch", type: "percentage", value: 20, minPurchase: 0, usageLimit: 600, perCustomerLimit: 1, usedCount: 412, startDate: "2023-03-01", endDate: "2023-04-30", appliesTo: "collections", appliesToNames: ["Spring Edit"], customerEligibility: "all", combinability: "all", enabled: false },
];

export function getDiscountStatus(discount: Discount): DiscountStatus {
  const now = new Date();
  const start = new Date(discount.startDate);
  const end = new Date(discount.endDate);
  end.setHours(23, 59, 59, 999);
  if (now > end) return "expired";
  if (now < start) return "scheduled";
  return "active";
}

export function emptyDiscount(): Discount { return { id: "", code: "", name: "", type: "percentage", value: 0, minPurchase: 0, usageLimit: undefined, perCustomerLimit: undefined, usedCount: 0, startDate: offsetDays(1), endDate: offsetDays(31), appliesTo: "all", customerEligibility: "all", combinability: "none", enabled: true }; }

export async function fetchDiscounts(): Promise<Discount[]> { await new Promise((resolve) => setTimeout(resolve, 400)); return structuredClone(discounts); }

export async function saveDiscount(discount: Discount): Promise<Discount> {
  await new Promise((resolve) => setTimeout(resolve, 350));
  if (discount.id) { const index = discounts.findIndex((d) => d.id === discount.id); if (index >= 0) discounts[index] = { ...discount }; else discounts.push({ ...discount }); }
  else { const created = { ...discount, id: `disc-${Date.now()}` }; discounts.unshift(created); return created; }
  return structuredClone(discount);
}

export async function toggleDiscountEnabled(id: string, enabled: boolean): Promise<Discount> {
  await new Promise((resolve) => setTimeout(resolve, 250));
  const discount = discounts.find((d) => d.id === id);
  if (!discount) throw new Error("Discount not found");
  discount.enabled = enabled;
  return structuredClone(discount);
}

export async function duplicateDiscount(id: string): Promise<Discount> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const discount = discounts.find((d) => d.id === id);
  if (!discount) throw new Error("Discount not found");
  const copy: Discount = { ...discount, id: `disc-${Date.now()}`, code: `${discount.code}-COPY`, name: `${discount.name} (Copy)`, usedCount: 0 };
  discounts.unshift(copy);
  return structuredClone(copy);
}

export async function deleteDiscount(id: string): Promise<void> { await new Promise((resolve) => setTimeout(resolve, 300)); discounts = discounts.filter((d) => d.id !== id); }

export function generateDiscountCode(): string { const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; let code = "BLOOM"; for (let i = 0; i < 4; i++) code += chars.charAt(Math.floor(Math.random() * chars.length)); return code; }
