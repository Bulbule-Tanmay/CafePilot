import { Link } from 'react-router-dom'
import { ChefHat, QrCode, Receipt } from 'lucide-react'

/** Stage 0 landing stub. The full marketing site is Stage 9 and makes no pricing claims. */
export function Landing() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-20 text-center">
      <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
        One workflow from <span className="text-brand">QR scan</span> to <span className="text-brand">GST invoice</span>
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-muted">
        CafePilot connects guest QR ordering, your kitchen, billing and reporting for Indian restaurants and cafes.
        This is an early build. Full site coming in a later stage.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/auth/register"
          className="inline-flex min-h-11 items-center rounded-control bg-brand px-5 font-semibold text-brand-ink hover:bg-brand-hover"
        >
          Register your restaurant
        </Link>
        <Link
          to="/auth/sign-in"
          className="inline-flex min-h-11 items-center rounded-control border border-line px-5 text-cream hover:bg-surface-2"
        >
          Sign in
        </Link>
      </div>
      <ul className="mt-14 grid gap-4 text-left sm:grid-cols-3">
        {[
          { icon: QrCode, t: 'QR ordering', d: 'Guests order from their phone at the table.' },
          { icon: ChefHat, t: 'Kitchen display', d: 'Station tickets, timers and ready states.' },
          { icon: Receipt, t: 'Billing and invoices', d: 'Settle bills and issue GST-ready invoices.' },
        ].map(({ icon: Icon, t, d }) => (
          <li key={t} className="rounded-card border border-line bg-surface-1 p-5 shadow-panel">
            <Icon className="mb-2 size-6 text-brand" aria-hidden />
            <h2 className="font-semibold">{t}</h2>
            <p className="mt-1 text-sm text-muted">{d}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
