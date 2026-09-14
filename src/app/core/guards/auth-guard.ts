import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth';
import { UserRole } from '../models/users';

/** Blocks a route unless a user is logged in. */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isAuthenticated() ? true : router.parseUrl('/login');
};

/**
 * Guards the /otp step: only reachable after credentials have been accepted
 * (a pending login exists) and before the OTP has been verified.
 */
export const otpGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.hasPendingLogin() ? true : router.parseUrl('/login');
};

/**
 * Blocks a route unless the logged-in user has one of the required roles.
 * Unauthenticated users are sent to /login, the wrong role to /unauthorized.
 */
export const roleGuard = (required: UserRole | UserRole[]): CanActivateFn => {
  const allowed = Array.isArray(required) ? required : [required];

  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isAuthenticated()) {
      return router.parseUrl('/login');
    }

    const role = auth.getRole();
    return role && allowed.includes(role)
      ? true
      : router.parseUrl('/unauthorized');
  };
};

/**
 * Guards the combined HQ overview: HQ sees it as-is, every other
 * (business-unit-scoped) role is bounced to its own dashboard instead of
 * being shown "unauthorized" for landing on the app root.
 */
export const overviewGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    return router.parseUrl('/login');
  }

  const role = auth.getRole();
  return role === 'HQ' ? true : router.parseUrl(auth.homeRoute(role));
};
