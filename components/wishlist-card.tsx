"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ImageIcon, Loader2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import type { WishlistItem } from "@/types";

export function WishlistCard({
  item,
  isFading,
  isMoving,
  onRemove,
  onMoveToCart,
}: {
  item: WishlistItem;
  isFading: boolean;
  isMoving: boolean;
  onRemove: (productId: string) => void;
  onMoveToCart: (item: WishlistItem) => void;
}) {
  const product = item.product;
  const isOutOfStock = product.stock === 0;

  if (isFading) return null;

  return (
    <article className="group/wishlist relative flex flex-col overflow-hidden rounded-[16px] bg-surface-container-lowest p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="relative aspect-square w-full overflow-hidden rounded-[16px] bg-surface-container-highest">
        <Link href={`/products/${product.id}`} className="block h-full w-full">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/wishlist:scale-[1.03]"
              unoptimized
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-on-surface-variant">
              <ImageIcon className="h-10 w-10 stroke-[1.5]" />
              <span className="text-xs font-medium">No image</span>
            </div>
          )}
        </Link>
        <button
          type="button"
          onClick={() => onRemove(product.id)}
          aria-label={`Remove ${product.name} from wishlist`}
          className="absolute right-2 top-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-surface/85 shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95"
        >
          <Heart className="h-5 w-5 fill-primary text-primary" />
        </button>
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-inverse-surface/40 backdrop-blur-[2px]">
            <span className="rounded-full bg-surface/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-on-surface">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-3">
        <Link href={`/products/${product.id}`} className="group-hover/wishlist:text-primary">
          <h2 className="truncate text-sm font-semibold text-on-surface transition-colors">
            {product.name}
          </h2>
        </Link>
        <Price price={Number(product.price)} salePrice={product.salePrice} className="mt-1 text-sm font-medium" />

        <div className="mt-4 flex flex-col gap-2">
          <Button
            type="button"
            onClick={() => onMoveToCart(item)}
            disabled={isOutOfStock || isMoving}
            className="w-full rounded-full bg-primary text-on-primary py-2.5 text-sm font-semibold shadow-sm transition-all hover:bg-primary/90 disabled:opacity-50"
          >
            {isMoving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Moving...
              </>
            ) : isOutOfStock ? (
              "Out of Stock"
            ) : (
              <>
                <ShoppingBag className="h-4 w-4" />
                Move to Cart
              </>
            )}
          </Button>

          <button
            type="button"
            onClick={() => onRemove(product.id)}
            className="text-center text-xs text-on-surface-variant/70 transition-colors hover:text-error hover:underline py-1"
          >
            Remove
          </button>
        </div>
      </div>
    </article>
  );
}
