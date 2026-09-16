import { fetchApi } from "@/lib/api";
import { Order, OrderStatusHistoryItem, OrdersResponse } from "@/types";

export async function fetchOrders(params?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<OrdersResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.status) searchParams.set("status", params.status);
  const res = await fetchApi(`/orders?${searchParams.toString()}`);
  if (!res.ok) throw new Error("Failed to load orders");
  return (await res.json()) as OrdersResponse;
}

export async function fetchOrder(id: string): Promise<Order> {
  const res = await fetchApi(`/orders/${id}`);
  if (!res.ok) throw new Error("Failed to load order");
  return (await res.json()) as Order;
}

export async function fetchOrderHistory(id: string): Promise<OrderStatusHistoryItem[]> {
  const res = await fetchApi(`/orders/${id}/history`);
  if (!res.ok) throw new Error("Failed to load order history");
  const data = (await res.json()) as { data: OrderStatusHistoryItem[] };
  return data.data;
}
