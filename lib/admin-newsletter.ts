export type SubscriberSegment = "all" | "vip" | "seasonal" | "new" | "lapsed";
export type CampaignStatus = "draft" | "scheduled" | "sent" | "archived";

export interface Subscriber { id: string; name: string; initials: string; email: string; segment: Exclude<SubscriberSegment, "all">; consent: string; source: string; joined: string; status: "active" | "unsubscribed"; }
export interface Campaign { id: string; name: string; audience: Exclude<SubscriberSegment, "all"> | "all"; status: CampaignStatus; date: string; delivered?: number; openRate?: number; clickRate?: number; conversions?: number; revenue?: number; subject: string; previewText: string; }
export interface CampaignDraft { id?: string; name: string; audience: Campaign["audience"]; subject: string; previewText: string; senderName: string; senderEmail: string; blocks: { id: string; type: "hero" | "heading" | "text" | "products" | "button" | "divider"; label: string }[]; }
export interface NewsletterData { subscribers: Subscriber[]; campaigns: Campaign[]; }

export const segmentLabels: Record<SubscriberSegment, string> = { all: "All Subscribers", vip: "VIP Clients", seasonal: "Seasonal Buyers", new: "New Customers", lapsed: "Lapsed Customers" };
export const segmentCounts: Record<SubscriberSegment, number> = { all: 24850, vip: 1840, seasonal: 8920, new: 3150, lapsed: 940 };

const subscribers: Subscriber[] = [
  { id: "sub-8804", name: "Lady Camilla Fox", initials: "CF", email: "camilla.fox@kensington.co.uk", segment: "vip", consent: "Confirmed opt-in", source: "Chelsea Boutique Flagship", joined: "Oct 22, 2024", status: "active" },
  { id: "sub-8803", name: "Julian Thorne", initials: "JT", email: "j.thorne@archdigest.com", segment: "seasonal", consent: "Confirmed opt-in", source: "Editorial Lookbook", joined: "Oct 21, 2024", status: "active" },
  { id: "sub-8802", name: "Beatrice Montrose", initials: "BM", email: "beatrice@montrose-estate.org", segment: "vip", consent: "Confirmed opt-in", source: "Private Client Dossier", joined: "Oct 19, 2024", status: "active" },
  { id: "sub-8801", name: "Henri Duprès", initials: "HD", email: "henri.dupres@artisan-fleurs.fr", segment: "seasonal", consent: "Single opt-in", source: "Checkout Guest Flow", joined: "Oct 18, 2024", status: "active" },
  { id: "sub-8800", name: "Clara Sterling", initials: "CS", email: "c.sterling@mayfairpartners.com", segment: "new", consent: "Confirmed opt-in", source: "Instagram Campaign", joined: "Oct 17, 2024", status: "active" },
  { id: "sub-8799", name: "Noah Williams", initials: "NW", email: "noah@example.com", segment: "lapsed", consent: "Confirmed opt-in", source: "Website Footer", joined: "Aug 12, 2024", status: "active" },
  { id: "sub-8798", name: "Amelia Hart", initials: "AH", email: "amelia@hartstudio.com", segment: "vip", consent: "Confirmed opt-in", source: "Atelier Event", joined: "Jul 30, 2024", status: "active" },
];

