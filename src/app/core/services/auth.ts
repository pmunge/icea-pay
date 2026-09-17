import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, shareReplay, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/env';

import { ROLE_HOME_ROUTE, UserRole } from '../models/users';
import { StaffRegisterRequest } from '../models/staff';
import { StaffService } from './staff';
import { Branches } from '../models/branch';
import { Branch } from './branch';

const STORAGE_KEY = 'auth_user';
const TOKEN_KEY = 'auth_token';

/** Shape of `data` on every /auth/* response. */
export interface AuthResponseData {
  token: string;
  staffId: string;
  username: string;
  email: string;
  role: UserRole;
  message: string;
  requiresOtp: boolean;
}

interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

/** The signed-in user, as stored from the API's auth response. */
export interface AuthUser {
  staffId: string;
  username: string;
  email: string;
  role: UserRole;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private staffService = inject(StaffService);
  private branchService = inject(Branch);
  private readonly authUrl = `${environment.apiUrl}/auth`;

  /** Currently logged-in user, restored from localStorage on startup. */
  readonly currentUser = signal<AuthUser | null>(this.readStoredUser());

  /** Email awaiting OTP verification, set once /auth/login accepts credentials. */
  private readonly pendingEmail = signal<string | null>(null);

  /** Cached resolution of the signed-in staff member's own branch — reset on login/logout. */
  private myBranch$?: Observable<Branches | null>;

  /** Cached resolution of the signed-in staff member's own full name — reset on login/logout. */
  private myName$?: Observable<string>;

  
  requestOtp(email: string, password: string): Observable<AuthResponseData> {
    return this.http
      .post<ApiResponse<AuthResponseData>>(`${this.authUrl}/login`, { email, password })
      .pipe(
        map((res) => {
          if (!res.success) {
            throw new Error(res.message || 'Invalid email or password');
          }

          if (res.data.requiresOtp) {
            this.pendingEmail.set(email);
          } else {
            this.completeLogin(res.data);
          }

          return res.data;
        })
      );
  }

  /**
   * Create a new staff login (HQ only). The backend auto-generates the
   * initial password and emails it to the new staff member.
   */
  register(payload: StaffRegisterRequest): Observable<AuthResponseData> {
    return this.http
      .post<ApiResponse<AuthResponseData>>(`${this.authUrl}/register`, payload)
      .pipe(
        map((res) => {
          if (!res.success) {
            throw new Error(res.message || 'Failed to register staff member');
          }
          return res.data;
        })
      );
  }

  /** True once requestOtp() has accepted a password and an OTP is awaited. */
  hasPendingLogin(): boolean {
    return this.pendingEmail() !== null;
  }

  /**
   * Step 2 of login: send the entered code to the backend. On success the
   * pending login is promoted to a full session.
   */
  verifyOtp(code: string): Observable<AuthResponseData> {
    const email = this.pendingEmail();

    if (!email) {
      return throwError(() => new Error('No login is in progress.'));
    }

    return this.http
      .post<ApiResponse<AuthResponseData>>(`${this.authUrl}/verify-login`, {
        email,
        otpCode: code,
      })
      .pipe(
        map((res) => {
          if (!res.success) {
            throw new Error(res.message || 'Invalid or expired OTP');
          }

          this.completeLogin(res.data);
          this.pendingEmail.set(null);
          return res.data;
        })
      );
  }

  private completeLogin(data: AuthResponseData): void {
    this.myBranch$ = undefined;
    this.myName$ = undefined;
    localStorage.setItem(TOKEN_KEY, data.token);
    this.storeUser({
      staffId: data.staffId,
      username: data.username,
      email: data.email,
      role: data.role,
    });
  }

  /** Bearer token for authenticated API calls, or null if signed out. */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  logout(): void {
    this.myBranch$ = undefined;
    this.myName$ = undefined;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    this.currentUser.set(null);
    this.pendingEmail.set(null);
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  getRole(): UserRole | null {
    return this.currentUser()?.role ?? null;
  }

  /**
   * Default landing route for a given role — the dashboard for its business
   * unit. Falls back to /unauthorized for a role the backend can return but
   * this app doesn't have a mapped dashboard for, rather than navigating to
   * `undefined` (ROLE_HOME_ROUTE is typed as exhaustive but isn't at runtime).
   */
  homeRoute(role: UserRole | null = this.getRole()): string {
    if (!role) return '/dashboard';
    return ROLE_HOME_ROUTE[role] ?? '/unauthorized';
  }

  /**
   * The signed-in staff member's own branch, resolved from /staff since the
   * login response itself doesn't carry it. Null for HQ (branch-less) or if
   * the lookup fails. Cached for the lifetime of the session.
   */
  getMyBranch(): Observable<Branches | null> {
    const staffId = this.currentUser()?.staffId;
    if (!staffId) return of(null);

    if (!this.myBranch$) {
      this.myBranch$ = this.staffService.getStaff().pipe(
        map((staff) => staff.find((member) => member.id === staffId)?.branchId ?? null),
        switchMap((branchId) => (branchId != null ? this.branchService.getBranch(branchId) : of(null))),
        catchError(() => of(null)),
        shareReplay(1)
      );
    }

    return this.myBranch$;
  }

  getMyBranchId(): Observable<number | null> {
    return this.getMyBranch().pipe(map((branch) => branch?.id ?? null));
  }

  /**
   * The signed-in staff member's full name, resolved from /staff since the
   * login response itself only carries a username. Falls back to the
   * username (then email) if the lookup fails or finds no match.
   */
  getMyName(): Observable<string> {
    const user = this.currentUser();
    if (!user) return of('Unknown');

    const fallback = user.username || user.email || 'Unknown';

    if (!this.myName$) {
      this.myName$ = this.staffService.getStaff().pipe(
        map((staff) => {
          const member = staff.find((s) => s.id === user.staffId);
          const name = member ? `${member.firstName} ${member.surName}`.trim() : '';
          return name || fallback;
        }),
        catchError(() => of(fallback)),
        shareReplay(1)
      );
    }

    return this.myName$;
  }

  private storeUser(user: AuthUser): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }

  private readStoredUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  }
}
