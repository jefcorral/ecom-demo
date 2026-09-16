import { fetchApi } from "@/lib/api";
import type { SavedPaymentMethod } from "@/types";

export interface PaymentMethodInput {
  gateway: string;
  gatewayToken: string;
  label?: string;
  last4?: string;
  brand?: string;
  expMonth?: number;
  expYear?: number;
  isDefault?: boolean;
}

export async function fetchPaymentMethods(): Promise<SavedPaymentMethod[]> {
  const res = await fetchApi("/payment-methods");
  if (!res.ok) throw new Error("Failed to load payment methods");
  const data = (await res.json()) as { data: SavedPaymentMethod[] };
  return data.data;
}

export async function createPaymentMethod(input: PaymentMethodInput): Promise<SavedPaymentMethod> {
  const res = await fetchApi("/payment-methods", {
    method: "POST",
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(err.message ?? "Failed to save payment method");
  }
  return (await res.json()) as SavedPaymentMethod;
}

export async function updatePaymentMethod(id: string, input: Partial<PaymentMethodInput>): Promise<SavedPaymentMethod> {
  const res = await fetchApi(`/payment-methods/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(err.message ?? "Failed to update payment method");
  }
  return (await res.json()) as SavedPaymentMethod;
}

export async function deletePaymentMethod(id: string): Promise<void> {
  const res = await fetchApi(`/payment-methods/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(err.message ?? "Failed to delete payment method");
  }
}
