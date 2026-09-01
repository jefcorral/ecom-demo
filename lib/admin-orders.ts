export interface AdminOrder {
  id: string;
  number: string;
  createdAt: string;
  category: string;
  customer: {
    name: string;
    email: string;
    initials?: string;
    avatar?: string;
    isVip?: boolean;
  };
  recipient: string;
  venue: string;
  venueType: "church" | "residence" | "office" | "event";
  address: string;
  targetDate: string;
  serviceTime?: string;
  timingNote?: string;
  status: "pending" | "designing" | "sourcing" | "in_progress" | "delivered" | "cancelled";
  payment: "paid" | "partial" | "unpaid";
  total: number;
  items: number;
  image?: string;
  productName?: string;
  deliveryText?: string;
  priority?: boolean;
}

const orders: AdminOrder[] = [
  {
    id: "ord-8924",
    number: "#ORD-8924",
    createdAt: "Oct 24, 09:15 AM",
    category: "Sympathy",
    customer: {
      name: "Eleanor Vance",
      email: "eleanor.v@example.com",
      avatar: undefined,
      isVip: true,
    },
    recipient: "Smithson Family",
    venue: "Oakridge Memorial",
    venueType: "church",
    address: "124 Valley Rd, Portland",
    targetDate: "Oct 26 (Tomorrow)",
    serviceTime: "Service: 10:00 AM",
    timingNote: "Strict Timing",
    status: "designing",
    payment: "paid",
    total: 345,
    items: 1,
    priority: true,
  },
  {
    id: "ord-8923",
    number: "#ORD-8923",
    createdAt: "Oct 24, 08:30 AM",
    category: "Retail",
    customer: {
      name: "Marcus Chen",
      email: "m.chen88@gmail.com",
      initials: "MC",
    },
    recipient: "Sarah Chen",
    venue: "Residence",
    venueType: "residence",
    address: "842 Pine St, Apt 4B",
    targetDate: "Oct 28",
    serviceTime: "Flexible window",
    status: "pending",
    payment: "paid",
    total: 185,
    items: 1,
  },
  {
    id: "ord-8922",
    number: "#ORD-8922",
    createdAt: "Oct 23, 02:45 PM",
    category: "Event",
    customer: {
      name: "Julian Rossi",
      email: "j.rossi@lumiere.com",
      avatar: undefined,
    },
    recipient: "Corporate Gala",
    venue: "The Glasshouse",
    venueType: "event",
    address: "450 W 14th St, NYC",
    targetDate: "Nov 12",
    serviceTime: "Setup: 08:00 AM",
    status: "sourcing",
    payment: "partial",
    total: 420,
    items: 2,
  },
  {
    id: "ord-8921",
    number: "#ORD-8921",
    createdAt: "Oct 23, 10:20 AM",
    category: "Retail",
    customer: {
      name: "Sophia Rossi",
      email: "sophia.r@example.com",
      avatar: undefined,
    },
    recipient: "Sophia Rossi",
    venue: "Residence",
    venueType: "residence",
    address: "12 Hawthorne Ln",
    targetDate: "Oct 24",
    serviceTime: "Today, 4:00 PM",
    status: "in_progress",
    payment: "paid",
    total: 85,
    items: 1,
    image: undefined,
    productName: "Monstera Deliciosa (L)",
    deliveryText: "Delivery: Today, 2:00 PM",
  },
  {
    id: "ord-8920",
    number: "#ORD-8920",
    createdAt: "Oct 22, 04:10 PM",
    category: "Retail",
    customer: {
      name: "James Kensington",
      email: "james@kensington.com",
      avatar: undefined,
    },
    recipient: "James Kensington",
    venue: "Residence",
    venueType: "residence",
    address: "55 Belmont St",
    targetDate: "Oct 24",
    serviceTime: "Delivered",
    status: "delivered",
    payment: "paid",
    total: 120,
    items: 3,
    image: undefined,
    productName: "Desert Terrarium Kit",
    deliveryText: "Delivered: Oct 22",
  },
];

export interface AdminOrdersData {
  orders: AdminOrder[];
  total: number;
  limit: number;
  page: number;
  totalPages: number;
  statusCounts: {
    all: number;
    pending: number;
    inProgress: number;
    delivered: number;
  };
}

const TOTAL = 1248;
const LIMIT = 3;

export async function fetchAdminOrders(): Promise<AdminOrdersData> {
  return {
    orders,
    total: TOTAL,
    limit: LIMIT,
    page: 1,
    totalPages: Math.ceil(TOTAL / LIMIT),
    statusCounts: {
      all: TOTAL,
      pending: 12,
      inProgress: 45,
      delivered: 1100,
    },
  };
}
