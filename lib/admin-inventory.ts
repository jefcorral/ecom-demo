import { mockProducts } from "@/lib/mock-data";
import { Product } from "@/types";

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

const suppliers = [
  "Green Canopy Wholesale",
  "Desert Bloom Nursery",
  "Local Growers Co-op",
  "Evergreen Floral Supply",
  "Artisan Ceramics Studio",
];

const inventoryTypes: InventoryType[] = ["Plant", "Vessel", "Dried", "Bundle", "Arrangement"];

const seasonalItems: SeasonalItem[] = [
  { id: "sea-1", name: "Peonies", status: "in_season", progress: 75, timeline: "Ends in 2 weeks" },
  { id: "sea-2", name: "Dahlias", status: "approaching", progress: 30, timeline: "Starts next month" },
  { id: "sea-3", name: "Ranunculus", status: "out_of_season", progress: 0, timeline: "Returns Feb" },
  { id: "sea-4", name: "Tulips", status: "approaching", progress: 45, timeline: "Starts in 3 weeks" },
];

const activitySeed: InventoryActivity[] = [
  {
    id: "act-1",
    type: "adjustment",
    title: "Stock Adjusted",
    description: "Monstera Deliciosa increased by 12 units.",
    delta: 12,
    timestamp: "Just now",
  },
  {
    id: "act-2",
    type: "shipment",
    title: "Shipment Received",
    description: "Order #PO-8824 from Greenhouse Co. processed.",
    supplier: "Greenhouse Co.",
    timestamp: "2 hrs ago",
  },
  {
    id: "act-3",
    type: "alert",
    title: "Low Stock Alert",
    description: "Fiddle Leaf Fig dropped below threshold (15 units).",
    timestamp: "Yesterday",
  },
  {
    id: "act-4",
    type: "audit",
    title: "Monthly Audit",
    description: "Michael T. completed monthly stock audit.",
    timestamp: "Oct 24, 9:00 AM",
  },
];

const adjustmentReasons = [
  "Received shipment",
  "Inventory count",
  "Damaged stock",
  "Order fulfillment",
  "Return to stock",
  "Found extra units",
  "Seasonal adjustment",
  "Other",
];

function getInventoryType(index: number, categoryName: string): InventoryType {
  if (categoryName === "Plants") return "Plant";
  if (categoryName === "Gifts") return "Bundle";
  return inventoryTypes[index % inventoryTypes.length];
}

function getStatus(stock: number, threshold: number): InventoryStatus {
  if (stock === 0) return "out";
  if (stock <= threshold / 2) return "critical";
  if (stock <= threshold) return "low";
  return "healthy";
}

export function getInventoryItems(): InventoryItem[] {
  return mockProducts.map((product, index) => {
    const type = getInventoryType(index, product.category?.name ?? "Arrangement");
    const threshold = product.lowStockThreshold ?? 5;
    const stock = product.stock;
    return {
      id: `inv-${product.id}`,
      productId: product.id,
      name: product.name,
      sku: product.sku,
      type,
      category: product.category?.name ?? "Uncategorized",
      stock,
      threshold,
      status: getStatus(stock, threshold),
      supplier: suppliers[index % suppliers.length],
      image: product.imageUrl ?? "/product-detail/bouquet-main.png",
      price: product.price,
      isBundle: type === "Bundle",
      committed: Math.max(0, Math.floor(stock * 0.1)),
    };
  });
}

export function getInventoryMetrics(items: InventoryItem[]): InventoryMetrics {
  const totalSkus = items.length;
  const healthy = items.filter((i) => i.status === "healthy").length;
  const low = items.filter((i) => i.status === "low" || i.status === "critical").length;
  const out = items.filter((i) => i.status === "out").length;
  const inTransit = 0;
  const totalValue = items.reduce((sum, i) => sum + i.stock * i.price, 0);
  return { totalSkus, healthy, low, out, inTransit, totalValue };
}

export async function fetchAdminInventory(): Promise<InventoryData> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const items = getInventoryItems();
  return {
    items,
    metrics: getInventoryMetrics(items),
    adjustments: [],
    seasonal: seasonalItems,
    activity: activitySeed,
    total: items.length,
    limit: 24,
    page: 1,
  };
}

export async function adjustAdminInventoryItem(
  itemId: string,
  delta: number,
  reason: string
): Promise<InventoryAdjustment> {
  await new Promise((resolve) => setTimeout(resolve, 350));
  const product = mockProducts.find((p) => `inv-${p.id}` === itemId);
  if (!product) throw new Error("Item not found");
  const previousStock = product.stock;
  const newStock = Math.max(0, previousStock + delta);
  product.stock = newStock;
  product.updatedAt = new Date().toISOString();
  return {
    id: `adj-${Date.now()}`,
    itemId,
    productName: product.name,
    sku: product.sku,
    previousStock,
    newStock,
    delta,
    reason: reason || "Manual adjustment",
    author: "Admin User",
    timestamp: new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
  };
}

export async function bulkAdjustAdminInventory(
  itemIds: string[],
  delta: number,
  reason: string
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  for (const itemId of itemIds) {
    const product = mockProducts.find((p) => `inv-${p.id}` === itemId);
    if (product) {
      product.stock = Math.max(0, product.stock + delta);
      product.updatedAt = new Date().toISOString();
    }
  }
}

export async function importAdminInventoryCSV(file: File): Promise<ImportResult> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const success = Math.random() > 0.5;
  if (success) {
    return {
      success: true,
      filename: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      uploadedAt: new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
    };
  }
  return {
    success: false,
    filename: file.name,
    size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
    uploadedAt: new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
    errors: [
      { row: 42, issue: "Invalid SKU format. Expected format: CAT-XXX-YY", value: "MONSTERA_XL" },
      { row: 89, issue: "Missing required field: 'Wholesale Price'", value: "null" },
      { row: 112, issue: "Duplicate Barcode detected in system", value: "849120045" },
    ],
    totalErrors: 12,
  };
}

export function exportAdminInventoryCSV(items: InventoryItem[]): string {
  const headers = ["SKU", "Product Name", "Type", "Category", "Stock", "Threshold", "Supplier", "Price"];
  const rows = items.map((i) => [i.sku, i.name, i.type, i.category, i.stock, i.threshold, i.supplier, i.price].join(","));
  return [headers.join(","), ...rows].join("\n");
}

export { adjustmentReasons };
