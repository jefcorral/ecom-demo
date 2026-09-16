import { fetchApi } from "@/lib/api";
import type { SavedAddress } from "@/types";

export interface AddressInput {
  label: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  isDefault?: boolean;
}

export async function fetchAddresses(): Promise<SavedAddress[]> {
  const res = await fetchApi("/addresses");
  if (!res.ok) throw new Error("Failed to load addresses");
  const data = (await res.json()) as { data: SavedAddress[] };
  return data.data;
}

export async function createAddress(input: AddressInput): Promise<SavedAddress> {
  const res = await fetchApi("/addresses", {
    method: "POST",
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(err.message ?? "Failed to create address");
  }
  return (await res.json()) as SavedAddress;
}

export async function updateAddress(id: string, input: Partial<AddressInput>): Promise<SavedAddress> {
  const res = await fetchApi(`/addresses/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(err.message ?? "Failed to update address");
  }
  return (await res.json()) as SavedAddress;
}

export async function deleteAddress(id: string): Promise<void> {
  const res = await fetchApi(`/addresses/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(err.message ?? "Failed to delete address");
  }
}
