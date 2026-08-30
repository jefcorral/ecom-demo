"use client";

import { useState } from "react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCart } from "@/app/providers";
import { ImageIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { LowStockBadge } from "./low-stock-badge";
import { QuantityStepper } from "./quantity-stepper";
import { showSuccessToast, showErrorToast } from "@/lib/toast-helper";
import { useRouter } from "next/navigation";

export function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [imgLoading, setImgLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  const isOutOfStock = product.stock === 0;

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted flex items-center justify-center">
        {product.imageUrl && !imgError ? (
          <>
            {imgLoading && <Skeleton className="absolute inset-0 h-full w-full" />}
            <Image
              src={product.imageUrl}
              alt={product.name}
              className={`h-full w-full object-cover transition-opacity duration-300 ${
                imgLoading ? "opacity-0" : "opacity-100"
              }`}
              onLoad={() => setImgLoading(false)}
              onError={() => {
                setImgLoading(false);
                setImgError(true);
              }}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground gap-2 p-4">
            <ImageIcon className="h-16 w-16 stroke-[1.5]" />
            <span className="text-sm font-medium">No image available</span>
          </div>
        )}
      </div>
      <div className="flex flex-col justify-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <span>{product.name}</span>
          {isOutOfStock && <span className="sr-only">, Out of Stock</span>}
          {product.stock > 0 && product.stock <= (product.lowStockThreshold ?? 5) && (
            <span className="sr-only">, only {product.stock} left</span>
          )}
        </h1>
        <p className="mt-2 text-xl font-semibold">${Number(product.price).toFixed(2)}</p>
        <div className="mt-2">
          <LowStockBadge stock={product.stock} lowStockThreshold={product.lowStockThreshold} />
        </div>
        <p className="mt-4 text-muted-foreground">{product.description ?? "No description available."}</p>
        <div className="mt-6 space-y-4">
          <div>
            <Label htmlFor="qty" className="block mb-2 font-medium text-sm">
              Quantity
            </Label>
            <QuantityStepper
              value={quantity}
              max={product.stock}
              onChange={setQuantity}
              disabled={isOutOfStock}
            />
          </div>
          <div>
            <Label htmlFor="note">Note</Label>
            <textarea
              id="note"
              placeholder="Add a note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-1 block w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px]"
            />
          </div>
          <Button
            size="lg"
            disabled={isOutOfStock}
            aria-disabled={isOutOfStock ? "true" : "false"}
            onClick={async () => {
              try {
                await addItem(product.id, quantity, note);
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
          >
            {isOutOfStock ? "Out of stock" : "Add to cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}

