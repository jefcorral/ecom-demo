import { fetchApi } from "@/lib/api";

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

export function getDiscountStatus(discount: Discount): DiscountStatus {
  const now = new Date();
  const start = new Date(discount.startDate);
  const end = new Date(discount.endDate);
  end.setHours(23, 59, 59, 999);
  if (now > end) return "expired";
  if (now < start) return "scheduled";
  return "active";
}

export function emptyDiscount(): Discount {
  return {
    id: "",
    code: "",
    name: "",
    type: "percentage",
    value: 0,
    minPurchase: 0,
    usageLimit: undefined,
    perCustomerLimit: undefined,
    usedCount: 0,
    startDate: offsetDays(1),
    endDate: offsetDays(31),
    appliesTo: "all",
    customerEligibility: "all",
    combinability: "none",
    enabled: true,
  };
}

export async function fetchDiscounts(): Promise<Discount[]> {
  const res = await fetchApi("/discount-codes");
  if (!res.ok) throw new Error("Failed to load discounts");
  const data = (await res.json()) as { data: Discount[] };
  return data.data;
}

export async function fetchDiscount(id: string): Promise<Discount> {
  const res = await fetchApi(`/discount-codes/${id}`);
  if (!res.ok) throw new Error("Failed to load discount");
  return (await res.json()) as Discount;
}

export async function saveDiscount(discount: Discount): Promise<Discount> {
  const payload = {
    code: discount.code,
    name: discount.name,
    type: discount.type,
    value: discount.value,
    startDate: discount.startDate,
    endDate: discount.endDate,
    usageLimit: discount.usageLimit ?? null,
    perCustomerLimit: discount.perCustomerLimit ?? null,
    enabled: discount.enabled,
    minPurchase: discount.minPurchase ?? null,
    appliesTo: discount.appliesTo,
    appliesToNames: discount.appliesToNames ?? [],
    customerEligibility: discount.customerEligibility,
    combinability: discount.combinability,
  };

  if (discount.id) {
    const res = await fetchApi(`/discount-codes/${discount.id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to update discount");
    return (await res.json()) as Discount;
  }

  const res = await fetchApi("/discount-codes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create discount");
  return (await res.json()) as Discount;
}

export async function toggleDiscountEnabled(id: string, enabled: boolean): Promise<Discount> {
  const res = await fetchApi(`/discount-codes/${id}/toggle`, {
    method: "PATCH",
    body: JSON.stringify({ enabled }),
  });
  if (!res.ok) throw new Error("Failed to toggle discount");
  return (await res.json()) as Discount;
}

export async function duplicateDiscount(id: string): Promise<Discount> {
  const res = await fetchApi(`/discount-codes/${id}/duplicate`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to duplicate discount");
  return (await res.json()) as Discount;
}

export async function deleteDiscount(id: string): Promise<void> {
  const res = await fetchApi(`/discount-codes/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete discount");
}

export function generateDiscountCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "BLOOM";
  for (let i = 0; i < 4; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code;
}
