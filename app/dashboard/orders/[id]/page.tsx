import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchAdminOrderById } from "@/lib/admin-orders";
import { OrderDetailContent } from "@/components/admin/order-detail/content";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Order #${id.toUpperCase()}`,
  };
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await fetchAdminOrderById(id);
  if (!order) notFound();
  return <OrderDetailContent order={order} />;
}
