import {
  Banknote,
  BarChart3,
  Building2,
  ChefHat,
  ClipboardList,
  CreditCard,
  Flag,
  FileText,
  LayoutDashboard,
  Plug,
  QrCode,
  Receipt,
  ScrollText,
  Settings,
  ShieldCheck,
  Table2,
  Tag,
  UserRound,
  Users,
  UtensilsCrossed,
  Wallet,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  /** Stage in which the real feature lands. Shown on Stage 0 placeholders. */
  stage: number
  description: string
}

export const restaurantNav: NavItem[] = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, stage: 8, description: 'Sales, covers, floor overview and warnings.' },
  { to: '/app/tables', label: 'Tables', icon: Table2, stage: 5, description: 'Live floor view with bills and table states.' },
  { to: '/app/live-orders', label: 'Live Orders', icon: ClipboardList, stage: 5, description: 'Incoming orders, acknowledgement and service.' },
  { to: '/app/billing', label: 'Billing', icon: Receipt, stage: 5, description: 'Per-table baskets, rounds, adjustments and settlement.' },
  { to: '/app/kitchen', label: 'Kitchen', icon: ChefHat, stage: 5, description: 'Station tickets, timers, ready and bump.' },
  { to: '/app/menu', label: 'Menu', icon: UtensilsCrossed, stage: 3, description: 'Sections, dishes, add-ons, GST/HSN and guest preview.' },
  { to: '/app/qr/tables', label: 'Table QR', icon: QrCode, stage: 2, description: 'Per-table QR codes and print cards.' },
  { to: '/app/qr/virtual', label: 'Virtual QR', icon: QrCode, stage: 2, description: 'Off-premises ordering points (payment-first).' },
  { to: '/app/offers', label: 'Offers & Loyalty', icon: Tag, stage: 7, description: 'Offers, coupons, loyalty and games.' },
  { to: '/app/payments', label: 'Payments', icon: CreditCard, stage: 6, description: 'Payment timing and manual UPI/UTR settings.' },
  { to: '/app/invoices', label: 'Invoices', icon: FileText, stage: 6, description: 'GST-ready invoices, refunds and credit notes.' },
  { to: '/app/shifts', label: 'Shifts', icon: Banknote, stage: 6, description: 'Cash drawer, float, counted vs expected cash.' },
  { to: '/app/expenses', label: 'Expenses', icon: Wallet, stage: 8, description: 'Monthly expenses, categories and standing costs.' },
  { to: '/app/guests', label: 'Guests', icon: UserRound, stage: 8, description: 'Guest directory, history, consent and feedback.' },
  { to: '/app/reports', label: 'Reports', icon: BarChart3, stage: 8, description: 'Sales, tax, channels, items and exports.' },
  { to: '/app/staff', label: 'Staff', icon: Users, stage: 2, description: 'Roles, counter PINs, discount ceilings, activity.' },
  { to: '/app/integrations', label: 'Integrations', icon: Plug, stage: 8, description: 'Honest not-connected states for delivery apps.' },
  { to: '/app/wallet', label: 'Wallet & Plans', icon: Wallet, stage: 8, description: 'Not live. Informational only.' },
  { to: '/app/settings', label: 'Settings', icon: Settings, stage: 2, description: 'Profile, GST, printing, sounds, appearance, reset.' },
]

export const platformNav: NavItem[] = [
  { to: '/platform', label: 'Overview', icon: LayoutDashboard, stage: 1, description: 'Vendor counts, signups and operational metrics.' },
  { to: '/platform/vendors', label: 'Vendors', icon: Building2, stage: 1, description: 'Review queue, approve, reject, suspend, reactivate.' },
  { to: '/platform/audit', label: 'Audit', icon: ScrollText, stage: 1, description: 'Immutable platform and vendor audit events.' },
  { to: '/platform/features', label: 'Feature flags', icon: Flag, stage: 1, description: 'Platform flags and announcements.' },
]

export const platformBrandIcon = ShieldCheck
