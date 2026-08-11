import { fetchApi } from "@/lib/api";

export interface OverviewStats {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
}

export async function fetchStatsOverview(): Promise<OverviewStats> {
  const res = await fetchApi("/stats/overview");
  if (!res.ok) throw new Error("Failed to load stats");
  return (await res.json()) as OverviewStats;
}
