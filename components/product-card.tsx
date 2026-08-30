"use client";

import Link from "next/link";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconButton } from "@/components/ui/icon-button";
import { Price } from "@/components/ui/price";
import { useCart } from "@/app/providers";
import { useState } from "react";
import { Heart, ImageIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
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

  const badge = isOutOfStock ? null : product.salePrice ? "sale" : product.stock <= (product.lowStockThreshold ?? 5) ? "low-stock" : product.sameDayDelivery ? "same-day" : null;

  return (
    <article className="group/card relative flex flex-col overflow-hidden rounded-[16px] bg-surface-container-lowest shadow-sm transition-shadow duration-300 active:scale-[0.98]">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square w-full overflow-hidden rounded-t-[16px] bg-surface-container-highest">
          {product.imageUrl && !imgError ? (
            <>
              {imgLoading && <Skeleton className="absolute inset-0 h-full w-full" />}
              <Image
                src={product.imageUrl}
                alt={product.name}
                className={`h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover/card:scale-105 ${
                  imgLoading ? "opacity-0" : "opacity-100"
                }`}
                onLoad={() => setImgLoading(false)}
                onError={() => {
                  setImgLoading(false);
                  setImgError(true);
                }}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                unoptimized
              />
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-on-surface-variant">
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

          {badge === "same-day" && <Badge variant="primary" className="absolute left-2 top-2 z-10 shadow-sm">Same-Day</Badge>}
          {badge === "low-stock" && <Badge variant="warning" className="absolute left-2 top-2 z-10 shadow-sm">Low Stock</Badge>}
          {badge === "sale" && <Badge variant="sale" className="absolute left-2 top-2 z-10 shadow-sm">Sale</Badge>}

          <IconButton
            variant="ghost"
            onClick={toggleWishlist}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute right-2 top-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-surface/85 text-on-surface opacity-100 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-surface-container-lowest hover:text-error md:h-8 md:w-8 md:translate-y-2 md:opacity-0 md:group-hover/card:translate-y-0 md:group-hover/card:opacity-100"
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current text-error" : ""}`} />
          </IconButton>

          {!isOutOfStock && (
            <div className="absolute inset-x-0 bottom-0 z-10 hidden justify-center bg-gradient-to-t from-black/50 to-transparent p-2 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 md:flex">
              <Button
                onClick={handleQuickAdd}
                className="w-full rounded-lg bg-surface-container-lowest/90 py-2 text-sm font-medium text-primary shadow-sm backdrop-blur-md transition-colors hover:bg-surface-container-lowest"
              >
                Quick Add
              </Button>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="truncate text-xs font-medium sm:text-sm text-on-surface transition-colors hover:text-primary">
            {product.name}
          </h3>
        </Link>
        <Price price={Number(product.price)} salePrice={product.salePrice} className="mt-1 text-sm sm:text-base" />
      </div>
    </article>
  );
}

