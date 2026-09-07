"use client";

import { useEffect, useState } from "react";
import { StorefrontContentEditor } from "@/components/admin/content/content";
import { ContentError, ContentSkeleton } from "@/components/admin/content/states";
import { StorefrontContentData, fetchStorefrontContent } from "@/lib/admin-content";

export default function ContentPage() {
  const [data, setData] = useState<StorefrontContentData | null>(null);
  const [error, setError] = useState(false);

  const load = () => {
    setData(null);
    setError(false);
    fetchStorefrontContent().then(setData).catch(() => setError(true));
  };

  useEffect(() => {
    fetchStorefrontContent().then(setData).catch(() => setError(true));
  }, []);

  if (error) return <ContentError onRetry={load} />;
  if (!data) return <ContentSkeleton />;
  return <StorefrontContentEditor initialData={data} />;
}
