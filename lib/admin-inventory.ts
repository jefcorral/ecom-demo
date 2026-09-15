import { fetchApi } from "@/lib/api";

export type InventoryStatus = "healthy" | "low" | "critical" | "out" | "in_transit";

export type InventoryType = "Plant" | "Vessel" | "Dried" | "Bundle" | "Arrangement";

export interface InventoryItem {
  id: string;
  productId: string;
  name: string;
  sku: string;
  type: InventoryType;
  category: string;
  stock: number;
  threshold: number;
  status: InventoryStatus;
  supplier: string;
  image: string;
  price: number;
  isBundle: boolean;
  committed?: number;
}

export interface InventoryAdjustment {
  id: string;
  itemId: string;
  productName: string;
  sku: string;
  previousStock: number;
  newStock: number;
  delta: number;
  reason: string;
  author: string;
  timestamp: string;
  note?: string;
}

export interface SeasonalItem {
  id: string;
  name: string;
  status: "in_season" | "approaching" | "out_of_season";
  progress: number;
  timeline: string;
}

export interface InventoryActivity {
  id: string;
  type: "adjustment" | "shipment" | "audit" | "alert";
  title: string;
  description: string;
  timestamp: string;
  delta?: number;
  orderRef?: string;
  supplier?: string;
}

export interface InventoryMetrics {
  totalSkus: number;
  healthy: number;
  low: number;
  out: number;
  inTransit: number;
  totalValue: number;
}

export interface InventoryData {
  items: InventoryItem[];
  metrics: InventoryMetrics;
  adjustments: InventoryAdjustment[];
  seasonal: SeasonalItem[];
  activity: InventoryActivity[];
  total: number;
  limit: number;
  page: number;
}

export interface ImportError {
  row: number;
  issue: string;
  value: string;
}

export interface ImportResult {
  success: boolean;
  filename: string;
  size: string;
  uploadedAt: string;
  errors?: ImportError[];
  totalErrors?: number;
}

export const adjustmentReasons = [
  "Received shipment",
  "Inventory count",
  "Damaged stock",
  "Order fulfillment",
  "Return to stock",
  "Found extra units",
  "Seasonal adjustment",
  "Other",
];

export async function fetchAdminInventory(): Promise<InventoryData> {
  const res = await fetchApi("/admin/inventory");
  if (!res.ok) throw new Error("Failed to load inventory");
  return (await res.json()) as InventoryData;
}

export async function adjustAdminInventoryItem(
  itemId: string,
  delta: number,
  reason: string
): Promise<InventoryAdjustment> {
  const res = await fetchApi(`/admin/inventory/${itemId}/adjust`, {
    method: "PATCH",
    body: JSON.stringify({ delta, reason }),
  });
  if (!res.ok) throw new Error("Adjustment failed");
  return (await res.json()) as InventoryAdjustment;
}

export async function bulkAdjustAdminInventory(
  itemIds: string[],
  delta: number,
  reason: string
): Promise<void> {
  const res = await fetchApi("/admin/inventory/bulk-adjust", {
    method: "POST",
    body: JSON.stringify({
      reason,
      items: itemIds.map((itemId) => ({ itemId, delta })),
    }),
  });
  if (!res.ok) throw new Error("Bulk adjustment failed");
}

export async function importAdminInventoryCSV(file: File): Promise<ImportResult> {
  const csv = await file.text();
  const res = await fetchApi("/admin/inventory/import", {
    method: "POST",
    body: JSON.stringify({ csv }),
  });
  if (!res.ok) throw new Error("Import failed");
  return (await res.json()) as ImportResult;
}

export function exportAdminInventoryCSV(items: InventoryItem[]): string {
  const headers = ["SKU", "Product Name", "Type", "Category", "Stock", "Threshold", "Supplier", "Price"];
  const rows = items.map((i) =>
    [i.sku, `"${i.name.replace(/"/g, '""')}"`, i.type, i.category, i.stock, i.threshold, i.supplier, i.price].join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}
