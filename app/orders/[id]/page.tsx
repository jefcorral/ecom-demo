"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";
import { fetchOrder } from "@/lib/orders";
import { Order } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoggedIn, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const id = params.id as string;

  useEffect(() => {
    if (!isLoggedIn || !id) return;
    fetchOrder(id)
      .then(setOrder)
      .catch((err) => toast.error(err instanceof Error ? err.message : "Failed to load order"))
      .finally(() => setLoading(false));
  }, [isLoggedIn, id]);

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Please log in to view this order</h1>
        <Button className="mt-4" onClick={() => router.push("/login")}>
          Log in
        </Button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">Order not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Order {order.id.slice(0, 8)}</h1>
      <div className="flex items-center gap-2">
        <Badge variant={order.status === "paid" ? "default" : "secondary"}>{order.status}</Badge>
        <span className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">${Number(item.unitPrice * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${Number(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>${Number(order.tax).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>${Number(order.shipping).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${Number(order.total).toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
