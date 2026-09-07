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

const settings: AdminSettings = {
  profile: { name: "Bloom & Stem Flagship Atelier", email: "concierge@bloomstem.com", phone: "+1 415 390 2341", address: "742 Evergreen Mews, Florist Quarter, Suite 1", tagline: "Poetic seasonal botanicals, crafted with regenerative stems." },
  hours: [
    { day: "Monday", open: true, opensAt: "08:30", closesAt: "18:00" },
    { day: "Tuesday", open: true, opensAt: "08:30", closesAt: "18:00" },
    { day: "Wednesday", open: true, opensAt: "08:30", closesAt: "18:00" },
    { day: "Thursday", open: true, opensAt: "08:30", closesAt: "18:00" },
    { day: "Friday", open: true, opensAt: "08:30", closesAt: "19:30" },
    { day: "Saturday", open: true, opensAt: "09:00", closesAt: "16:30" },
    { day: "Sunday", open: false, opensAt: "10:00", closesAt: "16:00" },
  ],
  holidays: [
    { id: "holiday-1", name: "Christmas & Midwinter Bloom Recess", date: "2026-12-24", closed: true },
    { id: "holiday-2", name: "New Year Atelier Restock", date: "2027-01-01", closed: true },
    { id: "holiday-3", name: "Mother's Day High-Demand Operations", date: "2027-05-09", closed: false, hours: "07:00–18:00" },
  ],
  checkout: { guestCheckout: true, giftOptions: true, deliveryDatePicker: true, arrangementNotes: true },
  payment: { provider: "Stripe Elements + Apple Pay", applePay: true, connected: true, testMode: false },
  notifications: { orderConfirmation: true, lowStock: true, vipCustomer: true, weeklyDigest: false },
  integrations: [
    { id: "klaviyo", name: "Klaviyo Floral CRM", description: "Newsletter audiences and behavioral triggers", connected: true },
    { id: "postnord", name: "PostNord Cold Chain", description: "Temperature-controlled courier dispatch", connected: true },
    { id: "ga4", name: "Google Analytics 4", description: "Storefront conversion and campaign reporting", connected: false },
  ],
  sessions: [
    { id: "session-1", device: "iPhone 15 Pro", location: "San Francisco, CA", lastActive: "Active now", current: true },
    { id: "session-2", device: "iPad Pro Studio POS", location: "Flagship Atelier", lastActive: "22 mins ago", current: false },
    { id: "session-3", device: "MacBook Air M2", location: "Atelier Office", lastActive: "Yesterday", current: false },
  ],
};

export async function fetchAdminSettings(): Promise<AdminSettings> { await new Promise((resolve) => setTimeout(resolve, 450)); return structuredClone(settings); }
export async function saveAdminSettings(next: AdminSettings): Promise<void> { await new Promise((resolve) => setTimeout(resolve, 450)); Object.assign(settings, structuredClone(next)); }
export async function signOutStaffSession(id: string): Promise<void> { await new Promise((resolve) => setTimeout(resolve, 300)); const index = settings.sessions.findIndex((session) => session.id === id); if (index >= 0 && !settings.sessions[index].current) settings.sessions.splice(index, 1); }
export async function updateAdminPassword(): Promise<void> { await new Promise((resolve) => setTimeout(resolve, 400)); }
