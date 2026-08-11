"use client";

import { useState } from "react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/app/providers";
import { toast } from "sonner";

export function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="aspect-square rounded-lg bg-muted" />
      <div className="flex flex-col justify-center">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="mt-2 text-xl font-semibold">${Number(product.price).toFixed(2)}</p>
        <div className="mt-2">
          <Badge variant={product.stock > 0 ? "secondary" : "destructive"}>
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </Badge>
        </div>
        <p className="mt-4 text-muted-foreground">{product.description ?? "No description available."}</p>
        <div className="mt-6 space-y-4">
          <div>
            <Label htmlFor="qty">Quantity</Label>
            <Input
              id="qty"
              type="number"
              min={1}
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="mt-1 w-32"
            />
          </div>
          <div>
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              placeholder="Add a note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button
            size="lg"
            disabled={product.stock < 1}
            onClick={async () => {
              try {
                await addItem(product.id, quantity, note);
                toast.success("Added to cart");
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Could not add item");
              }
            }}
          >
            {product.stock < 1 ? "Out of stock" : "Add to cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}
