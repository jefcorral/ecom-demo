import type { Metadata } from "next";
import OrderDetailClient from "./order-detail-client";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const shortId = id ? id.slice(0, 8) : "";
  return {
    title: `Order #${shortId}`,
    description: `View details for order #${id} on Ecom Store.`,
    openGraph: {
      title: `Order #${shortId}`,
      description: `View details for order #${id} on Ecom Store.`,
    },
  };
}

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrderDetailClient id={id} />;
}
