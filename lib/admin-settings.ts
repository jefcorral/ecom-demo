import { fetchApi } from "@/lib/api";

export type SettingsSection = "profile" | "hours" | "holidays" | "checkout" | "payment" | "notifications" | "integrations" | "security";

export interface StoreProfileSettings { name: string; email: string; phone: string; address: string; tagline: string; }
export interface BusinessDay { day: string; open: boolean; opensAt: string; closesAt: string; }
export interface HolidayClosure { id: string; name: string; date: string; closed: boolean; hours?: string; }
export interface CheckoutSettings { guestCheckout: boolean; giftOptions: boolean; deliveryDatePicker: boolean; arrangementNotes: boolean; }
export interface PaymentSettings { provider: string; applePay: boolean; connected: boolean; testMode: boolean; }
export interface NotificationSettings { orderConfirmation: boolean; lowStock: boolean; vipCustomer: boolean; weeklyDigest: boolean; }
export interface IntegrationSettings { id: string; name: string; description: string; connected: boolean; }
export interface StaffSession { id: string; device: string; location: string; lastActive: string; current: boolean; }
export interface AdminSettings {
  profile: StoreProfileSettings;
  hours: BusinessDay[];
  holidays: HolidayClosure[];
  checkout: CheckoutSettings;
  payment: PaymentSettings;
  notifications: NotificationSettings;
  integrations: IntegrationSettings[];
  sessions: StaffSession[];
}

export async function fetchAdminSettings(): Promise<AdminSettings> {
  const res = await fetchApi("/settings/admin");
  if (!res.ok) throw new Error("Failed to load settings");
  return (await res.json()) as AdminSettings;
}

export async function saveAdminSettings(next: AdminSettings): Promise<void> {
  const res = await fetchApi("/settings/admin", {
    method: "PATCH",
    body: JSON.stringify(next),
  });
  if (!res.ok) throw new Error("Failed to save settings");
}

export async function signOutStaffSession(id: string): Promise<void> {
  const res = await fetchApi(`/settings/admin/sessions/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to sign out session");
}

export async function updateAdminPassword(): Promise<void> {
  // Placeholder: password change endpoint can be wired later.
  await new Promise((resolve) => setTimeout(resolve, 400));
}
