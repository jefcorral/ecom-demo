"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PackageOpen } from "lucide-react";
import { useAuth } from "@/app/providers";
import { fetchOrders } from "@/lib/orders";
import { Order, OrdersResponse } from "@/types";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { SkeletonPage } from "@/components/ui/skeleton-patterns";
import { toast } from "sonner";

export default function OrdersPage() {
  const { isLoggedIn, loading: authLoading } = useAuth();
  const [data, setData] = useState<OrdersResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) return;
    fetchOrders()
      .then(setData)
      .catch((err) => toast.error(err instanceof Error ? err.message : "Failed to load orders"))
      .finally(() => setLoading(false));
  }, [isLoggedIn]);

  if (authLoading || (isLoggedIn && loading)) return <SkeletonPage variant="orders" />;

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Please log in to view orders</h1>
        <Link href="/login" className={cn(buttonVariants(), "mt-4")}>
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Orders</h1>
      {data?.data.length === 0 ? (
        <EmptyState icon={PackageOpen} title="No orders yet" description="When you place an order, it will appear here." action={<Link href="/products" className={buttonVariants()}>Start Shopping</Link>} className="min-h-[55vh] py-10" />
      ) : (
        <div className="space-y-4">
          {data?.data.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Order {order.id.slice(0, 8)}</CardTitle>
          <Badge variant={order.status === "paid" ? "default" : "secondary"}>{order.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {new Date(order.createdAt).toLocaleDateString()} &middot; {order.items.length} items
          </p>
          <p className="font-semibold">${Number(order.total).toFixed(2)}</p>
        </div>
        <Link
          href={`/orders/${order.id}`}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-4")}
        >
          View details
        </Link>
      </CardContent>
    </Card>
  );
}
