export type CustomerSegment = "vip" | "active" | "recent" | "inactive" | "new";
export type CustomerStatus = "active" | "disabled";
export type Recency = "today" | "this_week" | "this_month" | "older";

export interface CustomerNote {
  id: string;
  author: string;
  text: string;
  timestamp: string;
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
  lastOrder: string;
  recency: Recency;
  consent: {
    email: boolean;
    sms: boolean;
  };
  status: CustomerStatus;
  notes: CustomerNote[];
  address: string;
  joined: string;
}

export interface CustomerFilters {
  segment: "all" | CustomerSegment;
  search: string;
  sort: "name" | "spend" | "orders" | "recency";
}

const firstNames = [
  "Eleanor", "Marcus", "Sophia", "Liam", "Olivia", "James", "Ava", "Noah", "Isabella", "Lucas",
  "Mia", "Ethan", "Charlotte", "Mason", "Amelia", "Logan", "Harper", "Alexander", "Evelyn", "Daniel",
];

const lastNames = [
  "Vance", "Thorne", "Chen", "Ross", "Kensington", "James", "Wilson", "Miller", "Davis", "Garcia",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Anderson", "Thomas", "Taylor", "Moore", "Jackson",
];

const domains = ["example.com", "gmail.com", "botanica.io", "floral.co", "bloom.net", "stem.org"];

const segments: CustomerSegment[] = ["vip", "active", "recent", "inactive", "new"];

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

export function generateCustomers(count: number): AdminCustomer[] {
  return Array.from({ length: count }, (_, i) => {
    const index = i + 1;
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domains[i % domains.length]}`;
    const segment = segments[i % segments.length];
    const orders = segment === "vip" ? 10 + Math.floor(seededRandom(index) * 40) : Math.floor(seededRandom(index) * 20);
    const totalSpend = orders > 0 ? orders * (40 + Math.floor(seededRandom(index + 100) * 200)) : 0;
    const daysSinceOrder = segment === "inactive" ? 30 + Math.floor(seededRandom(index + 200) * 335) : Math.floor(seededRandom(index + 200) * 30);
    const daysSinceJoined = 30 + Math.floor(seededRandom(index + 300) * 700);
    const joinedDate = new Date();
    joinedDate.setDate(joinedDate.getDate() - daysSinceJoined);
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
      lastOrder: formatDateAgo(daysSinceOrder),
      recency: getRecency(daysSinceOrder),
      consent: {
        email: seededRandom(index + 500) > 0.25,
        sms: seededRandom(index + 600) > 0.6,
      },
      status: "active",
      notes: [],
      address: `${1000 + index} Botanical Lane, Portland, OR`,
      joined: joinedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
  });
}

const customers = generateCustomers(124);

export async function fetchAdminCustomers(): Promise<AdminCustomer[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return customers;
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
