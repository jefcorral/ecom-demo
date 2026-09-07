export type CustomerSegment = "vip" | "active" | "recent" | "inactive" | "new";
export type CustomerStatus = "active" | "disabled";
export type Recency = "today" | "this_week" | "this_month" | "older";

export interface CustomerNote {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export interface CustomerAddress {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  isPrimary: boolean;
}

export interface CustomerOrder {
  id: string;
  date: string;
  total: number;
  items: number;
  status: string;
  productName: string;
  isSubscription?: boolean;
}

export interface CustomerPreferences {
  favoriteBlooms: string[];
  styleProfile: string;
  allergies: string[];
  colorPalette: string;
}

export interface GiftRecipient {
  id: string;
  name: string;
  relation: string;
  occasion: string;
  occasionDate: string;
  frequency: string;
}

export interface SupportTicket {
  id: string;
  type: "refund" | "support" | "exchange";
  status: "open" | "resolved" | "pending";
  date: string;
  description: string;
  amount?: number;
}

export interface SubscriptionStatus {
  status: "active" | "paused" | "none";
  plan: string;
  nextDelivery: string;
  frequency: string;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  initials: string;
  segment: CustomerSegment;
  orders: number;
  totalSpend: number;
  averageOrderValue: number;
  lastOrder: string;
  recency: Recency;
  consent: {
    email: boolean;
    sms: boolean;
  };
  status: CustomerStatus;
  notes: CustomerNote[];
  address: string;
  addresses: CustomerAddress[];
  joined: string;
  location: string;
  preferences: CustomerPreferences;
  giftRecipients: GiftRecipient[];
  orderHistory: CustomerOrder[];
  supportHistory: SupportTicket[];
  subscription: SubscriptionStatus;
  petalPoints: number;
  recentActivity: { id: string; action: string; date: string }[];
}

export interface CustomerFilters {
  segment: "all" | CustomerSegment;
  search: string;
  sort: "name" | "spend" | "orders" | "recency";
}

const firstNames = [
  "Eleanor", "Marcus", "Sophia", "Liam", "Olivia", "James", "Ava", "Noah", "Isabella", "Lucas",
  "Mia", "Ethan", "Charlotte", "Mason", "Amelia", "Logan", "Harper", "Alexander", "Evelyn", "Daniel",
  "Henry", "Sofia", "Benjamin", "Chloe", "Mila", "Aiden", "Ella", "Oliver", "Grace", "Jackson",
  "Zoe", "Lucas", "Lily", "Samuel", "Layla", "David", "Avery", "Joseph", "Scarlett", "Carter",
  "Riley", "Wyatt", "Nora", "Dylan", "Hannah", "Luke", "Penelope", "Gabriel", "Lillian", "Owen",
];

const lastNames = [
  "Vance", "Thorne", "Chen", "Ross", "Kensington", "James", "Wilson", "Miller", "Davis", "Garcia",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Anderson", "Thomas", "Taylor", "Moore", "Jackson",
  "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis",
  "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill",
  "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter",
];

const domains = ["example.com", "gmail.com", "botanica.io", "floral.co", "bloom.net", "stem.org"];

const segments: CustomerSegment[] = ["vip", "active", "recent", "inactive", "new"];

const cities = [
  { name: "Portland", state: "Oregon" },
  { name: "New York", state: "NY" },
  { name: "Los Angeles", state: "California" },
  { name: "Chicago", state: "Illinois" },
  { name: "Seattle", state: "Washington" },
  { name: "Austin", state: "Texas" },
  { name: "San Francisco", state: "California" },
  { name: "Denver", state: "Colorado" },
  { name: "Miami", state: "Florida" },
  { name: "Boston", state: "Massachusetts" },
];

const blooms = ["Peonies", "White Orchids", "Garden Roses", "Tulips", "Hydrangeas", "Ranunculus", "Lilies", "Anemones", "Dahlias", "Lilacs"];
const styles = ["Minimalist", "Romantic", "Garden Style", "Modern", "Monochromatic", "Vintage", "Tropical", "Rustic"];
const palettes = ["Pastel", "Jewel Tones", "Neutral", "Bright", "White & Green", "Warm Earth"];
const allergies = ["Lilies", "Strong Fragrances", "Pollen-heavy Blooms", "Baby's Breath", "None"];

const relations = ["Mother", "Husband", "Wife", "Partner", "Sister", "Friend", "Business Partner", "Daughter", "Son"];
const occasions = ["Birthday", "Anniversary", "Mother's Day", "Valentine's Day", "Holiday", "Just Because"];

const recencyLabels: Record<Recency, string> = {
  today: "Today",
  this_week: "This week",
  this_month: "This month",
  older: "Older",
};

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function formatPhone(index: number): string {
  const area = 200 + Math.floor(seededRandom(index + 500) * 700);
  const prefix = 100 + Math.floor(seededRandom(index + 600) * 900);
  const line = 1000 + Math.floor(seededRandom(index + 700) * 9000);
  return `+1 (${area}) ${prefix}-${line}`;
}

function formatDateAgo(days: number): string {
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

function getRecency(days: number): Recency {
  if (days === 0) return "today";
  if (days < 7) return "this_week";
  if (days < 30) return "this_month";
  return "older";
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function generateOrders(index: number, count: number): CustomerOrder[] {
  if (count === 0) return [];
  const statuses = ["Delivered", "Shipped", "Processing", "Delivered"];
  const products = ["Spring Peony Arrangement", "The Ivory Reserve", "Bespoke Peony Wrap", "Seasonal Bloom Box", "Monstera Deliciosa", "Orchid Care Set"];
  return Array.from({ length: count }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i * 12 - Math.floor(seededRandom(index + i * 100) * 30));
    return {
      id: `#ORD-${8839 + i + index * 100}`,
      date: formatDate(date),
      total: 40 + Math.floor(seededRandom(index + i * 50) * 260),
      items: 1 + Math.floor(seededRandom(index + i * 30) * 4),
      status: statuses[i % statuses.length],
      productName: products[i % products.length],
      isSubscription: i % 5 === 0,
    };
  });
}

function generateGiftRecipients(index: number): GiftRecipient[] {
  const count = Math.floor(seededRandom(index + 800) * 3);
  if (count === 0) return [];
  return Array.from({ length: count }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + 15 + i * 45 + Math.floor(seededRandom(index + i * 70) * 60));
    return {
      id: `recv-${index}-${i}`,
      name: `${firstNames[(index + i + 10) % firstNames.length]} ${lastNames[(index + i + 5) % lastNames.length]}`,
      relation: relations[i % relations.length],
      occasion: occasions[i % occasions.length],
      occasionDate: formatDate(date),
      frequency: `${1 + (i % 3)}x / yr`,
    };
  });
}

