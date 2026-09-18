import { fetchApi, getSessionId } from "@/lib/api";
import { USE_MOCK_DATA } from "@/lib/env";
import { mockProducts } from "@/lib/mock-data";
import { Cart, CartItem } from "@/types";

const MOCK_CART_KEY = "bloom_demo_cart";

function getCartQuery(): string {
  const params = new URLSearchParams();
  const sessionId = getSessionId();
  if (sessionId) params.set("sessionId", sessionId);
  return params.toString() ? `?${params.toString()}` : "";
}

function getMockCart(): Cart {
  if (typeof window === "undefined") return { items: [] };
  try {
    const cart = JSON.parse(localStorage.getItem(MOCK_CART_KEY) ?? "") as Cart;
    return Array.isArray(cart.items) ? cart : { items: [] };
  } catch {
    return { items: [] };
  }
}

function setMockCart(cart: Cart): void {
  if (typeof window !== "undefined") localStorage.setItem(MOCK_CART_KEY, JSON.stringify(cart));
}

export async function fetchCart(): Promise<Cart> {
  if (USE_MOCK_DATA) return getMockCart();
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
  if (USE_MOCK_DATA) {
    const cart = getMockCart();
    const existing = cart.items.find((item) => item.productId === input.productId);
    if (existing) {
      existing.quantity += input.quantity;
      existing.note = input.note ?? existing.note;
    } else {
      const product = mockProducts.find((item) => item.id === input.productId);
      if (!product) throw new Error("Product not found");
      cart.items.push({
        id: `cart-${input.productId}`,
        productId: input.productId,
        name: product.name,
        price: product.salePrice ?? product.price,
        quantity: input.quantity,
        note: input.note,
      });
    }
    setMockCart(cart);
    return;
  }
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
  if (USE_MOCK_DATA) {
    const cart = getMockCart();
    const item = cart.items.find((entry) => entry.id === id);
    if (!item) throw new Error("Cart item not found");
    if (input.quantity !== undefined) item.quantity = input.quantity;
    if (input.note !== undefined) item.note = input.note;
    setMockCart(cart);
    return item;
  }
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
  if (USE_MOCK_DATA) {
    setMockCart({ items: getMockCart().items.filter((item) => item.id !== id) });
    return;
  }
  const res = await fetchApi(`/cart/items/${id}${getCartQuery()}`, { method: "DELETE" });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(err.message ?? "Failed to remove item");
  }
}

export async function clearCart(): Promise<void> {
  if (USE_MOCK_DATA) {
    setMockCart({ items: [] });
    return;
  }
  const res = await fetchApi(`/cart${getCartQuery()}`, { method: "DELETE" });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(err.message ?? "Failed to clear cart");
  }
}
