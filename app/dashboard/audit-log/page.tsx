"use client";

import { useEffect, useState } from "react";
import { AuditLogContent } from "@/components/admin/audit-log/content";
import { AuditLogError, AuditLogSkeleton } from "@/components/admin/audit-log/states";
import { AuditEvent, fetchAuditEvents } from "@/lib/admin-audit-log";

export default function AuditLogPage() {
  const [events, setEvents] = useState<AuditEvent[] | null>(null);
  const [error, setError] = useState(false);

  const load = () => {
    setEvents(null);
    setError(false);
    fetchAuditEvents().then(setEvents).catch(() => setError(true));
  };

  useEffect(() => {
    fetchAuditEvents().then(setEvents).catch(() => setError(true));
  }, []);

  if (error) return <AuditLogError onRetry={load} />;
  if (!events) return <AuditLogSkeleton />;
  return <AuditLogContent events={events} />;
}
