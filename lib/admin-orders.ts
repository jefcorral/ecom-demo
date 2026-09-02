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
  status: "pending" | "designing" | "sourcing" | "in_progress" | "delivered" | "cancelled" | "refunded";
  payment: "paid" | "partial" | "unpaid";
  total: number;
  items: number;
  image?: string;
  productName?: string;
  deliveryText?: string;
  priority?: boolean;
}

export interface AdminOrderLineItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  image: string;
  options?: string;
  refunded?: boolean;
}

export interface AdminOrderNote {
  id: string;
  author: string;
  role: string;
  text: string;
  createdAt: string;
}

export interface AdminOrderPayment {
  method: string;
  lastFour?: string;
  transactionId: string;
  paidAt: string;
  status: "paid" | "partial" | "unpaid" | "refunded";
}

export interface AdminOrderCourier {
  id?: string;
  name?: string;
  phone?: string;
}

export interface AdminOrderAuditEvent {
  id: string;
  status: string;
  label: string;
  timestamp: string;
  note?: string;
}

export interface AdminOrderDetail extends AdminOrder {
  customerPhone: string;
  billingAddress: string;
  recipientPhone?: string;
  lineItems: AdminOrderLineItem[];
  giftMessage?: string;
  notes: AdminOrderNote[];
  paymentDetails: AdminOrderPayment;
  courier?: AdminOrderCourier | null;
  auditHistory: AdminOrderAuditEvent[];
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

const orderDetails: Record<string, AdminOrderDetail> = {
  "ord-8924": {
    ...orders[0],
    customerPhone: "(555) 123-4567",
    billingAddress: "124 Valley Rd, Portland, OR 97204",
    lineItems: [
      {
        id: "li-1",
        name: "The Estate Signature Arrangement",
        sku: "ESA-GRAND-01",
        quantity: 1,
        unitPrice: 245,
        image: "/product-detail/bouquet-main.png",
        options: "Size: Grand Luxe",
      },
      {
        id: "li-2",
        name: "Handwritten Sympathy Card",
        sku: "CARD-SYM-01",
        quantity: 1,
        unitPrice: 8,
        image: "/product-detail/packaging.png",
      },
    ],
    giftMessage:
      "Dear Smithson Family, our deepest condolences during this difficult time. May these blooms bring a moment of peace. With love, The Henderson Family.",
    notes: [
      {
        id: "note-1",
        author: "Sarah J.",
        role: "Designer",
        text: "Substituted standard eucalyptus for premium seeded eucalyptus per inventory constraints. Value equivalent.",
        createdAt: "Oct 24, 3:30 PM",
      },
      {
        id: "note-2",
        author: "Admin User",
        role: "Manager",
        text: "Confirmed delivery window with venue coordinator.",
        createdAt: "Oct 24, 2:45 PM",
      },
    ],
    paymentDetails: {
      method: "Credit Card",
      lastFour: "4242",
      transactionId: "TXN-88492011",
      paidAt: "Oct 24",
      status: "paid",
    },
    courier: null,
    auditHistory: [
      { id: "a1", status: "pending", label: "Order Placed", timestamp: "Oct 24, 09:15 AM" },
      { id: "a2", status: "designing", label: "Status updated to Designing", timestamp: "Oct 24, 09:42 AM", note: "Assigned to Sarah J." },
      { id: "a3", status: "paid", label: "Payment confirmed", timestamp: "Oct 24, 09:43 AM", note: "Paid via Credit Card" },
    ],
  },
  "ord-8923": {
    ...orders[1],
    customerPhone: "(555) 987-6543",
    billingAddress: "842 Pine St, Apt 4B, Portland, OR 97204",
    lineItems: [
      {
        id: "li-3",
        name: "The Autumn Equinox Bouquet",
        sku: "AEB-GRAND-01",
        quantity: 1,
        unitPrice: 125,
        image: "/product-detail/bouquet-main.png",
        options: "Size: Grand",
      },
      {
        id: "li-4",
        name: "Handwritten Birthday Card",
        sku: "CARD-BDAY-01",
        quantity: 1,
        unitPrice: 5,
        image: "/product-detail/packaging.png",
      },
    ],
    giftMessage: "Happy Birthday, Mom! Wishing you a wonderful day surrounded by beauty. Love, Eleanor",
    notes: [],
    paymentDetails: {
      method: "Visa",
      lastFour: "4242",
      transactionId: "TXN-88492012",
      paidAt: "Oct 24",
      status: "paid",
    },
    courier: { id: "c1", name: "Alex Rivera", phone: "(555) 019-2831" },
    auditHistory: [
      { id: "a1", status: "pending", label: "Order Placed", timestamp: "Oct 24, 08:30 AM" },
      { id: "a2", status: "paid", label: "Payment confirmed", timestamp: "Oct 24, 08:31 AM" },
    ],
  },
};

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

export async function fetchAdminOrderById(id: string): Promise<AdminOrderDetail | null> {
  const existing = orderDetails[id];
  if (existing) return existing;

  const order = orders.find((o) => o.id === id);
  if (!order) return null;

  const fallback: AdminOrderDetail = {
    ...order,
    customerPhone: "(555) 000-0000",
    billingAddress: order.address,
    lineItems: [
      {
        id: "li-fb",
        name: order.productName ?? `${order.category} Arrangement`,
        sku: "SKU-FALLBACK",
        quantity: order.items,
        unitPrice: order.total,
        image: "/product-detail/lifestyle.png",
      },
    ],
    notes: [],
    paymentDetails: {
      method: "Credit Card",
      transactionId: `TXN-${id.replace(/\D/g, "")}`,
      paidAt: order.createdAt,
      status: order.payment === "paid" ? "paid" : "partial",
    },
    courier: null,
    auditHistory: [
      { id: "a1", status: order.status, label: "Order Placed", timestamp: order.createdAt },
    ],
  };
  return fallback;
}
