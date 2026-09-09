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

export interface RatingDistribution { star: number; count: number; percentage: number; }

const photos = [
  "https://images.unsplash.com/photo-1563241527-3004b7be025f?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=200&h=200&fit=crop",
];

const reviews: Review[] = [
  { id: "rev-1", customer: "Lady Camilla Fox", initials: "CF", email: "camilla.fox@kensington.co.uk", rating: 5, title: "Utterly divine arrangement", body: "The Juliet bouquet arrived in perfect condition and lasted nearly two weeks. The scent was exquisite.", productId: "prod-1", productName: "The Juliet", productImage: "https://images.unsplash.com/photo-1563241527-3004b7be025f?w=200&h=200&fit=crop", orderRef: "ORD-9241", verified: true, submittedAt: "2024-10-21T14:30:00Z", photos: [], status: "pending" },
  { id: "rev-2", customer: "Julian Thorne", initials: "JT", email: "j.thorne@archdigest.com", rating: 4, title: "Elegant, but one stem faded early", body: "Overall a beautiful seasonal edit. One anthurium browned faster than expected, but the team offered a thoughtful replacement.", productId: "prod-2", productName: "Morning Sun", productImage: "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=200&h=200&fit=crop", orderRef: "ORD-9182", verified: true, submittedAt: "2024-10-20T09:15:00Z", photos: [photos[0]], status: "pending" },
  { id: "rev-3", customer: "Beatrice Montrose", initials: "BM", email: "beatrice@montrose-estate.org", rating: 5, title: "A work of art", body: "The atelier understood the brief perfectly. The arrangement looked like a Dutch still life come to life.", productId: "prod-3", productName: "Pure Elegance", productImage: "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=200&h=200&fit=crop", orderRef: "ORD-9055", verified: true, submittedAt: "2024-10-18T16:45:00Z", photos: [], status: "published", staffReply: { author: "Eleanor Vance", text: "Thank you for the kind words, Beatrice. We’re delighted the arrangement felt like a still life.", date: "2024-10-19T10:00:00Z" } },
  { id: "rev-4", customer: "Henri Duprès", initials: "HD", email: "henri.dupres@artisan-fleurs.fr", rating: 2, title: "Disappointing delivery window", body: "The blooms were stunning, but the courier arrived well outside the chosen two-hour slot.", productId: "prod-4", productName: "Wild Meadow", productImage: "https://images.unsplash.com/photo-1487530811176-3780de880c0d?w=200&h=200&fit=crop", orderRef: "ORD-8999", verified: true, submittedAt: "2024-10-15T11:20:00Z", photos: [], status: "flagged", moderationReason: "Delivery complaint escalated" },
  { id: "rev-5", customer: "Clara Sterling", initials: "CS", email: "c.sterling@mayfairpartners.com", rating: 5, title: "My go-to for client gifts", body: "Impeccable presentation and the handwritten note was a lovely touch.", productId: "prod-5", productName: "Monstera Deliciosa", productImage: "https://images.unsplash.com/photo-1614594975525-e45890e2e126?w=200&h=200&fit=crop", orderRef: "ORD-8820", verified: true, submittedAt: "2024-10-12T13:00:00Z", photos: [], status: "published" },
  { id: "rev-6", customer: "Noah Williams", initials: "NW", email: "noah@example.com", rating: 3, title: "Pretty but pricey", body: "Lovely arrangement, though I expected a little more volume for the cost.", productId: "prod-1", productName: "The Juliet", productImage: "https://images.unsplash.com/photo-1563241527-3004b7be025f?w=200&h=200&fit=crop", orderRef: "ORD-8710", verified: true, submittedAt: "2024-10-08T17:30:00Z", photos: [], status: "hidden", moderationReason: "Customer requested removal" },
  { id: "rev-7", customer: "Amelia Hart", initials: "AH", email: "amelia@hartstudio.com", rating: 5, title: "The peonies were perfection", body: "Fragrant, full, and exactly the right shade of blush. Worth every penny.", productId: "prod-6", productName: "Candle & Bloom Box", productImage: "https://images.unsplash.com/photo-1602607688737-42708318dc64?w=200&h=200&fit=crop", orderRef: "ORD-8644", verified: true, submittedAt: "2024-10-05T08:45:00Z", photos: [photos[1]], status: "published", staffReply: { author: "Eleanor Vance", text: "We’re so glad the peonies matched your vision, Amelia.", date: "2024-10-06T09:30:00Z" } },
  { id: "rev-8", customer: "Oliver Bennett", initials: "OB", email: "oliver.bennett@example.com", rating: 1, title: "Never arrived", body: "Order was marked delivered but never reached our reception. Still waiting for a refund.", productId: "prod-7", productName: "Spring Awakening", productImage: "https://images.unsplash.com/photo-1525310072745-f49212b5ac82?w=200&h=200&fit=crop", orderRef: "ORD-8501", verified: true, submittedAt: "2024-09-28T15:10:00Z", photos: [], status: "flagged", moderationReason: "Missing order investigation" },
  { id: "rev-9", customer: "Sophia Laurent", initials: "SL", email: "sophia@laurent-design.com", rating: 4, title: "Chic and understated", body: "Beautiful minimalist styling. The ceramic vessel was a particularly nice touch.", productId: "prod-8", productName: "Tulip Field", productImage: "https://images.unsplash.com/photo-1559563458-527698bf5295?w=200&h=200&fit=crop", orderRef: "ORD-8422", verified: true, submittedAt: "2024-09-25T12:00:00Z", photos: [], status: "pending" },
  { id: "rev-10", customer: "Marcus Chen", initials: "MC", email: "marcus.chen@example.com", rating: 5, title: "Best subscription yet", body: "The seasonal subscription keeps getting better. This month’s palette is breathtaking.", productId: "prod-9", productName: "Muted Majesty", productImage: "https://images.unsplash.com/photo-1562690868-60bbe4fc8154?w=200&h=200&fit=crop", orderRef: "ORD-8300", verified: true, submittedAt: "2024-09-20T10:30:00Z", photos: [], status: "published" },
];

