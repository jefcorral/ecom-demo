import { fetchApi, getSessionId } from "@/lib/api";
import { Cart, CartItem } from "@/types";

function getCartQuery(): string {
  const params = new URLSearchParams();
  const sessionId = getSessionId();
  if (sessionId) params.set("sessionId", sessionId);
  return params.toString() ? `?${params.toString()}` : "";
}

export async function fetchCart(): Promise<Cart> {
  const res = await fetchApi(`/cart${getCartQuery()}`);
  if (!res.ok) throw new Error("Failed to load cart");
  return (await res.json()) as Cart;
}

export interface AddToCartInput {
  productId: string;
  quantity: number;
  note?: string;
}

export async function addToCart(input: AddToCartInput): Promise<void> {
  const res = await fetchApi(`/cart/items${getCartQuery()}`, {
    method: "POST",
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = (await res.json()) as { message?: string };
    throw new Error(err.message ?? "Failed to add item");
  }
}

export interface UpdateCartItemInput {
  quantity?: number;
  note?: string;
}

export async function updateCartItem(
  id: string,
  input: UpdateCartItemInput
): Promise<CartItem> {
  const res = await fetchApi(`/cart/items/${id}${getCartQuery()}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(err.message ?? "Failed to update item");
  }
  return (await res.json()) as CartItem;
}

export async function removeCartItem(id: string): Promise<void> {
  const res = await fetchApi(`/cart/items/${id}${getCartQuery()}`, { method: "DELETE" });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(err.message ?? "Failed to remove item");
  }
}

export async function clearCart(): Promise<void> {
  const res = await fetchApi(`/cart${getCartQuery()}`, { method: "DELETE" });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(err.message ?? "Failed to clear cart");
  }
}
