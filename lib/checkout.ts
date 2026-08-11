import { fetchApi } from "@/lib/api";
import { CheckoutResponse } from "@/types";

export async function checkout(): Promise<CheckoutResponse> {
  const res = await fetchApi("/checkout", { method: "POST" });
  if (!res.ok) {
    const err = (await res.json()) as { message?: string };
    throw new Error(err.message ?? "Checkout failed");
  }
  return (await res.json()) as CheckoutResponse;
}
