import { Component, useEffect, useState, type ErrorInfo, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Compass, Loader2, ShieldAlert, TriangleAlert, WifiOff } from 'lucide-react'

function StateCard({ icon, title, children }: { icon: ReactNode; title: string; children?: ReactNode }) {
  return (
    <div role="status" className="mx-auto flex max-w-md flex-col items-center gap-3 px-6 py-16 text-center">
      <div className="text-brand">{icon}</div>
      <h1 className="text-xl font-semibold">{title}</h1>
      {children && <div className="text-sm text-muted">{children}</div>}
    </div>
  )
}

export const buttonClass =
  'inline-flex min-h-11 items-center justify-center rounded-control bg-brand px-4 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-hover'

export function LoadingState({ label = 'Loading' }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="flex items-center justify-center gap-2 py-16 text-muted">
      <Loader2 className="size-5 animate-spin" aria-hidden />
      <span className="text-sm">{label}…</span>
    </div>
  )
}

export function NotFound() {
  return (
    <StateCard icon={<Compass className="size-10" aria-hidden />} title="Page not found">
      <p>That page does not exist or the link has changed.</p>
      <Link to="/" className={`${buttonClass} mt-4`}>
        Back to home
      </Link>
    </StateCard>
  )
}

export function AccessDenied({ reason }: { reason?: string }) {
  return (
    <StateCard icon={<ShieldAlert className="size-10" aria-hidden />} title="Access denied">
      <p>{reason ?? 'You do not have permission to view this area.'}</p>
      <Link to="/auth/sign-in" className={`${buttonClass} mt-4`}>
        Sign in
      </Link>
    </StateCard>
  )
}

export function ErrorFallback({ error, onRetry }: { error?: Error; onRetry?: () => void }) {
  return (
    <StateCard icon={<TriangleAlert className="size-10" aria-hidden />} title="Something went wrong">
      <p>An unexpected error occurred. You can try again.</p>
      {import.meta.env.DEV && error && (
        <pre className="mt-3 max-w-full overflow-auto rounded-control bg-surface-2 p-3 text-left text-xs">
          {error.message}
        </pre>
      )}
      <button type="button" onClick={onRetry ?? (() => window.location.reload())} className={`${buttonClass} mt-4`}>
        Try again
      </button>
    </StateCard>
  )
}

export class ErrorBoundary extends Component<{ children: ReactNode }, { error?: Error }> {
  state: { error?: Error } = {}

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Never log sensitive values. Hook for a real error reporter later.
    console.error('UI error boundary:', error.message, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return <ErrorFallback error={this.state.error} onRetry={() => this.setState({ error: undefined })} />
    }
    return this.props.children
  }
}

export function OfflineBanner() {
  const [online, setOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine))

  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])

  if (online) return null
  return (
    <div
      role="alert"
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-center gap-2 bg-danger px-4 py-2 text-sm font-medium text-white"
    >
      <WifiOff className="size-4" aria-hidden />
      You are offline. Changes will not sync until you reconnect.
    </div>
  )
}
