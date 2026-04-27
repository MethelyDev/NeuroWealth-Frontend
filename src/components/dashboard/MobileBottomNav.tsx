"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardNavigation } from "@/lib/routeMetadata";
import { cn } from "@/lib/utils";

// Mobile bottom nav — visible only below 640px (sm breakpoint).
// Design spec (issue #76):
//   • Touch targets: min-h-[44px], min-w-[44px] per item
//   • Active state: text-primary + bolder icon stroke + aria-current="page"

export default function MobileBottomNav() {
  const pathname = usePathname();

  function isActive(href: string, exact: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <nav
      className="sm:hidden fixed bottom-0 inset-x-0 z-30 bg-surface border-t border-surface-border"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Mobile navigation"
    >
      <ul className="flex items-stretch justify-around h-16" role="list">
        {dashboardNavigation.map(({ href, mobileLabel, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <li key={href} className="flex-1 flex">
              <Link
                href={href}
                // 44px height + full flex width satisfies 44px touch target spec
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2 w-full",
                  "text-xs font-medium transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset",
                  active
                    ? "text-primary"
                    : "text-text-muted hover:text-text-secondary"
                )}
                aria-current={active ? "page" : undefined}
                aria-label={mobileLabel}
              >
                <Icon
                  className={cn(
                    "w-5 h-5",
                    active ? "stroke-[2.25]" : "stroke-[1.75]"
                  )}
                  aria-hidden="true"
                />
                <span>{mobileLabel}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
