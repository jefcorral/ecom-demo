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

const events: AuditEvent[] = [
  {
    id: "evt-2480",
    timestamp: "2023-10-24T14:32:10-04:00",
    actor: { name: "Eleanor Vance", role: "Head Florist", initials: "EV", type: "staff" },
    action: "inventory_updated",
    target: { name: "Monstera Deliciosa (L)", reference: "SKU-MND-09", detail: "Quantity 12 → 8" },
    ipAddress: "192.168.1.42",
    severity: "warning",
    requestId: "req_98a72b11d8",
    userAgent: "Chrome 118.0 / macOS Sonoma",
    authentication: "Session (2FA authenticated)",
    previousState: { stock_on_hand: 12, reserved: 2 },
    committedState: { stock_on_hand: 8, reserved: 4 },
    metadata: { node: "Replication Verified (Node 3)", module: "Inventory" },
  },
  {
    id: "evt-2479",
    timestamp: "2023-10-24T13:15:02-04:00",
    actor: { name: "James Kensington", role: "Studio Manager", initials: "JK", type: "staff" },
    action: "customer_disabled",
    target: { name: "Clara Thorne", reference: "CUST-4821", detail: "Account access revoked" },
    ipAddress: "192.168.1.15",
    severity: "critical",
    requestId: "req_7e31af82ca",
    userAgent: "Safari 17.0 / macOS Sonoma",
    authentication: "Session (2FA authenticated)",
    previousState: { status: "active" },
    committedState: { status: "disabled" },
    metadata: { reason: "Customer support request", module: "Customers" },
  },
  {
    id: "evt-2478",
    timestamp: "2023-10-24T12:44:19-04:00",
    actor: { name: "System", role: "Automated Batch", initials: "SYS", type: "system" },
    action: "order_created",
    target: { name: "Custom Wedding Bouquet", reference: "ORD-2023-8942", detail: "3 items · $485.00" },
    ipAddress: "10.0.4.12",
    severity: "info",
    requestId: "req_sys_8942",
    userAgent: "Internal Worker / Node 20",
    authentication: "Service account",
    committedState: { status: "paid", total: 485 },
    metadata: { source: "Storefront checkout", module: "Orders" },
  },
  {
    id: "evt-2477",
    timestamp: "2023-10-24T11:20:45-04:00",
    actor: { name: "Sophia Rossi", role: "Lead Designer", initials: "SR", type: "staff" },
    action: "price_adjusted",
    target: { name: "Desert Terrarium Kit", reference: "PRD-882", detail: "$120 → $135" },
    ipAddress: "192.168.1.33",
    severity: "warning",
    requestId: "req_45fa91e8b2",
    userAgent: "Chrome 118.0 / Windows 11",
    authentication: "Session",
    previousState: { price: 120 },
    committedState: { price: 135 },
    metadata: { reason: "Supplier cost adjustment", module: "Products" },
  },
  {
    id: "evt-2476",
    timestamp: "2023-10-24T10:05:12-04:00",
    actor: { name: "Eleanor Vance", role: "Head Florist", initials: "EV", type: "staff" },
    action: "status_changed",
    target: { name: "Order #ORD-2023-8930", reference: "ORD-2023-8930", detail: "Processing → Designing" },
    ipAddress: "192.168.1.42",
    severity: "info",
    requestId: "req_a309bb28cd",
    userAgent: "Chrome 118.0 / macOS Sonoma",
    authentication: "Session (2FA authenticated)",
    previousState: { status: "processing" },
    committedState: { status: "designing" },
    metadata: { module: "Orders", station: "Design table 2" },
  },
  {
    id: "evt-2475",
    timestamp: "2023-10-24T09:40:55-04:00",
    actor: { name: "Marcus Sterling", role: "Security Admin", initials: "MS", type: "staff" },
    action: "api_key_revoked",
    target: { name: "Stripe Webhook Secret", reference: "whsec_live_9921••••", detail: "Key rotated manually" },
    ipAddress: "198.51.100.2",
    severity: "critical",
    requestId: "req_sec_2bb1c4",
    userAgent: "Firefox 119.0 / Linux",
    authentication: "Hardware security key",
    previousState: { active: true },
    committedState: { active: false },
    metadata: { reason: "Scheduled rotation", module: "Security" },
  },
  {
    id: "evt-2474",
    timestamp: "2023-10-24T08:30:14-04:00",
    actor: { name: "System", role: "Backup Worker", initials: "SYS", type: "system" },
    action: "backup_completed",
    target: { name: "Daily Database Snapshot", reference: "5.4 GB", detail: "Encrypted AES-256" },
    ipAddress: "10.0.1.5",
    severity: "info",
    requestId: "req_backup_1024",
    userAgent: "Internal Worker / Node 20",
    authentication: "Service account",
    committedState: { verified: true, encrypted: true },
    metadata: { storage: "us-east-1", module: "System" },
  },
  {
    id: "evt-2473",
    timestamp: "2023-10-23T18:12:00-04:00",
    actor: { name: "Liam Chen", role: "Fulfillment Staff", initials: "LC", type: "staff" },
    action: "courier_assigned",
    target: { name: "Order #ORD-2023-8924", reference: "UX-99120", detail: "Urban Express" },
    ipAddress: "192.168.1.51",
    severity: "info",
    requestId: "req_courier_8924",
    userAgent: "Chrome 118.0 / Android",
    authentication: "Session",
    metadata: { courier: "Urban Express", module: "Delivery" },
  },
  {
    id: "evt-2472",
    timestamp: "2023-10-23T16:55:22-04:00",
    actor: { name: "James Kensington", role: "Studio Manager", initials: "JK", type: "staff" },
    action: "role_changed",
    target: { name: "Liam Chen", reference: "STAFF-113", detail: "Granted full inventory access" },
    ipAddress: "192.168.1.15",
    severity: "warning",
    requestId: "req_role_113",
    userAgent: "Safari 17.0 / macOS Sonoma",
    authentication: "Session (2FA authenticated)",
    previousState: { role: "fulfillment" },
    committedState: { role: "fulfillment_inventory" },
    metadata: { approved_by: "Owner", module: "Staff" },
  },
  {
    id: "evt-2471",
    timestamp: "2023-10-23T15:10:08-04:00",
    actor: { name: "Sophia Rossi", role: "Lead Designer", initials: "SR", type: "staff" },
    action: "sku_created",
    target: { name: "Autumn Harvest Wreath", reference: "SKU-AHW-01" },
    ipAddress: "192.168.1.33",
    severity: "info",
    requestId: "req_sku_ahw01",
    userAgent: "Chrome 118.0 / Windows 11",
    authentication: "Session",
    committedState: { active: true, stock: 0 },
    metadata: { collection: "Autumn 2023", module: "Products" },
  },
  {
    id: "evt-2470",
    timestamp: "2023-10-23T14:02:40-04:00",
    actor: { name: "Eleanor Vance", role: "Head Florist", initials: "EV", type: "staff" },
    action: "stock_restocked",
    target: { name: "Dutch Garden Peonies", reference: "SKU-DGP-04", detail: "+50 units · Lot #884" },
    ipAddress: "192.168.1.42",
    severity: "info",
    requestId: "req_stock_884",
    userAgent: "Chrome 118.0 / macOS Sonoma",
    authentication: "Session (2FA authenticated)",
    previousState: { stock: 6 },
    committedState: { stock: 56 },
    metadata: { supplier: "Holland Direct", module: "Inventory" },
  },
];

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

export async function fetchAuditEvents(): Promise<AuditEvent[]> {
  await new Promise((resolve) => setTimeout(resolve, 450));
  return events;
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
