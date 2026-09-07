"use client";

import { useEffect, useState } from "react";
import { DeliveryContent } from "@/components/admin/delivery/content";
import { DeliveryError, DeliverySkeleton } from "@/components/admin/delivery/states";
import { DeliverySettingsData, fetchDeliverySettings } from "@/lib/admin-delivery";

export default function DeliveryPage() {
  const [data, setData] = useState<DeliverySettingsData | null>(null);
  const [error, setError] = useState(false);

  const load = () => {
    setData(null);
    setError(false);
    fetchDeliverySettings().then(setData).catch(() => setError(true));
  };

  useEffect(() => {
    fetchDeliverySettings().then(setData).catch(() => setError(true));
  }, []);

  if (error) return <DeliveryError onRetry={load} />;
  if (!data) return <DeliverySkeleton />;
  return <DeliveryContent initialData={data} />;
}
