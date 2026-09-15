import { fetchApi } from "@/lib/api";

export type CustomerSegment = "vip" | "active" | "recent" | "inactive" | "new";
export type CustomerStatus = "active" | "disabled";
export type Recency = "today" | "this_week" | "this_month" | "older";

export interface CustomerNote {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export interface CustomerAddress {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  isPrimary: boolean;
}

export interface CustomerOrder {
  id: string;
  date: string;
  total: number;
  items: number;
  status: string;
  productName: string;
  isSubscription?: boolean;
}

export interface CustomerPreferences {
  favoriteBlooms: string[];
  styleProfile: string;
  allergies: string[];
  colorPalette: string;
}

export interface GiftRecipient {
  id: string;
  name: string;
  relation: string;
  occasion: string;
  occasionDate: string;
  frequency: string;
}

export interface SupportTicket {
  id: string;
  type: "refund" | "support" | "exchange";
  status: "open" | "resolved" | "pending";
  date: string;
  description: string;
  amount?: number;
}

export interface SubscriptionStatus {
  status: "active" | "paused" | "none";
  plan: string;
  nextDelivery: string;
  frequency: string;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  initials: string;
  segment: CustomerSegment;
  orders: number;
  totalSpend: number;
  averageOrderValue: number;
  lastOrder: string;
  recency: Recency;
  consent: {
    email: boolean;
    sms: boolean;
  };
  status: CustomerStatus;
  notes: CustomerNote[];
  address: string;
  addresses: CustomerAddress[];
  joined: string;
  location: string;
  preferences: CustomerPreferences;
  giftRecipients: GiftRecipient[];
  orderHistory: CustomerOrder[];
  supportHistory: SupportTicket[];
  subscription: SubscriptionStatus;
  petalPoints: number;
  recentActivity: { id: string; action: string; date: string }[];
}

export interface CustomerFilters {
  segment: "all" | CustomerSegment;
  search: string;
  sort: "name" | "spend" | "orders" | "recency";
}

export async function fetchAdminCustomers(
  filters: Partial<CustomerFilters> = {}
): Promise<AdminCustomer[]> {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.segment && filters.segment !== "all") params.set("segment", filters.segment);
  if (filters.sort) params.set("sort", filters.sort);
  const query = params.toString() ? `?${params.toString()}` : "";

  const res = await fetchApi(`/admin/customers${query}`);
  if (!res.ok) throw new Error("Failed to load customers");
  return (await res.json()) as AdminCustomer[];
}

export async function fetchAdminCustomer(id: string): Promise<AdminCustomer | null> {
  const res = await fetchApi(`/admin/customers/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load customer");
  return (await res.json()) as AdminCustomer;
}

export async function disableAdminCustomer(id: string): Promise<void> {
  const res = await fetchApi(`/admin/customers/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status: "disabled" }),
  });
  if (!res.ok) throw new Error("Failed to disable customer");
}

export async function enableAdminCustomer(id: string): Promise<void> {
  const res = await fetchApi(`/admin/customers/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status: "active" }),
  });
  if (!res.ok) throw new Error("Failed to enable customer");
}

export async function addAdminCustomerNote(id: string, text: string): Promise<CustomerNote> {
  const res = await fetchApi(`/admin/customers/${id}/notes`, {
    method: "POST",
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error("Failed to add note");
  return (await res.json()) as CustomerNote;
}

export function exportAdminCustomersCSV(customers: AdminCustomer[]): string {
  const headers = ["ID", "Name", "Email", "Phone", "Segment", "Orders", "Total Spend", "Status", "Joined"];
  const rows = customers.map((c) =>
    [c.id, `"${c.name.replace(/"/g, '""')}"`, c.email, c.phone, c.segment, c.orders, c.totalSpend, c.status, c.joined].join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

export function segmentLabel(segment: CustomerSegment): string {
  const labels: Record<CustomerSegment, string> = {
    vip: "VIP",
    active: "Active",
    recent: "Recent",
    inactive: "Inactive",
    new: "New",
  };
  return labels[segment];
}

export function recencyLabel(recency: Recency): string {
  const labels: Record<Recency, string> = {
    today: "Today",
    this_week: "This week",
    this_month: "This month",
    older: "Older",
  };
  return labels[recency];
}

export function ticketTypeLabel(type: SupportTicket["type"]): string {
  const labels: Record<SupportTicket["type"], string> = { refund: "Refund", support: "Support", exchange: "Exchange" };
  return labels[type];
}

export function ticketStatusColor(status: SupportTicket["status"]): string {
  const colors: Record<SupportTicket["status"], string> = {
    open: "bg-error-container text-error",
    resolved: "bg-secondary-container text-on-secondary-container",
    pending: "bg-tertiary-container text-on-tertiary-container",
  };
  return colors[status];
}
