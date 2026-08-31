import Link from "next/link";
import { ArrowLeft, Flower2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return <EmptyState icon={Flower2} title="Oops, this page isn't in bloom" description="The page you're looking for may have been moved or no longer exists." action={<Button render={<Link href="/" />} className="w-full sm:w-auto"><ArrowLeft className="size-4" />Back to Home</Button>} secondaryAction={<Button render={<Link href="/products" />} variant="ghost" className="w-full sm:w-auto">Search for something</Button>} />;
}
