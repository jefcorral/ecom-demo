"use client";

import { useEffect, useState } from "react";
import { StaffContent } from "@/components/admin/staff/content";
import { StaffError, StaffSkeleton } from "@/components/admin/staff/states";
import { StaffDirectory, fetchStaffDirectory } from "@/lib/admin-staff";

export default function StaffPage() {
  const [directory, setDirectory] = useState<StaffDirectory | null>(null);
  const [error, setError] = useState(false);

  const load = () => {
    setDirectory(null);
    setError(false);
    fetchStaffDirectory().then(setDirectory).catch(() => setError(true));
  };

  useEffect(() => {
    fetchStaffDirectory().then(setDirectory).catch(() => setError(true));
  }, []);

  if (error) return <StaffError onRetry={load} />;
  if (!directory) return <StaffSkeleton />;
  return <StaffContent directory={directory} />;
}
