import { fetchApi } from "@/lib/api";

export type DeliveryZoneStatus = "active" | "paused";
export type DeliveryZoneColor = "gold" | "sage" | "forest" | "terracotta" | "lavender";

export interface DeliveryZone {
  id: string;
  name: string;
  postalCodes: string[];
  radius: number;
  fee: number;
  freeThreshold: number | null;
  sameDay: boolean;
  cutoff: string;
  status: DeliveryZoneStatus;
  color: DeliveryZoneColor;
  affectedOrders: number;
}

export interface DeliverySlot {
  id: string;
  name: string;
  label: string;
  startsAt: string;
  endsAt: string;
  capacity: number;
  booked: number;
  enabled: boolean;
}

export interface DeliveryBlackout {
  id: string;
  label: string;
  dates: string;
  reason: string;
  affectedZones: string;
  type: "closure" | "maintenance" | "surcharge";
}

export interface DeliverySettingsData {
  zones: DeliveryZone[];
  slots: DeliverySlot[];
  blackouts: DeliveryBlackout[];
  driverNotes: string;
}

export async function fetchDeliverySettings(): Promise<DeliverySettingsData> {
  const res = await fetchApi("/admin/delivery");
  if (!res.ok) throw new Error("Failed to load delivery settings");
  return (await res.json()) as DeliverySettingsData;
}

export async function saveDeliveryZone(zone: DeliveryZone): Promise<void> {
  const body = { ...zone };
  const res = zone.id
    ? await fetchApi(`/admin/delivery/zones/${zone.id}`, { method: "PATCH", body: JSON.stringify(body) })
    : await fetchApi("/admin/delivery/zones", { method: "POST", body: JSON.stringify(body) });
  if (!res.ok) throw new Error("Failed to save delivery zone");
}

export async function deleteDeliveryZone(id: string): Promise<void> {
  const res = await fetchApi(`/admin/delivery/zones/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete delivery zone");
}

export async function saveDriverNotes(notes: string): Promise<void> {
  const res = await fetchApi("/admin/delivery/driver-notes", {
    method: "PATCH",
    body: JSON.stringify({ notes }),
  });
  if (!res.ok) throw new Error("Failed to save driver notes");
}

export async function saveDeliverySlot(slot: DeliverySlot): Promise<void> {
  const body = { ...slot };
  const res = slot.id
    ? await fetchApi(`/admin/delivery/slots/${slot.id}`, { method: "PATCH", body: JSON.stringify(body) })
    : await fetchApi("/admin/delivery/slots", { method: "POST", body: JSON.stringify(body) });
  if (!res.ok) throw new Error("Failed to save delivery slot");
}

export async function deleteDeliverySlot(id: string): Promise<void> {
  const res = await fetchApi(`/admin/delivery/slots/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete delivery slot");
}

export async function saveDeliveryBlackout(blackout: DeliveryBlackout): Promise<void> {
  const body = { ...blackout };
  const res = blackout.id
    ? await fetchApi(`/admin/delivery/blackouts/${blackout.id}`, { method: "PATCH", body: JSON.stringify(body) })
    : await fetchApi("/admin/delivery/blackouts", { method: "POST", body: JSON.stringify(body) });
  if (!res.ok) throw new Error("Failed to save delivery blackout");
}

export async function deleteDeliveryBlackout(id: string): Promise<void> {
  const res = await fetchApi(`/admin/delivery/blackouts/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete delivery blackout");
}
