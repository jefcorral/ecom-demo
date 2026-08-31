import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function WishlistPage() {
  return <EmptyState icon={Heart} title="No favorites yet" description="Save the bouquets you love by tapping the heart icon." action={<Button render={<Link href="/products" />} className="w-full sm:w-auto">Browse Bouquets</Button>} />;
}
