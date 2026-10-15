import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { LoadingState, AccessDenied } from '../components/feedback/states'
import { useAuth } from './auth-context'

/**
 * Dev-only escape hatch so the shells can be reviewed before Stage 1 auth exists.
 * `import.meta.env.DEV` is statically false in production builds, so this cannot
 * bypass anything in a deployed bundle.
 */
const PREVIEW_SHELLS = import.meta.env.DEV && import.meta.env.VITE_PREVIEW_SHELLS === 'true'

export function PreviewBanner() {
  if (!PREVIEW_SHELLS) return null
  return (
    <div className="bg-warn px-3 py-1 text-center text-xs font-medium text-black">
      Dev preview: route guards bypassed (VITE_PREVIEW_SHELLS). Not available in production builds.
    </div>
  )
}

/** Restaurant staff area. Blocks unauthenticated users. Vendor-status checks arrive in Stage 1. */
export function RequireStaff() {
  const { status } = useAuth()
  const location = useLocation()
  if (PREVIEW_SHELLS) return <Outlet />
  if (status === 'loading') return <LoadingState label="Checking session" />
  if (status === 'signed-out') {
    return <Navigate to="/auth/sign-in" replace state={{ from: location.pathname }} />
  }
  // Signed in, but approval/membership is not implemented until Stage 1: deny by default.
  return <AccessDenied reason="Restaurant access is enabled after vendor approval (Stage 1)." />
}

/** Platform admin area. Denied for everyone until real platform roles exist (Stage 1). */
export function RequirePlatformAdmin() {
  const { status } = useAuth()
  const location = useLocation()
  if (PREVIEW_SHELLS) return <Outlet />
  if (status === 'loading') return <LoadingState label="Checking session" />
  if (status === 'signed-out') {
    return <Navigate to="/auth/sign-in" replace state={{ from: location.pathname }} />
  }
  return <AccessDenied reason="Platform admin access requires an explicit platform role." />
}
