import React from "react";
import { Notification } from "@/lib/mock-notifications";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { analytics } from "@/lib/analytics";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

export function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const { id, title, message, timestamp, status, isRead, action } = notification;

  const statusIcons: Record<string, string> = {
    info: "🔵",
    success: "🟢",
    warning: "🟡",
    error: "🔴",
  };

  const formattedDate = new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`
        relative p-4 flex flex-col gap-2 transition-colors hover:bg-white/5
        ${!isRead ? "border-l-2 border-brand-400 bg-brand-400/5" : "border-l-2 border-transparent"}
      `}
      onClick={() => {
        if (!isRead) {
          onMarkAsRead(id);
          analytics.track("notification_read", { id });
        }
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span>{statusIcons[status]}</span>
          <h4 className={`text-sm font-semibold ${!isRead ? "text-white" : "text-slate-300"}`}>
            {title}
          </h4>
        </div>
        <span className="text-[10px] text-slate-500">{formattedDate}</span>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed">{message}</p>
      {action && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-1 w-fit text-[10px] px-2 py-1 h-auto border border-slate-700 hover:border-slate-500"
          onClick={(e) => {
            e.stopPropagation();
            window.location.href = action.href;
          }}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
