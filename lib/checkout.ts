import { fetchApi } from "@/lib/api";
import { Address, CheckoutResponse } from "@/types";

export interface CheckoutInput {
  shippingAddressId?: string;
  billingAddressId?: string;
  paymentMethodId?: string;
  shippingAddress?: Address;
  billingAddress?: Address;
  requestedDeliveryDate?: string;
  requestedDeliverySlot?: string;
  discountCode?: string;
}

export async function checkout(input: CheckoutInput): Promise<CheckoutResponse> {
  const res = await fetchApi("/checkout", {
    method: "POST",
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = (await res.json()) as { message?: string };
    throw new Error(err.message ?? "Checkout failed");
  }
  return (await res.json()) as CheckoutResponse;
}
