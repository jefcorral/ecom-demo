"use client";

import { useEffect, useState } from "react";
import { CustomersContent } from "@/components/admin/customers/content";
import { CustomersError, CustomersSkeleton } from "@/components/admin/customers/states";
import { AdminCustomer, fetchAdminCustomers } from "@/lib/admin-customers";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<AdminCustomer[] | null>(null);
  const [error, setError] = useState(false);

  const load = () => {
    setError(false);
    setCustomers(null);
    fetchAdminCustomers().then(setCustomers).catch(() => setError(true));
  };

  useEffect(() => {
    fetchAdminCustomers().then(setCustomers).catch(() => setError(true));
  }, []);

  if (error) return <CustomersError onRetry={load} />;
  if (!customers) return <CustomersSkeleton />;
  return <CustomersContent customers={customers} />;
}
