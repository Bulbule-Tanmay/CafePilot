import { useState, type ReactNode } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Coffee, Menu as MenuIcon, ShoppingBasket, X } from 'lucide-react'
import { PreviewBanner } from '../../app/route-guards'
import { platformBrandIcon, platformNav, restaurantNav, type NavItem } from '../../features/navigation'

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 font-semibold tracking-tight">
      <span className="grid size-8 place-items-center rounded-control bg-brand text-brand-ink">
        <Coffee className="size-5" aria-hidden />
      </span>
      {!compact && <span>CafePilot</span>}
    </span>
  )
}

/* ---------- Public ---------- */

export function PublicShell() {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" aria-label="CafePilot home">
            <Brand />
          </Link>
          <nav aria-label="Primary" className="flex items-center gap-2 text-sm">
            <Link to="/auth/sign-in" className="rounded-control px-3 py-2 text-muted hover:text-cream">
              Sign in
            </Link>
            <Link
              to="/auth/register"
              className="rounded-control bg-brand px-3 py-2 font-semibold text-brand-ink hover:bg-brand-hover"
            >
              Register your restaurant
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-line px-4 py-6 text-center text-xs text-muted">
        © CafePilot. Restaurant management and QR ordering for India.
      </footer>
    </div>
  )
}

/* ---------- Auth ---------- */

export function AuthShell() {
  return (
    <div className="grid min-h-full place-items-center px-4 py-10">
      <div className="w-full max-w-md rounded-card border border-line bg-surface-1 p-6 shadow-panel">
        <Link to="/" className="mb-6 block" aria-label="CafePilot home">
          <Brand />
        </Link>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

/* ---------- Operator shells (restaurant + platform) ---------- */

function Rail({ items, collapsed, onNavigate }: { items: NavItem[]; collapsed: boolean; onNavigate?: () => void }) {
  return (
    <nav aria-label="Main" className="flex-1 space-y-1 overflow-y-auto p-2">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/app' || to === '/platform'}
          onClick={onNavigate}
          title={collapsed ? label : undefined}
          className={({ isActive }) =>
            `flex min-h-11 items-center gap-3 rounded-control px-3 text-sm transition-colors ${
              isActive ? 'bg-surface-3 text-brand' : 'text-muted hover:bg-surface-2 hover:text-cream'
            }`
          }
        >
          <Icon className="size-5 shrink-0" aria-hidden />
          {!collapsed && <span className="truncate">{label}</span>}
        </NavLink>
      ))}
    </nav>
  )
}

function OperatorShell({ items, area, children }: { items: NavItem[]; area: string; children?: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const AreaIcon = area === 'Platform admin' ? platformBrandIcon : null

  return (
    <div className="flex h-full flex-col">
      <PreviewBanner />
      <div className="flex min-h-0 flex-1">
        {/* Desktop rail */}
        <aside
          className={`hidden shrink-0 flex-col border-r border-line bg-surface-1 md:flex ${collapsed ? 'w-16' : 'w-60'}`}
        >
          <div className="flex h-14 items-center justify-between border-b border-line px-3">
            <Brand compact={collapsed} />
            <button
              type="button"
              onClick={() => setCollapsed((c) => !c)}
              aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
              className="grid size-9 place-items-center rounded-control text-muted hover:bg-surface-2"
            >
              {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
            </button>
          </div>
          <Rail items={items} collapsed={collapsed} />
        </aside>

        {/* Mobile drawer */}
        {drawer && (
          <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
            <button
              type="button"
              aria-label="Close navigation"
              className="absolute inset-0 bg-black/60"
              onClick={() => setDrawer(false)}
            />
            <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-surface-1">
              <div className="flex h-14 items-center justify-between border-b border-line px-3">
                <Brand />
                <button
                  type="button"
                  onClick={() => setDrawer(false)}
                  aria-label="Close navigation"
                  className="grid size-9 place-items-center rounded-control text-muted hover:bg-surface-2"
                >
                  <X className="size-4" />
                </button>
              </div>
              <Rail items={items} collapsed={false} onNavigate={() => setDrawer(false)} />
            </aside>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top status bar */}
          <header className="flex h-14 shrink-0 items-center gap-3 border-b border-line bg-surface-1 px-4">
            <button
              type="button"
              onClick={() => setDrawer(true)}
              aria-label="Open navigation"
              className="grid size-9 place-items-center rounded-control text-muted hover:bg-surface-2 md:hidden"
            >
              <MenuIcon className="size-5" />
            </button>
            <span className="flex items-center gap-2 text-sm font-medium">
              {AreaIcon && <AreaIcon className="size-4 text-brand" aria-hidden />}
              {area}
            </span>
            <span className="ml-auto rounded-full bg-surface-3 px-3 py-1 text-xs text-muted">Stage 0 shell</span>
          </header>
          <main className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">{children ?? <Outlet />}</main>
        </div>
      </div>
    </div>
  )
}

export function RestaurantShell() {
  return <OperatorShell items={restaurantNav} area="Restaurant" />
}

export function PlatformShell() {
  return <OperatorShell items={platformNav} area="Platform admin" />
}

/* ---------- Guest (mobile-first) ---------- */

export function GuestShell() {
  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col bg-surface-0">
      <header className="sticky top-0 z-10 flex items-center gap-2 border-b border-line bg-surface-1 px-4 py-3">
        <Brand compact />
        <span className="text-sm font-medium">Guest ordering</span>
      </header>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
      <nav
        aria-label="Guest"
        className="sticky bottom-0 grid grid-cols-3 border-t border-line bg-surface-1 text-xs text-muted"
      >
        <span className="flex min-h-14 flex-col items-center justify-center gap-1">
          <ShoppingBasket className="size-5" aria-hidden />
          Menu
        </span>
        <span className="flex min-h-14 flex-col items-center justify-center gap-1">Orders</span>
        <span className="flex min-h-14 flex-col items-center justify-center gap-1">Rewards</span>
      </nav>
    </div>
  )
}
