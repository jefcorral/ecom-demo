"use client";

import { useEffect, useState } from "react";
import { InventoryContent } from "@/components/admin/inventory/content";
import { InventoryError, InventorySkeleton } from "@/components/admin/inventory/states";
import { InventoryData, fetchAdminInventory } from "@/lib/admin-inventory";

export default function InventoryPage() {
  const [data, setData] = useState<InventoryData | null>(null);
  const [error, setError] = useState(false);

  const load = () => {
    setError(false);
    setData(null);
    fetchAdminInventory().then(setData).catch(() => setError(true));
  };

  useEffect(() => {
    fetchAdminInventory().then(setData).catch(() => setError(true));
  }, []);

  if (error) return <InventoryError onRetry={load} />;
  if (!data) return <InventorySkeleton />;
  return <InventoryContent data={data} />;
}
