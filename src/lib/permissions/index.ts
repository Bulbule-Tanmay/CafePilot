/**
 * Role model placeholder. Real permissions come from the database in Stage 1/2.
 * UI checks are a convenience only; the server enforces every permission.
 */
export const STAFF_ROLES = ['owner', 'manager', 'cashier', 'kitchen', 'waiter', 'accountant', 'custom'] as const
export type StaffRole = (typeof STAFF_ROLES)[number]

export const PLATFORM_ROLES = ['platform_admin'] as const
export type PlatformRole = (typeof PLATFORM_ROLES)[number]
