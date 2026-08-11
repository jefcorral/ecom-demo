"use client";

import Link from "next/link";
import { Product } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/app/providers";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <Card className="flex flex-col overflow-hidden">
      <Link href={`/products/${product.id}`} className="block p-4">
        <div className="aspect-square rounded-md bg-muted" />
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
