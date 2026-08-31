import type { Metadata } from "next";
import OrderDetailClient from "./order-detail-client";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const shortId = id ? id.slice(0, 8) : "";
  return {
    title: `Order #${shortId}`,
    description: `Track delivery and view details for order #${id} at Bloom & Stem.`,
    openGraph: {
      title: `Order #${shortId}`,
      description: `Track delivery and view details for order #${id} at Bloom & Stem.`,
    },
  };
}

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrderDetailClient id={id} />;
}
