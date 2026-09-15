import { BusinessUnit } from './analytics';

/**
 * HQ sees every business unit. Every other role is scoped to exactly one
 * business unit — there is no "branch" concept beyond that; a role IS the
 * unit a user belongs to.
 */
export type UserRole = 'HQ' | 'GENERAL' | 'LIFE' | 'MEDICAL' | 'INVEST';

/** Maps a business-unit role to the `BusinessUnit` it should be scoped to. */
export const ROLE_BUSINESS_UNIT: Record<Exclude<UserRole, 'HQ'>, BusinessUnit> = {
  GENERAL: 'General',
  LIFE: 'Life',
  MEDICAL: 'Medical',
  INVEST: 'Investment',
};

/** Where each role lands after login — the dashboard for its business unit. */
export const ROLE_HOME_ROUTE: Record<UserRole, string> = {
  HQ: '/dashboard',
  GENERAL: '/dashboard/general',
  LIFE: '/dashboard/business-products',
  MEDICAL: '/dashboard/health',
  INVEST: '/dashboard/investment',
};
