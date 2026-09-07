"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CustomerDetailContent } from "@/components/admin/customers/detail";
import { CustomerDetailError, CustomerDetailNotFound, CustomerDetailSkeleton } from "@/components/admin/customers/detail-states";
import { AdminCustomer, fetchAdminCustomer } from "@/lib/admin-customers";

export default function CustomerDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [customer, setCustomer] = useState<AdminCustomer | null | undefined>(undefined);
  const [error, setError] = useState(false);

  const load = () => {
    setError(false);
    setCustomer(undefined);
    fetchAdminCustomer(id).then(setCustomer).catch(() => setError(true));
  };

  useEffect(() => {
    fetchAdminCustomer(id).then(setCustomer).catch(() => setError(true));
  }, [id]);

  if (error) return <CustomerDetailError onRetry={load} />;
  if (customer === undefined) return <CustomerDetailSkeleton />;
  if (customer === null) return <CustomerDetailNotFound />;
  return <CustomerDetailContent customer={customer} />;
}
