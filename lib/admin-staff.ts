import { fetchApi } from "@/lib/api";

export type StaffRole = "owner" | "admin" | "florist" | "fulfillment" | "support";
export type StaffStatus = "active" | "inactive";
export type StaffPermission = "orders" | "products" | "inventory" | "customers" | "marketing" | "settings" | "staff" | "audit_log";

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  title: string;
  initials: string;
  role: StaffRole;
  status: StaffStatus;
  lastActive: string;
  twoFactorEnabled: boolean;
  activity: { id: string; action: string; timestamp: string }[];
}

export interface StaffInvitation {
  id: string;
  email: string;
  role: StaffRole;
  invitedBy: string;
  sentAt: string;
  expiresAt: string;
  status: "pending" | "expired";
}

export interface RoleDefinition {
  role: StaffRole;
  label: string;
  description: string;
  permissions: StaffPermission[];
}

export interface StaffDirectory {
  staff: StaffMember[];
  invitations: StaffInvitation[];
  roles: RoleDefinition[];
}

export const permissionLabels: Record<StaffPermission, { label: string; description: string }> = {
  orders: { label: "Orders", description: "View, create, update, and fulfill customer orders." },
  products: { label: "Products", description: "Manage arrangements, pricing, and catalogue visibility." },
  inventory: { label: "Inventory", description: "Adjust stock, thresholds, and supplier information." },
  customers: { label: "Customers", description: "View profiles, notes, consent, and account status." },
  marketing: { label: "Marketing", description: "Manage campaigns, discounts, and editorial content." },
  settings: { label: "Settings", description: "Change store, payment, delivery, and security settings." },
  staff: { label: "Staff & Roles", description: "Invite staff and change access permissions." },
  audit_log: { label: "Audit Log", description: "View immutable staff and system activity." },
};

export const roleLabels: Record<StaffRole, string> = {
  owner: "Owner",
  admin: "Admin",
  florist: "Florist",
  fulfillment: "Fulfillment",
  support: "Support",
};

export async function fetchStaffDirectory(): Promise<StaffDirectory> {
  const res = await fetchApi("/admin/staff");
  if (!res.ok) throw new Error("Failed to load staff directory");
  return (await res.json()) as StaffDirectory;
}

export async function inviteStaff(email: string, role: StaffRole): Promise<StaffInvitation> {
  const res = await fetchApi("/admin/staff/invitations", {
    method: "POST",
    body: JSON.stringify({ email, role }),
  });
  if (!res.ok) throw new Error("Failed to invite staff");
  return (await res.json()) as StaffInvitation;
}

export async function updateStaffRole(id: string, role: StaffRole): Promise<void> {
  const res = await fetchApi(`/admin/staff/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
  if (!res.ok) throw new Error("Failed to update staff role");
}

export async function revokeStaffAccess(id: string): Promise<void> {
  const res = await fetchApi(`/admin/staff/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to revoke staff access");
}

export async function resendStaffInvitation(id: string): Promise<void> {
  const res = await fetchApi(`/admin/staff/invitations/${id}/resend`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to resend invitation");
}

export async function cancelStaffInvitation(id: string): Promise<void> {
  const res = await fetchApi(`/admin/staff/invitations/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to cancel invitation");
}

export async function saveRolePermissions(role: StaffRole, permissions: StaffPermission[]): Promise<void> {
  const res = await fetchApi(`/admin/roles/${role}/permissions`, {
    method: "PATCH",
    body: JSON.stringify({ permissions }),
  });
  if (!res.ok) throw new Error("Failed to update role permissions");
}
