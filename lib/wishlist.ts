import { fetchApi, isAuthenticated } from "@/lib/api";
import { Product, WishlistItem, WishlistResponse } from "@/types";

const GUEST_WISHLIST_KEY = "ecom_guest_wishlist";

export function getGuestWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(GUEST_WISHLIST_KEY);
    return raw ? (JSON.parse(raw) as WishlistItem[]) : [];
  } catch {
    return [];
  }
}

export function setGuestWishlist(items: WishlistItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage quota issues
  }
}

export function clearGuestWishlist(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(GUEST_WISHLIST_KEY);
}

export function addGuestWishlistItem(product: Product): WishlistItem[] {
  const current = getGuestWishlist();
  if (current.some((item) => item.productId === product.id)) {
    return current;
  }
  const newItem: WishlistItem = {
    id: `guest-${product.id}`,
    productId: product.id,
    product,
    createdAt: new Date().toISOString(),
  };
  const updated = [newItem, ...current];
  setGuestWishlist(updated);
  return updated;
}

export function removeGuestWishlistItem(productId: string): WishlistItem[] {
  const current = getGuestWishlist();
  const updated = current.filter((item) => item.productId !== productId);
  setGuestWishlist(updated);
  return updated;
}

export async function fetchWishlistApi(): Promise<WishlistItem[]> {
  const res = await fetchApi("/wishlist");
  if (!res.ok) {
    throw new Error("Failed to fetch wishlist");
  }
  const data = (await res.json()) as WishlistResponse;
  return data.data;
}

export async function addWishlistItemApi(productId: string): Promise<WishlistItem> {
  const res = await fetchApi("/wishlist/items", {
    method: "POST",
    body: JSON.stringify({ productId }),
  });
  if (res.status === 409) {
    throw new Error("Product is already in your wishlist");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Failed to add to wishlist" }));
    throw new Error(err.message ?? "Failed to add to wishlist");
  }
  return (await res.json()) as WishlistItem;
}

export async function removeWishlistItemApi(productId: string): Promise<void> {
  const res = await fetchApi(`/wishlist/items/${productId}`, {
    method: "DELETE",
  });
  if (!res.ok && res.status !== 404) {
    throw new Error("Failed to remove item from wishlist");
  }
}

export async function mergeGuestWishlist(): Promise<void> {
  if (!isAuthenticated()) return;
  const guestItems = getGuestWishlist();
  if (guestItems.length === 0) return;

  for (const item of guestItems) {
    try {
      await addWishlistItemApi(item.productId);
    } catch {
      // Ignore 409 conflicts or individual item failures during merge
    }
  }

  clearGuestWishlist();
}
