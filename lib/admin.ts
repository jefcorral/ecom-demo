import { mockProducts } from "./mock-data";
import type { Product } from "@/types";
import {
  LayoutDashboard,
  ShoppingBasket,
  Package,
  Warehouse,
  Users,
  Star,
  Tag,
  Mail,
  FileText,
  Truck,
  Settings,
  UserCog,
  ClipboardList,
  Plus,
  QrCode,
} from "lucide-react";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

export const adminNavGroups: { title: string; items: AdminNavItem[] }[] = [
  {
    title: "Main",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/dashboard/orders", label: "Orders", icon: ShoppingBasket },
      { href: "/dashboard/products", label: "Products", icon: Package },
      { href: "/dashboard/inventory", label: "Inventory", icon: Warehouse },
      { href: "/dashboard/customers", label: "Customers", icon: Users },
      { href: "/dashboard/reviews", label: "Reviews", icon: Star },
      { href: "/dashboard/discounts", label: "Discounts", icon: Tag },
    ],
  },
  {
    title: "Marketing",
    items: [
      { href: "/dashboard/newsletter", label: "Newsletter", icon: Mail },
      { href: "/dashboard/content", label: "Content", icon: FileText },
    ],
  },
  {
    title: "Operations",
    items: [
      { href: "/dashboard/delivery", label: "Delivery", icon: Truck },
      { href: "/dashboard/settings", label: "Settings", icon: Settings },
      { href: "/dashboard/staff", label: "Staff", icon: UserCog },
      { href: "/dashboard/audit-log", label: "Audit Log", icon: ClipboardList },
    ],
  },
];

export const adminRouteLabels: Record<string, string> =
  adminNavGroups.reduce<Record<string, string>>((acc, group) => {
    group.items.forEach((item) => {
      acc[item.href.replace(/^\/dashboard\/?/, "") || "dashboard"] = item.label;
    });
    return acc;
  }, { dashboard: "Dashboard" });

export function getAdminPageTitle(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const last = segments[segments.length - 1];
  if (!last) return "Dashboard";
  if (adminRouteLabels[last]) return adminRouteLabels[last];
  if (last.startsWith("ord-")) return "Order Details";
  if (last.startsWith("cust-")) return "Customer Details";
  return last.charAt(0).toUpperCase() + last.slice(1);
}

export const adminBottomNav: AdminNavItem[] = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingBasket },
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "/dashboard/inventory", label: "Inventory", icon: Warehouse },
  { href: "/dashboard/customers", label: "Customers", icon: Users },
];

export interface AdminSearchResult {
  products: Product[];
  orders: { id: string; customerName: string; total: number; status: string }[];
  customers: { id: string; name: string; email: string }[];
}

const mockAdminOrders = [
  { id: "ord-1024", customerName: "Eleanor James", total: 128.5, status: "paid" },
  { id: "ord-1025", customerName: "Marcus Thorne", total: 84.0, status: "processing" },
  { id: "ord-1026", customerName: "Sophia Vance", total: 245.0, status: "delivered" },
  { id: "ord-1027", customerName: "Liam Chen", total: 62.0, status: "cancelled" },
  { id: "ord-1028", customerName: "Olivia Ross", total: 315.0, status: "paid" },
];

const mockAdminCustomers = [
  { id: "cust-1", name: "Eleanor James", email: "eleanor@example.com" },
  { id: "cust-2", name: "Marcus Thorne", email: "marcus@example.com" },
  { id: "cust-3", name: "Sophia Vance", email: "sophia@example.com" },
  { id: "cust-4", name: "Liam Chen", email: "liam@example.com" },
  { id: "cust-5", name: "Olivia Ross", email: "olivia@example.com" },
];

export const adminTrendingSearches = [
  "Orchid Care Tips",
  "Wedding Bouquets",
  "Monstera Deliciosa",
  "Restock Alerts",
];

export const adminRecentCustomers = [
  { id: "cust-1", name: "Eleanor James", detail: "Ordered: Spring Peony Arrangement" },
  { id: "cust-2", name: "Marcus Thorne", detail: "Viewed: Fiddle Leaf Fig" },
  { id: "cust-3", name: "Sophia Vance", detail: "Consultation: Patio Design" },
];

export const adminQuickActions = [
  { label: "New Order", icon: Plus, href: "/dashboard/orders/new" },
  { label: "Scan Inventory", icon: QrCode, href: "/dashboard/inventory" },
];

export function searchAdmin(query: string): AdminSearchResult {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return { products: [], orders: [], customers: [] };
  }
  return {
    products: mockProducts
      .filter((product) =>
        [product.name, product.sku, product.category?.name].some(
          (value) => value?.toLowerCase().includes(normalized)
        )
      )
      .slice(0, 4),
    orders: mockAdminOrders
      .filter(
        (order) =>
          order.id.toLowerCase().includes(normalized) ||
          order.customerName.toLowerCase().includes(normalized)
      )
      .slice(0, 3),
    customers: mockAdminCustomers
      .filter(
        (customer) =>
          customer.name.toLowerCase().includes(normalized) ||
          customer.email.toLowerCase().includes(normalized)
      )
      .slice(0, 3),
  };
}
