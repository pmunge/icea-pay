import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, throwError } from 'rxjs';
import { environment } from '../../../environments/env';

import { ROLE_HOME_ROUTE, UserRole } from '../models/users';

const STORAGE_KEY = 'auth_user';
const TOKEN_KEY = 'auth_token';

/** Shape of `data` on every /auth/* response. */
interface AuthResponseData {
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
  private readonly authUrl = `${environment.apiUrl}/auth`;

  /** Currently logged-in user, restored from localStorage on startup. */
  readonly currentUser = signal<AuthUser | null>(this.readStoredUser());

  /** Email awaiting OTP verification, set once /auth/login accepts credentials. */
  private readonly pendingEmail = signal<string | null>(null);

  /**
   * Step 1 of login: POST the credentials to the backend. On success the
   * backend sends an OTP and the response says whether one is required; the
   * caller then routes to the /otp page. If no OTP is required the backend
   * has already returned a full session, so we log the user in immediately.
   */
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

  /** Default landing route for a given role — the dashboard for its business unit. */
  homeRoute(role: UserRole | null = this.getRole()): string {
    return role ? ROLE_HOME_ROUTE[role] : '/dashboard';
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