const campaigns: Campaign[] = [
  { id: "campaign-1", name: "Autumn Atelier Preview", audience: "seasonal", status: "sent", date: "Oct 14, 2024", delivered: 10698, openRate: 54.2, clickRate: 18.6, conversions: 4.8, revenue: 34280, subject: "Autumn Atelier: Private seasonal preview", previewText: "Explore a limited release of sculptural autumn botanicals." },
  { id: "campaign-2", name: "Mother’s Day Early Access", audience: "vip", status: "sent", date: "Mar 24, 2024", delivered: 1838, openRate: 68.1, clickRate: 28.4, conversions: 11.2, revenue: 52400, subject: "A private Mother’s Day floral allocation", previewText: "Reserve heirloom peonies before the public release." },
  { id: "campaign-3", name: "VIP Peony Reserve 2025", audience: "vip", status: "scheduled", date: "Tomorrow at 09:00 BST", subject: "The VIP Peony Reserve is opening", previewText: "Your private allocation of Dutch garden peonies awaits." },
  { id: "campaign-4", name: "Orchid Care Journal & Wintering", audience: "all", status: "draft", date: "Edited 2h ago by Eleanor Vance", subject: "How to winter your rare orchids", previewText: "The atelier’s guide to humidity, light, and winter dormancy." },
  { id: "campaign-5", name: "Spring Subscription Renewal", audience: "seasonal", status: "scheduled", date: "May 01, 2025", subject: "Your spring botanical subscription", previewText: "Renew your seasonal stem allocation for spring." },
  { id: "campaign-6", name: "Winter Wreath Archive", audience: "all", status: "archived", date: "Dec 20, 2023", delivered: 22100, openRate: 42.4, clickRate: 12.8, conversions: 3.2, revenue: 19400, subject: "Winter wreath collection", previewText: "Hand-woven winter foliage from the atelier." },
];

export function emptyCampaignDraft(): CampaignDraft { return { name: "", audience: "vip", subject: "", previewText: "", senderName: "Eleanor Vance", senderEmail: "atelier@bloomstem.com", blocks: [{ id: "block-1", type: "hero", label: "Hero Image" }, { id: "block-2", type: "heading", label: "Botanical Heading" }, { id: "block-3", type: "text", label: "Rich Text Narrative" }, { id: "block-4", type: "products", label: "Curated Stems Grid" }, { id: "block-5", type: "button", label: "Primary Action Pill" }] }; }
function delay(ms: number) { return new Promise<void>((resolve) => setTimeout(resolve, ms)); }

export async function fetchNewsletterData(): Promise<NewsletterData> { await delay(450); return { subscribers: structuredClone(subscribers), campaigns: structuredClone(campaigns) }; }
export async function saveCampaignDraft(draft: CampaignDraft): Promise<Campaign> { await delay(350); const campaign: Campaign = { id: draft.id ?? `campaign-${Date.now()}`, name: draft.name, audience: draft.audience, status: "draft", date: "Edited just now by Eleanor Vance", subject: draft.subject, previewText: draft.previewText }; const index = campaigns.findIndex((item) => item.id === campaign.id); if (index >= 0) campaigns[index] = campaign; else campaigns.unshift(campaign); return campaign; }
export async function scheduleCampaign(draft: CampaignDraft, date: string): Promise<Campaign> { await delay(400); const campaign = await saveCampaignDraft(draft); campaign.status = "scheduled"; campaign.date = date; return campaign; }
export async function sendCampaign(draft: CampaignDraft): Promise<Campaign> { await delay(500); const campaign = await saveCampaignDraft(draft); campaign.status = "sent"; campaign.date = "Sent just now"; campaign.delivered = segmentCounts[draft.audience]; campaign.openRate = 0; campaign.clickRate = 0; campaign.conversions = 0; campaign.revenue = 0; return campaign; }
export async function sendTestCampaign(_draft: CampaignDraft, email: string): Promise<void> { await delay(400); if (!email.includes("@")) throw new Error("Invalid test email"); }
export async function archiveCampaign(id: string): Promise<void> { await delay(250); const campaign = campaigns.find((item) => item.id === id); if (campaign) { campaign.status = "archived"; campaign.date = "Archived just now"; } }
export async function deleteCampaign(id: string): Promise<void> { await delay(250); const index = campaigns.findIndex((item) => item.id === id); if (index >= 0) campaigns.splice(index, 1); }
export function campaignToDraft(campaign: Campaign): CampaignDraft { return { name: campaign.name, audience: campaign.audience, subject: campaign.subject, previewText: campaign.previewText, senderName: "Eleanor Vance", senderEmail: "atelier@bloomstem.com", blocks: emptyCampaignDraft().blocks }; }
export function exportSubscribersCSV(items: Subscriber[]): string { const quote = (value: string) => `"${value.replaceAll('"', '""')}"`; return ["Name,Email,Segment,Consent,Source,Joined,Status", ...items.map((item) => [item.name, item.email, segmentLabels[item.segment], item.consent, item.source, item.joined, item.status].map(quote).join(","))].join("\n"); }
