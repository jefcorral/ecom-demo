import { fetchStatsOverview, OverviewStats } from "./stats";

export interface AdminDashboardData {
  stats: OverviewStats | null;
  dateRange: string;
  revenue: {
    current: number[];
    previous: number[];
    labels: string[];
  };
  ordersByStatus: {
    total: number;
    processing: number;
    completed: number;
    pending: number;
  };
  priorityOps: {
    id: string;
    title: string;
    due: string;
    status: string;
    statusColor: "primary" | "surface" | "tertiary";
    icon: string;
  }[];
  actionRequired: {
    id: string;
    orderId: string;
    customer: string;
    initials: string;
    issue: string;
    issueType: "error" | "warning";
    action: string;
  }[];
  todaysRoutes: {
    stops: number;
    routes: {
      id: string;
      time: string;
      location: string;
      orderId: string;
      detail: string;
    }[];
  };
  lowInventory: {
    id: string;
    name: string;
    quantity: string;
    urgent: boolean;
  }[];
}

const defaultData: Omit<AdminDashboardData, "stats"> = {
  dateRange: "Oct 17 - Oct 24",
  revenue: {
    current: [1800, 2600, 2400, 3100, 2800, 3500, 3700],
    previous: [1500, 1700, 1600, 1900, 1800, 2100, 2200],
    labels: ["Oct 17", "Oct 19", "Oct 21", "Oct 23"],
  },
  ordersByStatus: {
    total: 142,
    processing: 75,
    completed: 15,
    pending: 10,
  },
  priorityOps: [
    {
      id: "p1",
      title: "Smith Funeral Service - Casket Spray",
      due: "Due Today, 11:00 AM",
      status: "In Assembly",
      statusColor: "primary",
      icon: "church",
    },
    {
      id: "p2",
      title: "Johnson Wedding - Bridal Party",
      due: "Due Tomorrow, 9:00 AM",
      status: "Stem Prep",
      statusColor: "surface",
      icon: "celebration",
    },
  ],
  actionRequired: [
    {
      id: "a1",
      orderId: "#ORD-4921",
      customer: "Maria Evans",
      initials: "ME",
      issue: "Payment Failed",
      issueType: "error",
      action: "Retry",
    },
    {
      id: "a2",
      orderId: "#ORD-4923",
      customer: "Tom Richards",
      initials: "TR",
      issue: "Missing Card Msg",
      issueType: "warning",
      action: "Complete",
    },
  ],
  todaysRoutes: {
    stops: 12,
    routes: [
      {
        id: "r1",
        time: "10:30 AM",
        location: "Pearl District",
        orderId: "#4899",
        detail: "Hand-tied Bridal",
      },
      {
        id: "r2",
        time: "11:15 AM",
        location: "Downtown",
        orderId: "#4902",
        detail: "Corporate Arrangement",
      },
      {
        id: "r3",
        time: "12:45 PM",
        location: "NW 23rd",
        orderId: "#4905",
        detail: "Dozen Roses",
      },
    ],
  },
  lowInventory: [
    { id: "l1", name: "White Peonies", quantity: "3 stems left", urgent: true },
    { id: "l2", name: "Eucalyptus", quantity: "1 bn", urgent: true },
    { id: "l3", name: "Silk Ribbon", quantity: "Low", urgent: false },
    { id: "l4", name: "Glass Cylinder Vase (8\")", quantity: "Out of stock", urgent: true },
  ],
};

export async function fetchAdminDashboard(): Promise<AdminDashboardData> {
  const stats = await fetchStatsOverview().catch(() => null);
  return {
    ...defaultData,
    stats,
  };
}

export function isDashboardEmpty(data: AdminDashboardData): boolean {
  if (!data.stats) return false;
  return (
    data.stats.totalSales === 0 &&
    data.stats.totalOrders === 0 &&
    data.stats.totalCustomers === 0 &&
    data.stats.averageOrderValue === 0
  );
}
