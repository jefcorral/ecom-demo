import { fetchApi } from "@/lib/api";

export type ReviewStatus = "pending" | "published" | "hidden" | "flagged";

export interface Review {
  id: string;
  customer: string;
  initials: string;
  email: string;
  rating: number;
  title: string;
  body: string;
  productId: string;
  productName: string;
  productImage: string;
  orderRef: string;
  verified: boolean;
  submittedAt: string;
  photos: string[];
  status: ReviewStatus;
  staffReply?: { author: string; text: string; date: string };
  moderationReason?: string;
}

export interface ReviewMetrics {
  averageRating: number;
  totalReviews: number;
  awaitingReview: number;
  responseRate: number;
}

export interface RatingDistribution {
  star: number;
  count: number;
  percentage: number;
}

export async function fetchReviews(): Promise<Review[]> {
  const res = await fetchApi("/admin/reviews");
  if (!res.ok) throw new Error("Failed to load reviews");
  const data = (await res.json()) as { data: Review[] };
  return data.data;
}

export async function fetchReviewMetrics(): Promise<ReviewMetrics> {
  const res = await fetchApi("/admin/reviews/metrics");
  if (!res.ok) throw new Error("Failed to load review metrics");
  return (await res.json()) as ReviewMetrics;
}

export async function fetchReviewDistribution(): Promise<RatingDistribution[]> {
  const res = await fetchApi("/admin/reviews/distribution");
  if (!res.ok) throw new Error("Failed to load review distribution");
  return (await res.json()) as RatingDistribution[];
}

export async function approveReview(id: string): Promise<Review> {
  const res = await fetchApi(`/admin/reviews/${id}/approve`, {
    method: "PATCH",
    body: JSON.stringify({}),
  });
  if (!res.ok) throw new Error("Failed to approve review");
  return (await res.json()) as Review;
}

export async function hideReview(id: string, reason: string): Promise<Review> {
  const res = await fetchApi(`/admin/reviews/${id}/hide`, {
    method: "PATCH",
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) throw new Error("Failed to hide review");
  return (await res.json()) as Review;
}

export async function flagReview(id: string, reason: string): Promise<Review> {
  const res = await fetchApi(`/admin/reviews/${id}/flag`, {
    method: "PATCH",
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) throw new Error("Failed to flag review");
  return (await res.json()) as Review;
}

export async function publishReply(id: string, text: string): Promise<Review> {
  const res = await fetchApi(`/admin/reviews/${id}/reply`, {
    method: "POST",
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error("Failed to publish reply");
  return (await res.json()) as Review;
}

export function computeMetrics(items: Review[]): ReviewMetrics {
  const total = items.length;
  const sum = items.reduce((acc, item) => acc + item.rating, 0);
  const awaiting = items.filter((item) => item.status === "pending").length;
  const responded = items.filter((item) => item.staffReply).length;
  return {
    averageRating: total ? sum / total : 0,
    totalReviews: total,
    awaitingReview: awaiting,
    responseRate: total ? responded / total : 0,
  };
}

export function computeDistribution(items: Review[]): RatingDistribution[] {
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: items.filter((item) => item.rating === star).length,
  }));
  const total = items.length || 1;
  return counts.map(({ star, count }) => ({
    star,
    count,
    percentage: Math.round((count / total) * 100),
  }));
}
