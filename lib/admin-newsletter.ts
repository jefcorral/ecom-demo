import { fetchApi } from "@/lib/api";

export type SubscriberSegment = "all" | "vip" | "seasonal" | "new" | "lapsed";
export type CampaignStatus = "draft" | "scheduled" | "sent" | "archived";

export interface Subscriber {
  id: string;
  name: string;
  initials: string;
  email: string;
  segment: Exclude<SubscriberSegment, "all">;
  consent: string;
  source: string;
  joined: string;
  status: "active" | "unsubscribed";
}

export interface Campaign {
  id: string;
  name: string;
  audience: Exclude<SubscriberSegment, "all"> | "all";
  status: CampaignStatus;
  date: string;
  delivered?: number;
  openRate?: number;
  clickRate?: number;
  conversions?: number;
  revenue?: number;
  subject: string;
  previewText: string;
}

export interface CampaignDraft {
  id?: string;
  name: string;
  audience: Campaign["audience"];
  subject: string;
  previewText: string;
  senderName: string;
  senderEmail: string;
  blocks: { id: string; type: "hero" | "heading" | "text" | "products" | "button" | "divider"; label: string }[];
}

export interface NewsletterData {
  subscribers: Subscriber[];
  campaigns: Campaign[];
}

export const segmentLabels: Record<SubscriberSegment, string> = {
  all: "All Subscribers",
  vip: "VIP Clients",
  seasonal: "Seasonal Buyers",
  new: "New Customers",
  lapsed: "Lapsed Customers",
};

export const segmentCounts: Record<SubscriberSegment, number> = {
  all: 0,
  vip: 0,
  seasonal: 0,
  new: 0,
  lapsed: 0,
};

export function emptyCampaignDraft(): CampaignDraft {
  return {
    name: "",
    audience: "vip",
    subject: "",
    previewText: "",
    senderName: "Eleanor Vance",
    senderEmail: "atelier@bloomstem.com",
    blocks: [
      { id: "block-1", type: "hero", label: "Hero Image" },
      { id: "block-2", type: "heading", label: "Botanical Heading" },
      { id: "block-3", type: "text", label: "Rich Text Narrative" },
      { id: "block-4", type: "products", label: "Curated Stems Grid" },
      { id: "block-5", type: "button", label: "Primary Action Pill" },
    ],
  };
}

export async function fetchNewsletterData(): Promise<NewsletterData> {
  const res = await fetchApi("/admin/newsletter");
  if (!res.ok) throw new Error("Failed to load newsletter data");
  return (await res.json()) as NewsletterData;
}

export async function fetchSubscribers(
  params: { page?: number; limit?: number } = {}
): Promise<{ data: Subscriber[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> {
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  const res = await fetchApi(`/admin/newsletter/subscribers?${search.toString()}`);
  if (!res.ok) throw new Error("Failed to load subscribers");
  return (await res.json()) as { data: Subscriber[]; pagination: { page: number; limit: number; total: number; totalPages: number } };
}

export async function saveCampaignDraft(draft: CampaignDraft): Promise<Campaign> {
  const res = await fetchApi("/admin/newsletter/campaigns", {
    method: "POST",
    body: JSON.stringify(draft),
  });
  if (!res.ok) throw new Error("Failed to save campaign");
  return (await res.json()) as Campaign;
}

export async function scheduleCampaign(draft: CampaignDraft, date: string): Promise<Campaign> {
  const saved = await saveCampaignDraft(draft);
  const res = await fetchApi(`/admin/newsletter/campaigns/${saved.id}/schedule`, {
    method: "POST",
    body: JSON.stringify({ scheduledAt: new Date(date).toISOString() }),
  });
  if (!res.ok) throw new Error("Failed to schedule campaign");
  return (await res.json()) as Campaign;
}

export async function sendCampaign(draft: CampaignDraft): Promise<Campaign> {
  const saved = await saveCampaignDraft(draft);
  const res = await fetchApi(`/admin/newsletter/campaigns/${saved.id}/send`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to send campaign");
  return (await res.json()) as Campaign;
}

export async function sendTestCampaign(draft: CampaignDraft, email: string): Promise<void> {
  const saved = await saveCampaignDraft(draft);
  const res = await fetchApi(`/admin/newsletter/campaigns/${saved.id}/test`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error("Failed to send test email");
}

export async function archiveCampaign(id: string): Promise<void> {
  const res = await fetchApi(`/admin/newsletter/campaigns/${id}/archive`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Failed to archive campaign");
}

export async function deleteCampaign(id: string): Promise<void> {
  const res = await fetchApi(`/admin/newsletter/campaigns/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete campaign");
}

export function campaignToDraft(campaign: Campaign): CampaignDraft {
  return {
    id: campaign.id,
    name: campaign.name,
    audience: campaign.audience,
    subject: campaign.subject,
    previewText: campaign.previewText,
    senderName: "Eleanor Vance",
    senderEmail: "atelier@bloomstem.com",
    blocks: emptyCampaignDraft().blocks,
  };
}

export function exportSubscribersCSV(items: Subscriber[]): string {
  const quote = (value: string) => `"${value.replaceAll('"', '""')}"`;
  return [
    "Name,Email,Segment,Consent,Source,Joined,Status",
    ...items.map((item) =>
      [item.name, item.email, segmentLabels[item.segment], item.consent, item.source, item.joined, item.status]
        .map(quote)
        .join(",")
    ),
  ].join("\n");
}
