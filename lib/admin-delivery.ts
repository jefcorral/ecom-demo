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

const data: DeliverySettingsData = {
  zones: [
    { id: "zone-1", name: "Downtown Core", postalCodes: ["10001", "10002", "10003", "10004", "10005"], radius: 5, fee: 8, freeThreshold: 95, sameDay: true, cutoff: "14:00", status: "active", color: "gold", affectedOrders: 14 },
    { id: "zone-2", name: "North Botanical District", postalCodes: ["10021", "10024", "10028"], radius: 8.5, fee: 12, freeThreshold: 120, sameDay: true, cutoff: "13:30", status: "active", color: "forest", affectedOrders: 8 },
    { id: "zone-3", name: "Riverside & Marina", postalCodes: ["10069", "10280"], radius: 6.2, fee: 10, freeThreshold: 110, sameDay: true, cutoff: "13:30", status: "active", color: "sage", affectedOrders: 7 },
    { id: "zone-4", name: "Greater Metro", postalCodes: ["11101", "11201", "11211"], radius: 14, fee: 18, freeThreshold: 150, sameDay: false, cutoff: "12:00", status: "active", color: "terracotta", affectedOrders: 5 },
    { id: "zone-5", name: "Wedding Venue Corridor", postalCodes: ["10504", "10528"], radius: 25, fee: 35, freeThreshold: null, sameDay: false, cutoff: "10:00", status: "active", color: "lavender", affectedOrders: 2 },
  ],
  slots: [
    { id: "slot-1", name: "Morning Dawn Rush", label: "Early Route", startsAt: "08:00", endsAt: "11:30", capacity: 45, booked: 42, enabled: true },
    { id: "slot-2", name: "Midday Executive", label: "Corporate & Gift", startsAt: "11:30", endsAt: "14:30", capacity: 55, booked: 51, enabled: true },
    { id: "slot-3", name: "Afternoon Residential", label: "Home Delivery", startsAt: "14:30", endsAt: "17:30", capacity: 40, booked: 28, enabled: true },
    { id: "slot-4", name: "Evening Soirée", label: "Event & Hospitality", startsAt: "17:30", endsAt: "20:30", capacity: 30, booked: 21, enabled: true },
  ],
  blackouts: [
    { id: "blackout-1", label: "Christmas & Winter Solstice", dates: "Dec 24–26, 2026", reason: "Atelier doors closed for the holiday period and cold storage dormancy.", affectedZones: "All 5 zones", type: "closure" },
    { id: "blackout-2", label: "Inventory Audit & Stem Restock", dates: "Jan 01–02, 2027", reason: "Annual stem count and refrigeration compressor inspection.", affectedZones: "Greater Metro & Venue Corridor", type: "maintenance" },
    { id: "blackout-3", label: "Valentine’s High-Surge Tier", dates: "Feb 13–15, 2027", reason: "Same-day walk-in ordering disabled; priority courier tags required.", affectedZones: "All 5 zones", type: "surcharge" },
  ],
  driverNotes: "1. HYDRATION INTEGRITY: Ensure every bouquet stem base remains submerged in its biodegradable Hydra-Silk reservoir. If water cloudiness exceeds standard clarity, replace the gel pack before boarding.\n\n2. COLD-CHAIN REFRIGERATION: Transit cabin must remain locked at 38°F–42°F. Dutch garden roses and ranunculus blooms must not encounter direct heater vents.\n\n3. DELIVERY HANDOFF: Photograph each contactless delivery and confirm recipient or concierge name in the dispatch terminal.",
};

export async function fetchDeliverySettings(): Promise<DeliverySettingsData> { await new Promise((resolve) => setTimeout(resolve, 450)); return structuredClone(data); }
export async function saveDeliveryZone(zone: DeliveryZone): Promise<void> { await new Promise((resolve) => setTimeout(resolve, 350)); const index = data.zones.findIndex((item) => item.id === zone.id); if (index >= 0) data.zones[index] = structuredClone(zone); else data.zones.unshift(structuredClone(zone)); }
export async function deleteDeliveryZone(id: string): Promise<void> { await new Promise((resolve) => setTimeout(resolve, 350)); const index = data.zones.findIndex((item) => item.id === id); if (index >= 0) data.zones.splice(index, 1); }
export async function saveDriverNotes(notes: string): Promise<void> { await new Promise((resolve) => setTimeout(resolve, 300)); data.driverNotes = notes; }
export async function saveDeliverySlot(slot: DeliverySlot): Promise<void> { await new Promise((resolve) => setTimeout(resolve, 300)); const index = data.slots.findIndex((item) => item.id === slot.id); if (index >= 0) data.slots[index] = structuredClone(slot); else data.slots.push(structuredClone(slot)); }
export async function saveDeliveryBlackout(blackout: DeliveryBlackout): Promise<void> { await new Promise((resolve) => setTimeout(resolve, 300)); const index = data.blackouts.findIndex((item) => item.id === blackout.id); if (index >= 0) data.blackouts[index] = structuredClone(blackout); else data.blackouts.push(structuredClone(blackout)); }