function generateSupportHistory(index: number): SupportTicket[] {
  const count = Math.floor(seededRandom(index + 900) * 3);
  if (count === 0) return [];
  const types: SupportTicket["type"][] = ["support", "refund", "exchange"];
  const statuses: SupportTicket["status"][] = ["resolved", "resolved", "open"];
  return Array.from({ length: count }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 30 - i * 60 - Math.floor(seededRandom(index + i * 110) * 90));
    return {
      id: `ticket-${index}-${i}`,
      type: types[i % types.length],
      status: statuses[i % statuses.length],
      date: formatDate(date),
      description: [
        "Customer requested a refund due to delayed delivery.",
        "Reported damaged petals on arrival; replacement sent.",
        "Inquiry about subscription schedule change.",
      ][i % 3],
      amount: i % 2 === 0 ? 85 : undefined,
    };
  });
}

function generateActivity(index: number, hasOrders: boolean): { id: string; action: string; date: string }[] {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(seededRandom(index + 1200) * 7));
  const activity = [{ id: `act-${index}-1`, action: "Account Registered", date: formatDate(date) }];
  if (hasOrders) {
    activity.unshift({
      id: `act-${index}-2`,
      action: "Placed an order",
      date: formatDate(date),
    });
  }
  return activity;
}

export function generateCustomers(count: number): AdminCustomer[] {
  return Array.from({ length: count }, (_, i) => {
    const index = i + 1;
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domains[i % domains.length]}`;
    const segment = segments[i % segments.length];
    const orders = segment === "vip" ? 10 + Math.floor(seededRandom(index) * 40) : segment === "new" ? 0 : Math.floor(seededRandom(index) * 20);
    const totalSpend = orders > 0 ? orders * (40 + Math.floor(seededRandom(index + 100) * 200)) : 0;
    const averageOrderValue = orders > 0 ? Math.round(totalSpend / orders) : 0;
    const daysSinceOrder = segment === "inactive" ? 30 + Math.floor(seededRandom(index + 200) * 335) : segment === "new" ? 0 : Math.floor(seededRandom(index + 200) * 30);
    const daysSinceJoined = segment === "new" ? 0 : 30 + Math.floor(seededRandom(index + 300) * 700);
    const joinedDate = new Date();
    joinedDate.setDate(joinedDate.getDate() - daysSinceJoined);
    const city = cities[i % cities.length];

    const orderHistory = generateOrders(index, orders);
    const address: CustomerAddress = {
      id: `addr-${index}`,
      label: "Home",
      street: `${1000 + index} ${["Botanical", "Floral", "Garden", "Meadow", "Willow"][i % 5]} ${["Lane", "Ave", "Street", "Boulevard", "Way"][i % 5]}`,
      city: city.name,
      state: city.state,
      zip: String(10000 + (i % 89999)),
      isPrimary: true,
    };

    const supportHistory = generateSupportHistory(index);
    const activity = generateActivity(index, orders > 0);

    return {
      id: `cust-${String(index).padStart(4, "0")}`,
      name,
      email,
      phone: formatPhone(index),
      avatar: undefined,
      initials: `${firstName[0]}${lastName[0]}`,
      segment,
      orders,
      totalSpend,
      averageOrderValue,
      lastOrder: orders > 0 ? formatDateAgo(daysSinceOrder) : "No orders yet",
      recency: getRecency(daysSinceOrder),
      consent: {
        email: seededRandom(index + 500) > 0.25,
        sms: seededRandom(index + 600) > 0.6,
      },
      status: "active",
      notes: [
        {
          id: `note-${index}-1`,
          author: "Admin Staff",
          text: "Customer prefers morning deliveries on weekends.",
          timestamp: "Oct 14, 2022, 10:45 AM",
        },
      ],
      address: `${address.street}, ${address.city}, ${address.state} ${address.zip}`,
      addresses: [address],
      joined: formatDate(joinedDate),
      location: `${city.name}, ${city.state}`,
      preferences: {
        favoriteBlooms: [blooms[i % blooms.length], blooms[(i + 1) % blooms.length]],
        styleProfile: styles[i % styles.length],
        allergies: seededRandom(index + 1000) > 0.7 ? [allergies[i % allergies.length]] : [],
        colorPalette: palettes[i % palettes.length],
      },
      giftRecipients: generateGiftRecipients(index),
      orderHistory,
      supportHistory,
      subscription: {
        status: segment === "vip" ? "active" : "none",
        plan: segment === "vip" ? "Seasonal Bloom Box" : "-",
        nextDelivery: segment === "vip" ? "Oct 12, 2023" : "-",
        frequency: segment === "vip" ? "Monthly" : "-",
      },
      petalPoints: Math.floor(totalSpend / 10),
      recentActivity: activity,
    };
  });
}

const customers = generateCustomers(124);

export async function fetchAdminCustomers(): Promise<AdminCustomer[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return customers;
}

export async function fetchAdminCustomer(id: string): Promise<AdminCustomer | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 350));
  return customers.find((c) => c.id === id);
}

export async function disableAdminCustomer(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 350));
  const customer = customers.find((c) => c.id === id);
  if (customer) {
    customer.status = "disabled";
  }
}

export async function enableAdminCustomer(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 350));
  const customer = customers.find((c) => c.id === id);
  if (customer) {
    customer.status = "active";
  }
}

export async function addAdminCustomerNote(id: string, text: string): Promise<CustomerNote> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const customer = customers.find((c) => c.id === id);
  const note: CustomerNote = {
    id: `note-${Date.now()}`,
    author: "Admin User",
    text,
    timestamp: new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
  };
  if (customer) {
    customer.notes.unshift(note);
  }
  return note;
}

export function exportAdminCustomersCSV(customers: AdminCustomer[]): string {
  const headers = ["ID", "Name", "Email", "Phone", "Segment", "Orders", "Total Spend", "Status", "Joined"];
  const rows = customers.map((c) =>
    [c.id, c.name, c.email, c.phone, c.segment, c.orders, c.totalSpend, c.status, c.joined].join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

export function segmentLabel(segment: CustomerSegment): string {
  const labels: Record<CustomerSegment, string> = {
    vip: "VIP",
    active: "Active",
    recent: "Recent",
    inactive: "Inactive",
    new: "New",
  };
  return labels[segment];
}

export function recencyLabel(recency: Recency): string {
  return recencyLabels[recency];
}

export function ticketTypeLabel(type: SupportTicket["type"]): string {
  const labels: Record<SupportTicket["type"], string> = { refund: "Refund", support: "Support", exchange: "Exchange" };
  return labels[type];
}

export function ticketStatusColor(status: SupportTicket["status"]): string {
  const colors: Record<SupportTicket["status"], string> = {
    open: "bg-error-container text-error",
    resolved: "bg-secondary-container text-on-secondary-container",
    pending: "bg-tertiary-container text-on-tertiary-container",
  };
  return colors[status];
}
