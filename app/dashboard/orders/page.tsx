"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAdminOrders, AdminOrdersData } from "@/lib/admin-orders";
import { OrdersSkeleton } from "@/components/admin/orders/skeleton";
import { OrdersEmpty } from "@/components/admin/orders/empty";
import { OrdersContent } from "@/components/admin/orders/content";

export default function OrdersPage() {
  const router = useRouter();
  const [data, setData] = useState<AdminOrdersData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminOrders()
      .then((orders) => setData(orders))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <OrdersSkeleton />;
  if (!data || data.total === 0) return <OrdersEmpty onCreate={() => router.push("/dashboard/orders/new")} />;
  return <OrdersContent data={data} />;
}
