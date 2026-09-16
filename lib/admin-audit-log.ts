import { fetchApi } from "@/lib/api";

export type AuditAction =
  | "inventory_updated"
  | "customer_disabled"
  | "order_created"
  | "price_adjusted"
  | "status_changed"
  | "api_key_revoked"
  | "backup_completed"
  | "courier_assigned"
  | "role_changed"
  | "sku_created"
  | "stock_restocked";

export type AuditSeverity = "info" | "warning" | "critical";
export type AuditActorType = "staff" | "system";

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: {
    name: string;
    role: string;
    initials: string;
    type: AuditActorType;
  };
  action: AuditAction;
  target: {
    name: string;
    reference: string;
    detail?: string;
  };
  ipAddress: string;
  severity: AuditSeverity;
  requestId: string;
  userAgent: string;
  authentication: string;
  previousState?: Record<string, string | number | boolean>;
  committedState?: Record<string, string | number | boolean>;
  metadata: Record<string, string>;
}

export const auditActionLabels: Record<AuditAction, string> = {
  inventory_updated: "Inventory Updated",
  customer_disabled: "Customer Disabled",
  order_created: "Order Created",
  price_adjusted: "Price Adjusted",
  status_changed: "Status Changed",
  api_key_revoked: "API Key Revoked",
  backup_completed: "Backup Completed",
  courier_assigned: "Courier Assigned",
  role_changed: "Role Changed",
  sku_created: "SKU Created",
  stock_restocked: "Stock Restocked",
};

export async function fetchAuditEvents(params: { page?: number; limit?: number } = {}): Promise<AuditEvent[]> {
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  const res = await fetchApi(`/admin/audit-logs?${search.toString()}`);
  if (!res.ok) throw new Error("Failed to load audit events");
  const data = (await res.json()) as { data: AuditEvent[]; pagination: { total: number } };
  return data.data;
}

export async function exportAuditEventsFromApi(): Promise<string> {
  const res = await fetchApi("/admin/audit-logs/export");
  if (!res.ok) throw new Error("Failed to export audit events");
  return res.text();
}

export function exportAuditEvents(eventsToExport: AuditEvent[]): string {
  const quote = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
  const rows = eventsToExport.map((event) =>
    [event.timestamp, event.actor.name, event.actor.role, auditActionLabels[event.action], event.target.name, event.target.reference, event.ipAddress, event.requestId]
      .map(quote)
      .join(",")
  );
  return ["Timestamp,Actor,Role,Action,Target,Reference,IP Address,Request ID", ...rows].join("\n");
}
