# Responsive Navigation QA Matrix — Issue #76

## Breakpoints Under Test

| Breakpoint | Range | Navigation Pattern |
|---|---|---|
| **Mobile** | < 640px | Bottom tab bar (`MobileBottomNav`) |
| **Tablet** | 640–1023px | Collapsed icon rail sidebar (56px), toggleable to 256px |
| **Desktop** | 1024–1279px | Full expanded sidebar (256px) |
| **Wide** | ≥ 1280px | Full expanded sidebar (256px) |

---

## Component Behaviour Matrix

| Scenario | Mobile `<640` | Tablet `640–1023` | Desktop `1024–1279` | Wide `≥1280` |
|---|---|---|---|---|
| Sidebar visible | ✗ hidden | ✓ icon rail (56px) | ✓ full (256px) | ✓ full (256px) |
| Bottom nav visible | ✓ | ✗ hidden | ✗ hidden | ✗ hidden |
| Sidebar expand toggle | N/A | ✓ ChevronRight/Left button | N/A (always expanded) | N/A |
| Sidebar tooltips on hover | N/A | ✓ collapsed only | ✗ | ✗ |
| Logo text visible | ✗ | ✗ (collapsed), ✓ (expanded) | ✓ | ✓ |
| Nav label text visible | ✗ | ✗ (collapsed), ✓ (expanded) | ✓ | ✓ |
| Main content left offset | 0 | `sm:pl-14` (56px) | `lg:pl-64` (256px) | `lg:pl-64` (256px) |
| Main content bottom offset | `pb-20` (80px) | 0 | 0 | 0 |

---

## Touch & Pointer Target Compliance

| Element | Min Size Required | Implemented Size | Compliant |
|---|---|---|---|
| Sidebar nav links | 44px touch / 36px pointer | `min-h-[44px]` | ✅ |
| Mobile bottom nav items | 44px touch | `h-16` (64px) full-width flex | ✅ |
| Sign out button | 44px touch | `min-h-[44px]` | ✅ |
| Sidebar expand/collapse toggle | 36px pointer | `min-h-[36px]` | ✅ |

---

## Active State Verification

All active nav items satisfy the following simultaneously:

| Property | Implementation |
|---|---|
| Background tint | `bg-primary/15` |
| Left border accent | `border-l-[3px] border-primary` |
| Text colour | `text-primary` |
| Font weight | `font-semibold` |
| Icon stroke | `stroke-[2.25]` |
| ARIA attribute | `aria-current="page"` |

---

## Keyboard Navigation Proof

| Action | Expected Behaviour | Implemented |
|---|---|---|
| `Tab` through sidebar | Moves focus through each nav link in DOM order | ✅ |
| `Enter` / `Space` on link | Navigates to route | ✅ (native `<Link>`) |
| `Enter` on collapse toggle | Toggles sidebar | ✅ |
| Focus visible ring | 2px `ring-primary` with offset | ✅ `focus-visible:ring-2 focus-visible:ring-primary` |
| Skip-to-content | `#main-content` anchor in `layout.tsx` | ✅ (pre-existing) |

---

## Overflow Behaviour

| Scenario | Behaviour |
|---|---|
| Many nav items exceed viewport height | Sidebar nav scrolls independently (`overflow-y-auto`) |
| Long route label in sidebar | Truncated with CSS `truncate` |
| Collapsed tablet sidebar label | Hidden via `opacity-0 w-0`, not in visual flow |
| Mobile bottom nav with 5+ items | Items share equal flex width, each ≥44px tall |

---

## Screenshots / Demo

> ⚠️ **Add screenshots here before merging.**  
> Attach device-frame or browser-resize screenshots for each breakpoint column:
> - `screenshot-mobile-375.png` — bottom nav active state
> - `screenshot-tablet-768-collapsed.png` — icon rail with tooltip hover
> - `screenshot-tablet-768-expanded.png` — manually expanded sidebar
> - `screenshot-desktop-1280.png` — full sidebar active link state
> - `demo-keyboard-nav.gif` — Tab + Enter keyboard flow through sidebar

---

## Files Changed

| File | Change |
|---|---|
| `src/components/dashboard/Sidebar.tsx` | Full rewrite — collapsed rail variant, toggle, tooltips, 44px targets |
| `src/components/dashboard/MobileBottomNav.tsx` | Updated to `sm:hidden`, `min-h-[44px]` targets, active stroke weight |
| `src/components/dashboard/DashboardShell.tsx` | Updated `main` padding offsets for `sm:pl-14` tablet rail |

Closes #76
