"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Bell, Mail, Save, ShieldAlert, X } from "lucide-react";
import { useToast } from "@/components/notifications/ToastProvider";
import { useI18n } from "@/contexts/I18nContext";

export const dynamic = "force-dynamic";
import { Button, Card, InlineBanner } from "@/components/ui";
import { SettingsSectionSkeleton } from "@/components/ui/Skeleton";
import { mockAuditService } from "@/lib/mock-audit";

interface NotificationPreferences {
  emailNotifications: boolean;
  transactionAlerts: boolean;
  weeklyDigest: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
}

const STORAGE_KEY = "nw_notifications";
const DEFAULT_PREFERENCES: NotificationPreferences = {
  emailNotifications: true,
  transactionAlerts: true,
  weeklyDigest: true,
  marketingEmails: false,
  securityAlerts: true,
};

function PreferenceToggle({
  id,
  title,
  description,
  checked,
  disabled,
  onChange,
}: {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  disabled: boolean;
  onChange: () => void;
}) {
  return (
    <label
      htmlFor={id}
      className={`flex items-start justify-between gap-4 rounded-xl border border-slate-700/50 bg-slate-950/35 p-4 transition ${
        disabled ? "opacity-65" : "hover:border-slate-600"
      }`}
    >
      <div>
        <p className="text-sm font-semibold text-slate-100">{title}</p>
        <p className="mt-1 text-sm leading-6 text-slate-400">{description}</p>
      </div>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-900 text-sky-400 accent-sky-400"
      />
    </label>
  );
}

