import { createBrowserRouter, Navigate, Outlet, useParams } from 'react-router-dom'
import { AuthShell, GuestShell, PlatformShell, PublicShell, RestaurantShell } from '../components/layout/shells'
import { NotFound } from '../components/feedback/states'
import { PlaceholderPage } from '../components/ui/PlaceholderPage'
import { platformNav, restaurantNav } from '../features/navigation'
import { Providers } from './providers'
import { RequirePlatformAdmin, RequireStaff } from './route-guards'
import { Landing } from '../features/marketing/Landing'

function Root() {
  return (
    <Providers>
      <Outlet />
    </Providers>
  )
}

function Stub({ title, stage, description }: { title: string; stage: number; description?: string }) {
  return <PlaceholderPage title={title} stage={stage} description={description} />
}

/** Guest pages echo only the route params. Real QR resolution is Stage 4. */
function GuestStub({ title }: { title: string }) {
  const params = useParams()
  return (
    <PlaceholderPage
      title={title}
      stage={4}
      description={`Restaurant: ${params.restaurantSlug ?? 'unknown'}. QR tokens are validated server-side in Stage 4; nothing is trusted from this URL yet.`}
    />
  )
}

const restaurantRoutes = restaurantNav.map((item) => ({
  path: item.to.replace(/^\/app\/?/, ''),
  index: item.to === '/app',
  element: <Stub title={item.label} stage={item.stage} description={item.description} />,
}))

const platformRoutes = platformNav.map((item) => ({
  path: item.to.replace(/^\/platform\/?/, ''),
  index: item.to === '/platform',
  element: <Stub title={item.label} stage={item.stage} description={item.description} />,
}))

export const router = createBrowserRouter([
  {
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      {
        element: <PublicShell />,
        children: [{ path: '/', element: <Landing /> }],
      },
      {
        path: '/auth',
        element: <AuthShell />,
        children: [
          { index: true, element: <Navigate to="sign-in" replace /> },
          { path: 'sign-in', element: <Stub title="Sign in" stage={1} /> },
          { path: 'register', element: <Stub title="Register your restaurant" stage={1} /> },
          { path: 'forgot-password', element: <Stub title="Reset password" stage={1} /> },
        ],
      },
      {
        element: <AuthShell />,
        children: [
          { path: '/onboarding', element: <Stub title="Business details" stage={1} /> },
          { path: '/approval-status', element: <Stub title="Approval status" stage={1} /> },
        ],
      },
      {
        path: '/platform',
        element: <RequirePlatformAdmin />,
        children: [
          {
            element: <PlatformShell />,
            children: [
              ...platformRoutes,
              { path: 'vendors/:vendorId', element: <Stub title="Vendor detail" stage={1} /> },
            ],
          },
        ],
      },
      {
        path: '/app',
        element: <RequireStaff />,
        children: [
          {
            element: <RestaurantShell />,
            children: [
              ...restaurantRoutes,
              { path: 'qr/tables/:tableId/print', element: <Stub title="Print table QR" stage={2} /> },
              { path: 'invoices/:invoiceId', element: <Stub title="Invoice" stage={6} /> },
              { path: 'offers/*', element: <Stub title="Offers & Loyalty" stage={7} /> },
              { path: 'settings/*', element: <Stub title="Settings" stage={2} /> },
            ],
          },
        ],
      },
      {
        path: '/g/:restaurantSlug',
        element: <GuestShell />,
        children: [
          { path: 'table/:qrToken', element: <GuestStub title="Table ordering" /> },
          { path: 'virtual/:qrToken', element: <GuestStub title="Virtual ordering" /> },
          { path: 'menu', element: <GuestStub title="Menu" /> },
          { path: 'checkout', element: <GuestStub title="Checkout" /> },
          { path: 'orders', element: <GuestStub title="Your orders" /> },
          { path: 'rewards', element: <GuestStub title="Rewards" /> },
          { path: 'account', element: <GuestStub title="Account" /> },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
])
