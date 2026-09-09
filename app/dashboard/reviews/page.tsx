import { ReviewsContent } from "@/components/admin/reviews/content";
import { fetchReviews } from "@/lib/admin-reviews";

export default async function ReviewsPage() {
  const reviews = await fetchReviews();
  return <ReviewsContent reviews={reviews} />;
}