export default function NotificationsSettingsPage() {
  const { pushToast } = useToast();
  const { messages } = useI18n();
  const t = messages.settings.notifications;
  const [saved, setSaved] = useState(DEFAULT_PREFERENCES);
  const [draft, setDraft] = useState(DEFAULT_PREFERENCES);
  const [editing, setEditing] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as NotificationPreferences;
          setSaved(parsed);
          setDraft(parsed);
        }
      } catch {
        // Keep defaults if storage is invalid.
      } finally {
        setPageLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (pageLoading) {
    return <SettingsSectionSkeleton rows={5} />;
  }

  const isDirty = JSON.stringify(draft) !== JSON.stringify(saved);
  const enabledCount = Object.values(draft).filter(Boolean).length;

  const togglePreference = (key: keyof NotificationPreferences) => {
    setDraft((current) => ({ ...current, [key]: !current[key] }));
  };

  const handleCancel = () => {
    setDraft(saved);
    setEditing(false);
    setStatus("idle");
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus("idle");

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (!draft.securityAlerts) {
        throw new Error("Security alerts must stay enabled in this mock.");
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      setSaved(draft);
      setEditing(false);
      setStatus("success");
      mockAuditService.logEvent("settings_change", { section: "notifications", changes: draft });
      pushToast({
        variant: "success",
        title: t.toast.savedTitle,
        description: t.toast.savedDesc,
        duration: 4000,
      });
    } catch {
      setStatus("error");
      pushToast({
        variant: "error",
        title: t.toast.failTitle,
        description: t.toast.failDesc,
        duration: 6000,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-100">{t.title}</h1>
        <p className="text-sm text-slate-400">{t.subtitle}</p>
      </div>

      <InlineBanner
        variant="info"
        eyebrow="Page Message"
        title="Inline banners are now reusable across settings and workflow pages"
        action={
          <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
            Edit
          </Button>
        }
      >
        Page-level messages use semantic variants, accessible announcements, and consistent spacing.
      </InlineBanner>

      {status === "success" ? (
        <InlineBanner variant="success" title={t.banner.savedTitle}>
          The changes were persisted locally and announced through the global toast queue.
        </InlineBanner>
      ) : null}

      {status === "error" ? (
        <InlineBanner
          variant="error"
          title={t.banner.failTitle}
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                if (!draft.securityAlerts) {
                  togglePreference("securityAlerts");
                }
              }}
            >
              {t.actions.restoreAlerts}
            </Button>
          }
        >
          This mocked failure path intentionally blocks saving while security alerts are disabled.
        </InlineBanner>
      ) : null}

      {!draft.securityAlerts ? (
        <InlineBanner variant="warning" title={t.securityAlertsOff.title}>
          {t.securityAlertsOff.desc}
        </InlineBanner>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
        <Card className="space-y-6 border-slate-700/50 bg-dark-800/70">
          <div className="flex items-start gap-3">
            <div className="rounded-xl border border-sky-400/25 bg-sky-500/10 p-2 text-sky-300">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-100">{t.channels.title}</h2>
              <p className="mt-1 text-sm text-slate-400">{t.channels.desc}</p>
            </div>
          </div>

          <div className="space-y-3">
            <PreferenceToggle
              id="email-notifications"
              title={t.channels.emailTitle}
              description={t.channels.emailDesc}
              checked={draft.emailNotifications}
              disabled={!editing}
              onChange={() => togglePreference("emailNotifications")}
            />
            <PreferenceToggle
              id="transaction-alerts"
              title={t.channels.transactionTitle}
              description={t.channels.transactionDesc}
              checked={draft.transactionAlerts}
              disabled={!editing || !draft.emailNotifications}
              onChange={() => togglePreference("transactionAlerts")}
            />
            <PreferenceToggle
              id="weekly-digest"
              title={t.channels.weeklyTitle}
              description={t.channels.weeklyDesc}
              checked={draft.weeklyDigest}
              disabled={!editing || !draft.emailNotifications}
              onChange={() => togglePreference("weeklyDigest")}
            />
            <PreferenceToggle
              id="marketing-emails"
              title={t.channels.productTitle}
              description={t.channels.productDesc}
              checked={draft.marketingEmails}
              disabled={!editing || !draft.emailNotifications}
              onChange={() => togglePreference("marketingEmails")}
            />
            <PreferenceToggle
              id="security-alerts"
              title={t.channels.securityTitle}
              description={t.channels.securityDesc}
              checked={draft.securityAlerts}
              disabled={!editing}
              onChange={() => togglePreference("securityAlerts")}
            />
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="space-y-4 border-slate-700/50 bg-dark-800/70">
            <div className="flex items-start gap-3">
              <div className="rounded-xl border border-sky-400/25 bg-sky-500/10 p-2 text-sky-300">
                <Bell className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-100">{t.summary.title}</h2>
                <p className="mt-1 text-sm text-slate-400">{t.summary.desc}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-slate-700/50 bg-slate-950/35 px-4 py-3 text-sm">
                <span className="text-slate-300">{t.summary.enabledPreferences}</span>
                <span className="font-semibold text-sky-300">{enabledCount} / 5</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-700/50 bg-slate-950/35 px-4 py-3 text-sm">
                <span className="text-slate-300">{t.summary.emailChannel}</span>
                <span className="font-semibold text-slate-100">
                  {draft.emailNotifications ? t.summary.active : t.summary.muted}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-700/50 bg-slate-950/35 px-4 py-3 text-sm">
                <span className="text-slate-300">{t.summary.securityCoverage}</span>
                <span
                  className={
                    draft.securityAlerts
                      ? "font-semibold text-emerald-300"
                      : "font-semibold text-amber-300"
                  }
                >
                  {draft.securityAlerts ? t.summary.protected : t.summary.atRisk}
                </span>
              </div>
            </div>
          </Card>

          <Card className="space-y-3 border-slate-700/50 bg-dark-800/70">
            <div className="flex items-start gap-3">
              <div className="rounded-xl border border-amber-400/25 bg-amber-500/10 p-2 text-amber-300">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-100">{t.saveBehavior.title}</h2>
                <p className="mt-1 text-sm text-slate-400">{t.saveBehavior.desc}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {!editing ? (
        <div>
          <Button variant="secondary" onClick={() => setEditing(true)}>
            {t.actions.edit}
          </Button>
        </div>
      ) : (
        <div
          className="sticky bottom-6 z-40 flex flex-col gap-3 rounded-2xl border border-slate-700/60 bg-slate-950/90 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur md:flex-row md:items-center md:justify-between"
          role="group"
          aria-label="Notification settings actions"
        >
          <div className="flex items-center gap-2 text-sm text-amber-300">
            <AlertCircle className="h-4 w-4" />
            <span>{isDirty ? t.actions.unsaved : t.actions.noPending}</span>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="ghost" onClick={handleCancel} disabled={saving}>
              <X className="h-4 w-4" />
              {t.actions.cancel}
            </Button>
            <Button onClick={handleSave} disabled={saving || !isDirty} aria-busy={saving}>
              <Save className="h-4 w-4" />
              {saving ? t.actions.saving : t.actions.save}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
