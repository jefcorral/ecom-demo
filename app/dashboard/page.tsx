"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchAdminDashboard, AdminDashboardData, isDashboardEmpty } from "@/lib/admin-dashboard";
import { DashboardSkeleton } from "@/components/admin/dashboard/skeleton";
import { DashboardEmpty } from "@/components/admin/dashboard/empty";
import { DashboardError } from "@/components/admin/dashboard/error";
import { DashboardContent } from "@/components/admin/dashboard/content";

export default function DashboardPage() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [retryKey, setRetryKey] = useState(0);

  const handleRetry = useCallback(() => {
    setLoading(true);
    setRetryKey((key) => key + 1);
  }, []);

  useEffect(() => {
    fetchAdminDashboard()
      .then((dashboard) => setData(dashboard))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [retryKey]);

  if (loading) return <DashboardSkeleton />;
  if (!data || data.stats === null) return <DashboardError onRetry={handleRetry} />;
  if (isDashboardEmpty(data)) return <DashboardEmpty />;
  return <DashboardContent data={data} />;
}
