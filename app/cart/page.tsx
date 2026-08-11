"use client";

import Link from "next/link";
import { useCart } from "@/app/providers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function CartPage() {
  const { cart, loading, updateItem, removeItem, clear } = useCart();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Your Cart</h1>
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  const total = cart.items.reduce(
    (sum, item) => sum + (item.price ?? 0) * item.quantity,
    0
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Your Cart</h1>
      {cart.items.length === 0 ? (
        <p className="text-center text-muted-foreground">
          Your cart is empty. <Link href="/products" className="underline">Continue shopping</Link>
        </p>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cart.items.map((item) => (
              <div key={item.id ?? item.productId} className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-md bg-muted" />
                <div className="flex-1">
                  <p className="font-medium">{item.name ?? "Unknown product"}</p>
                  <p className="text-sm text-muted-foreground">${Number(item.price ?? 0).toFixed(2)} each</p>
                </div>
                <Input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => {
                    if (item.id) updateItem(item.id, Math.max(1, Number(e.target.value)));
                  }}
                  className="w-20"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (item.id) {
                      removeItem(item.id)
                        .then(() => toast.success("Removed"))
                        .catch(() => toast.error("Could not remove item"));
                    }
                  }}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Separator />
            <p className="text-right text-lg font-semibold">Total: ${total.toFixed(2)}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => clear().catch(() => toast.error("Could not clear cart"))}>
              Clear cart
            </Button>
            <Link href="/checkout">
              <Button>Checkout</Button>
            </Link>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
