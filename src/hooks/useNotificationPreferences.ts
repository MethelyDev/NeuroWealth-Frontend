import { useState } from "react";
import { NotificationPreferences, DEFAULT_PREFERENCES } from "@/lib/mock-preferences";
import { STORAGE_KEYS } from "@/lib/storage-keys";

const NOTIFICATION_PREFERENCES_STORAGE_KEY = STORAGE_KEYS.NOTIFICATIONS;

export function useNotificationPreferences() {
  const [preferences, setPreferences] = useState<NotificationPreferences>(() => {
    if (typeof window === "undefined") return DEFAULT_PREFERENCES;
    const stored = localStorage.getItem(NOTIFICATION_PREFERENCES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_PREFERENCES;
  });
  const [loading] = useState(false);

  const updatePreference = (
    section: "categories" | "channels",
    key: string,
    value: boolean
  ) => {
    const updated = {
      ...preferences,
      [section]: {
        ...preferences[section],
        [key]: value,
      },
    };
    setPreferences(updated);
    localStorage.setItem(
      NOTIFICATION_PREFERENCES_STORAGE_KEY,
      JSON.stringify(updated),
    );
  };

  return {
    preferences,
    loading,
    updatePreference,
  };
}
