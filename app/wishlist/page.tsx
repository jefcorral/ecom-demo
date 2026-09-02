"use client";

import { useState } from "react";
import { useCart, useWishlist } from "@/app/providers";
import { EmptyWishlistState } from "@/components/empty-wishlist-state";
import { WishlistCard } from "@/components/wishlist-card";
import { Skeleton } from "@/components/ui/skeleton";
import { showErrorToast, showSuccessToast } from "@/lib/toast-helper";
import type { WishlistItem } from "@/types";

export default function WishlistPage() {
  const { wishlist, loading, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();
  const [fadingIds, setFadingIds] = useState<string[]>([]);
  const [movingIds, setMovingIds] = useState<string[]>([]);

  async function handleRemove(productId: string) {
    if (fadingIds.includes(productId)) return;
    setFadingIds((prev) => [...prev, productId]);
    setTimeout(async () => {
      try {
        await removeFromWishlist(productId);
        showSuccessToast("Removed from favorites");
      } catch (err) {
        showErrorToast(err instanceof Error ? err.message : "Failed to remove item");
      } finally {
        setFadingIds((prev) => prev.filter((id) => id !== productId));
      }
    }, 300);
  }

  async function handleMoveToCart(item: WishlistItem) {
    if (movingIds.includes(item.productId)) return;
    setMovingIds((prev) => [...prev, item.productId]);
    try {
      await addItem(item.productId, 1);
      setFadingIds((prev) => [...prev, item.productId]);
      setTimeout(async () => {
        await removeFromWishlist(item.productId);
        showSuccessToast(`"${item.product.name}" moved to cart`);
        setFadingIds((prev) => prev.filter((id) => id !== item.productId));
      }, 300);
    } catch (err) {
      showErrorToast(err instanceof Error ? err.message : "Failed to move to cart");
    } finally {
      setMovingIds((prev) => prev.filter((id) => id !== item.productId));
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-surface px-4 py-8 md:px-8 md:py-12">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-8 space-y-2">
            <Skeleton className="h-10 w-48 rounded-lg" />
            <Skeleton className="h-5 w-24 rounded-md" />
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 xl:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3 rounded-[16px] bg-surface-container-lowest p-3">
                <Skeleton className="aspect-square w-full rounded-[16px]" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  const activeWishlist = wishlist.filter((item) => !fadingIds.includes(item.productId));

  if (wishlist.length === 0 || activeWishlist.length === 0) {
    return <EmptyWishlistState />;
  }

  return (
    <main className="min-h-screen bg-surface px-4 py-8 md:px-8 md:py-12">
      <div className="mx-auto max-w-[1280px]">
        <header className="mb-8 flex flex-col items-start gap-1 sm:flex-row sm:items-baseline sm:gap-3">
          <h1 className="font-serif text-3xl font-semibold text-on-surface md:text-4xl">
            Your Favorites
          </h1>
          <span className="font-sans text-base text-on-surface-variant">
            ({activeWishlist.length} {activeWishlist.length === 1 ? "item" : "items"})
          </span>
        </header>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 xl:gap-6">
          {wishlist.map((item) => (
            <WishlistCard
              key={item.id}
              item={item}
              isFading={fadingIds.includes(item.productId)}
              isMoving={movingIds.includes(item.productId)}
              onRemove={handleRemove}
              onMoveToCart={handleMoveToCart}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
