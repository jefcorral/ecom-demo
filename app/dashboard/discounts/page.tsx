import { DiscountsContent } from "@/components/admin/discounts/content";
import { fetchDiscounts } from "@/lib/admin-discounts";

export default async function DiscountsPage() {
  const discounts = await fetchDiscounts();
  return <DiscountsContent discounts={discounts} />;
}
