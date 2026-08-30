"use client";

import Link from "next/link";
import { Product } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/app/providers";
import { useState } from "react";
import { ImageIcon } from "lucide-react";
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

  const isOutOfStock = product.stock === 0;

  return (
    <Card className="group/card relative flex flex-col overflow-hidden rounded-2xl border-outline-variant/30 bg-surface-container-lowest shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="absolute right-3 top-3 z-10">
        <LowStockBadge
          stock={product.stock}
          lowStockThreshold={product.lowStockThreshold}
        />
      </div>
      <Link href={`/products/${product.id}`} className="block p-3">
        <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-surface-container-highest">
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
        </div>
      </Link>
      <CardContent className="flex-1 px-4 pb-2">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-serif font-semibold leading-tight text-on-surface transition-colors hover:text-primary line-clamp-1">
            {product.name}
            {isOutOfStock && <span className="sr-only">, Out of Stock</span>}
            {product.stock > 0 && product.stock <= (product.lowStockThreshold ?? 5) && (
              <span className="sr-only">, only {product.stock} left</span>
            )}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-sm text-on-surface-variant">{product.description ?? "No description"}</p>
        <p className="mt-2 font-medium text-on-surface">${Number(product.price).toFixed(2)}</p>
      </CardContent>
      <CardFooter className="px-4 pb-4">
        <Button
          size="sm"
          className="w-full rounded-full bg-primary text-on-primary hover:bg-primary/90 active:scale-[0.98]"
          onClick={async () => {
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
          }}
          disabled={isOutOfStock}
          aria-disabled={isOutOfStock ? "true" : "false"}
        >
          {isOutOfStock ? "Out of stock" : "Add to cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}

