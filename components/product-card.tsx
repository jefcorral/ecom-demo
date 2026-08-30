"use client";

import Link from "next/link";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { useCart } from "@/app/providers";
import { useState } from "react";
import { Heart, ImageIcon, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { LowStockBadge } from "./low-stock-badge";
import { showSuccessToast, showErrorToast } from "@/lib/toast-helper";
import { useRouter } from "next/navigation";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [imgLoading, setImgLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const isOutOfStock = product.stock === 0;

  async function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    try {
      await addItem(product.id, 1);
      showSuccessToast("Added to cart");
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Could not add item";
      if (errMsg.toLowerCase().includes("stock") || errMsg.toLowerCase().includes("insufficient")) {
        showErrorToast(errMsg, {
          actionLabel: "Adjust Cart",
          onAction: () => router.push("/cart"),
        });
      } else {
        showErrorToast(errMsg);
      }
    }
  }

  function toggleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted((prev) => !prev);
    showSuccessToast(isWishlisted ? "Removed from favorites" : "Saved to favorites");
  }

  return (
    <article className="group/card relative flex flex-col">
      <Link href={`/products/${product.id}`} className="block overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
        <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-t-2xl bg-surface-container-highest">
          {product.imageUrl && !imgError ? (
            <>
              {imgLoading && <Skeleton className="absolute inset-0 h-full w-full" />}
              <Image
                src={product.imageUrl}
                alt={product.name}
                className={`h-full w-full object-cover transition-all duration-500 group-hover/card:scale-[1.03] ${
                  imgLoading ? "opacity-0" : "opacity-100"
                }`}
                onLoad={() => setImgLoading(false)}
                onError={() => {
                  setImgLoading(false);
                  setImgError(true);
                }}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                unoptimized
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 p-4 text-on-surface-variant">
              <ImageIcon className="h-10 w-10 stroke-[1.5]" />
              <span className="text-xs font-medium">No image available</span>
            </div>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-inverse-surface/40 backdrop-blur-[2px]">
              <span className="rounded-full bg-surface/90 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-on-surface">
                Out of Stock
              </span>
            </div>
          )}

          <div className="absolute left-3 top-3 z-10">
            <LowStockBadge
              stock={product.stock}
              lowStockThreshold={product.lowStockThreshold}
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleWishlist}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-surface/80 text-on-surface backdrop-blur-sm transition-colors hover:bg-surface-container-lowest hover:text-error"
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current text-error" : ""}`} />
          </Button>

          {!isOutOfStock && (
            <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center bg-gradient-to-t from-black/50 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100">
              <Button
                onClick={handleQuickAdd}
                className="w-full rounded-lg bg-surface-container-lowest/90 text-primary shadow-sm backdrop-blur-md transition-colors hover:bg-surface-container-lowest hover:text-on-primary-container"
              >
                <Plus className="mr-1.5 h-4 w-4" />
                Quick Add
              </Button>
            </div>
          )}
        </div>
      </Link>

      <div className="px-1 pt-3">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-serif font-semibold leading-tight text-on-surface transition-colors hover:text-primary line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-sm font-medium text-on-surface">${Number(product.price).toFixed(2)}</p>
      </div>
    </article>
  );
}

