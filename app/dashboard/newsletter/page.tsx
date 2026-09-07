import { NewsletterContent } from "@/components/admin/newsletter/content";
import { fetchNewsletterData } from "@/lib/admin-newsletter";

export default async function NewsletterPage() {
  const data = await fetchNewsletterData();
  return <NewsletterContent data={data} />;
}
