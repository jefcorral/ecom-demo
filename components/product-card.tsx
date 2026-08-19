"use client";

import Link from "next/link";
import { Product } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/app/providers";
import { toast } from "sonner";
import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [imgLoading, setImgLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  return (
    <Card className="flex flex-col overflow-hidden">
      <Link href={`/products/${product.id}`} className="block p-4">
        <div className="relative aspect-square w-full overflow-hidden rounded-md bg-muted flex items-center justify-center">
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
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                unoptimized
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground gap-2 p-4">
              <ImageIcon className="h-10 w-10 stroke-[1.5]" />
              <span className="text-xs font-medium">No image available</span>
            </div>
          )}
        </div>
      </Link>
      <CardContent className="flex-1 px-4 pb-2">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold leading-tight hover:underline">{product.name}</h3>
        </Link>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{product.description ?? "No description"}</p>
        <p className="mt-2 font-medium">${Number(product.price).toFixed(2)}</p>
      </CardContent>
      <CardFooter className="px-4 pb-4">
        <Button
          size="sm"
          className="w-full"
          onClick={async () => {
            try {
              await addItem(product.id, 1);
              toast.success("Added to cart");
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Could not add item");
            }
          }}
          disabled={product.stock < 1}
        >
          {product.stock < 1 ? "Out of stock" : "Add to cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}
