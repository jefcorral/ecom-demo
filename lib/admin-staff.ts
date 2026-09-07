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

const allPermissions = Object.keys(permissionLabels) as StaffPermission[];

const roles: RoleDefinition[] = [
  { role: "owner", label: "Owner", description: "Full sovereign access to store operations and governance.", permissions: allPermissions },
  { role: "admin", label: "Admin", description: "Manage store operations, catalogue, staff, and reporting.", permissions: allPermissions },
  { role: "florist", label: "Florist", description: "Create arrangements and manage products and inventory.", permissions: ["orders", "products", "inventory", "customers"] },
  { role: "fulfillment", label: "Fulfillment", description: "Prepare orders, adjust stock, and coordinate delivery.", permissions: ["orders", "inventory", "customers"] },
  { role: "support", label: "Support", description: "Assist customers and resolve order questions.", permissions: ["orders", "customers"] },
];

const staff: StaffMember[] = [
  { id: "staff-001", name: "Eleanor Vance", email: "eleanor@bloomstem.com", title: "Primary Stakeholder", initials: "EV", role: "owner", status: "active", lastActive: "4 mins ago", twoFactorEnabled: true, activity: [{ id: "a1", action: "Updated White Peony stock", timestamp: "4 mins ago" }, { id: "a2", action: "Approved supplier order #219", timestamp: "Yesterday" }] },
  { id: "staff-002", name: "Marcus Thorne", email: "marcus@bloomstem.com", title: "Operations Director", initials: "MT", role: "admin", status: "active", lastActive: "22 mins ago", twoFactorEnabled: true, activity: [{ id: "a3", action: "Invited Maya Lin", timestamp: "22 mins ago" }, { id: "a4", action: "Exported audit log", timestamp: "2 days ago" }] },
  { id: "staff-003", name: "Clara Thorne", email: "clara.t@bloomstem.com", title: "Senior Arranger", initials: "CT", role: "florist", status: "active", lastActive: "2 hours ago", twoFactorEnabled: true, activity: [{ id: "a5", action: "Published Autumn Harvest Wreath", timestamp: "2 hours ago" }] },
  { id: "staff-004", name: "Sophia Rossi", email: "s.rossi@bloomstem.com", title: "Botanical Stylist", initials: "SR", role: "florist", status: "active", lastActive: "Yesterday", twoFactorEnabled: true, activity: [{ id: "a6", action: "Adjusted Desert Terrarium pricing", timestamp: "Yesterday" }] },
  { id: "staff-005", name: "Liam Chen", email: "liam.c@bloomstem.com", title: "Cold Chain Specialist", initials: "LC", role: "fulfillment", status: "active", lastActive: "3 hours ago", twoFactorEnabled: true, activity: [{ id: "a7", action: "Assigned courier to order #8924", timestamp: "3 hours ago" }] },
  { id: "staff-006", name: "James Kensington", email: "j.kensington@bloomstem.com", title: "Guest Concierge", initials: "JK", role: "support", status: "inactive", lastActive: "14 days ago", twoFactorEnabled: true, activity: [{ id: "a8", action: "Resolved customer request #4821", timestamp: "14 days ago" }] },
  { id: "staff-007", name: "Maya Lin", email: "maya@bloomstem.com", title: "VIP Client Liaison", initials: "ML", role: "support", status: "active", lastActive: "5 hours ago", twoFactorEnabled: true, activity: [{ id: "a9", action: "Added note to VIP customer profile", timestamp: "5 hours ago" }] },
];

const invitations: StaffInvitation[] = [
  { id: "invite-001", email: "amelia@bloomstem.com", role: "florist", invitedBy: "Marcus Thorne", sentAt: "Sep 5, 2026", expiresAt: "Sep 7, 2026", status: "pending" },
  { id: "invite-002", email: "noah@bloomstem.com", role: "fulfillment", invitedBy: "Eleanor Vance", sentAt: "Sep 4, 2026", expiresAt: "Sep 6, 2026", status: "expired" },
];

export async function fetchStaffDirectory(): Promise<StaffDirectory> {
  await new Promise((resolve) => setTimeout(resolve, 450));
  return { staff, invitations, roles };
}

export async function inviteStaff(email: string, role: StaffRole): Promise<StaffInvitation> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const invitation: StaffInvitation = { id: `invite-${Date.now()}`, email, role, invitedBy: "Eleanor Vance", sentAt: "Today", expiresAt: "In 48 hours", status: "pending" };
  invitations.unshift(invitation);
  return invitation;
}

export async function updateStaffRole(id: string, role: StaffRole): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const member = staff.find((item) => item.id === id);
  if (member && member.role !== "owner") member.role = role;
}

export async function revokeStaffAccess(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 350));
  const index = staff.findIndex((item) => item.id === id);
  if (index >= 0 && staff[index].role !== "owner") staff.splice(index, 1);
}

export async function resendStaffInvitation(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const invitation = invitations.find((item) => item.id === id);
  if (invitation) { invitation.status = "pending"; invitation.sentAt = "Today"; invitation.expiresAt = "In 48 hours"; }
}

export async function cancelStaffInvitation(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const index = invitations.findIndex((item) => item.id === id);
  if (index >= 0) invitations.splice(index, 1);
}

export async function saveRolePermissions(role: StaffRole, permissions: StaffPermission[]): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 350));
  const definition = roles.find((item) => item.role === role);
  if (definition && role !== "owner") definition.permissions = permissions;
}