export function computeMetrics(items: Review[]): ReviewMetrics {
  const total = items.length;
  const sum = items.reduce((acc, item) => acc + item.rating, 0);
  const awaiting = items.filter((item) => item.status === "pending").length;
  const responded = items.filter((item) => item.staffReply).length;
  return { averageRating: total ? sum / total : 0, totalReviews: total, awaitingReview: awaiting, responseRate: total ? responded / total : 0 };
}

export function computeDistribution(items: Review[]): RatingDistribution[] {
  const counts = [5, 4, 3, 2, 1].map((star) => ({ star, count: items.filter((item) => item.rating === star).length }));
  const total = items.length || 1;
  return counts.map(({ star, count }) => ({ star, count, percentage: Math.round((count / total) * 100) }));
}

export async function fetchReviews(): Promise<Review[]> { await new Promise((resolve) => setTimeout(resolve, 400)); return structuredClone(reviews); }
export async function approveReview(id: string): Promise<Review> { await new Promise((resolve) => setTimeout(resolve, 300)); const review = reviews.find((item) => item.id === id); if (!review) throw new Error("Review not found"); review.status = "published"; review.moderationReason = undefined; return structuredClone(review); }
export async function hideReview(id: string, reason: string): Promise<Review> { await new Promise((resolve) => setTimeout(resolve, 300)); const review = reviews.find((item) => item.id === id); if (!review) throw new Error("Review not found"); review.status = "hidden"; review.moderationReason = reason; return structuredClone(review); }
export async function flagReview(id: string, reason: string): Promise<Review> { await new Promise((resolve) => setTimeout(resolve, 300)); const review = reviews.find((item) => item.id === id); if (!review) throw new Error("Review not found"); review.status = "flagged"; review.moderationReason = reason; return structuredClone(review); }
export async function publishReply(id: string, text: string): Promise<Review> { await new Promise((resolve) => setTimeout(resolve, 350)); const review = reviews.find((item) => item.id === id); if (!review) throw new Error("Review not found"); review.staffReply = { author: "Eleanor Vance", text, date: new Date().toISOString() }; return structuredClone(review); }
