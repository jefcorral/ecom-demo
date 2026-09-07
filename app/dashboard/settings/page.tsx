"use client";

import { useEffect, useState } from "react";
import { SettingsContent } from "@/components/admin/settings/content";
import { SettingsError, SettingsSkeleton } from "@/components/admin/settings/states";
import { AdminSettings, fetchAdminSettings } from "@/lib/admin-settings";

export default function SettingsPage() {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [error, setError] = useState(false);

  const load = () => {
    setSettings(null);
    setError(false);
    fetchAdminSettings().then(setSettings).catch(() => setError(true));
  };

  useEffect(() => {
    fetchAdminSettings().then(setSettings).catch(() => setError(true));
  }, []);

  if (error) return <SettingsError onRetry={load} />;
  if (!settings) return <SettingsSkeleton />;
  return <SettingsContent initialSettings={settings} />;
}
