import React from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertTriangle,
  Bell,
  Blocks,
  BookOpenText,
  Gauge,
  History,
  LayoutDashboard,
  LogIn,
  Newspaper,
  Settings,
  Shield,
  SlidersHorizontal,
  UserRound,
  Wallet,
} from "lucide-react";
import type { RouteMetadata } from "@/types/breadcrumb.types";
interface AppRouteDefinition {
  href: string;
  label: string;
  icon?: LucideIcon;
  dashboardNav?: {
    exact?: boolean;
    mobileLabel?: string;
  };
}

interface DashboardNavigationItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact: boolean;
  mobileLabel: string;
}

function renderRouteIcon(Icon?: LucideIcon): React.ReactNode | undefined {
  return Icon ? <Icon size={14} strokeWidth={2} /> : undefined;
}

const appRouteDefinitions: AppRouteDefinition[] = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: Gauge,
    dashboardNav: { exact: true, mobileLabel: "Home" },
  },
  { href: "/dashboard/activity", label: "Activity", icon: Activity, dashboardNav: {} },
  { href: "/dashboard/async-states", label: "Async States", icon: Blocks },
  { href: "/dashboard/audit", label: "Audit Trail", icon: Newspaper },
  { href: "/dashboard/dev-errors", label: "Dev Errors", icon: AlertTriangle },
  { href: "/dashboard/dev-errors/boundary-error", label: "Boundary Error", icon: AlertTriangle },
  { href: "/dashboard/dev-errors/route-error", label: "Route Error", icon: AlertTriangle },
  { href: "/dashboard/history", label: "History", icon: History },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/portfolio", label: "Portfolio", icon: Wallet, dashboardNav: {} },
  { href: "/dashboard/sandbox", label: "Sandbox", icon: SlidersHorizontal },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, dashboardNav: {} },
  { href: "/dashboard/settings/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/settings/preferences", label: "Preferences", icon: SlidersHorizontal },
  { href: "/dashboard/settings/security", label: "Security", icon: Shield },
  { href: "/dashboard/strategy", label: "Strategy", icon: BookOpenText, dashboardNav: {} },
  { href: "/dashboard/transactions", label: "Transactions", icon: History },
  { href: "/docs/tokens", label: "Design Tokens", icon: Blocks },
  { href: "/login", label: "Login", icon: LogIn },
  { href: "/onboarding", label: "Onboarding", icon: BookOpenText },
  { href: "/profile", label: "Profile", icon: UserRound },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/signup", label: "Sign Up", icon: LogIn },
  { href: "/unauthorized", label: "Unauthorized", icon: Shield },
  { href: "/forbidden", label: "Forbidden", icon: Shield },
];

function isDashboardNavigationRoute(
  definition: AppRouteDefinition,
): definition is AppRouteDefinition &
  Required<Pick<AppRouteDefinition, "icon" | "dashboardNav">> {
  return Boolean(definition.icon && definition.dashboardNav);
}

export const routeMetadata: Record<string, RouteMetadata> = Object.fromEntries(
  appRouteDefinitions.map(({ href, label, icon }) => [
    href,
    {
      label,
      href,
      icon: renderRouteIcon(icon),
    },
  ]),
);

export const dashboardNavigation: DashboardNavigationItem[] = appRouteDefinitions
  .filter(isDashboardNavigationRoute)
  .map(({ href, label, icon, dashboardNav }) => ({
    href,
    label,
    icon,
    exact: dashboardNav?.exact ?? false,
    mobileLabel: dashboardNav?.mobileLabel ?? label,
  }));

export function getRouteMetadata(pathname: string): RouteMetadata | undefined {
  return routeMetadata[pathname];
}

export function getRouteLabel(pathname: string, fallback = "Dashboard"): string {
  return getRouteMetadata(pathname)?.label ?? fallback;
}

// Helper: build breadcrumb items from a pathname string
export function buildBreadcrumbsFromPath(
  pathname: string,
): import("@/types/breadcrumb.types").BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  const items: import("@/types/breadcrumb.types").BreadcrumbItem[] = [
    { label: "Home", href: "/", icon: routeMetadata["/"]?.icon },
  ];

  let cumulative = "";
  segments.forEach((seg, idx) => {
    cumulative += `/${seg}`;
    const meta = routeMetadata[cumulative];
    items.push({
      label: meta?.label ?? seg.charAt(0).toUpperCase() + seg.slice(1),
      href: cumulative,
      icon: meta?.icon,
      isCurrentPage: idx === segments.length - 1,
    });
  });

  return items;
}
