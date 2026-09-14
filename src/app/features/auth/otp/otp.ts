import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-otp',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './otp.html',
  styleUrl: './otp.scss',
})
export class Otp {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly infoMessage = signal('A one-time password has been sent to your email.');

  otpForm = this.fb.nonNullable.group({
    code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
  });

  constructor() {
    // Reached without clearing the password step → back to login.
    if (!this.auth.hasPendingLogin()) {
      this.router.navigateByUrl('/login');
    }
  }

  submit(): void {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }

    const { code } = this.otpForm.getRawValue();

    this.loading.set(true);
    this.errorMessage.set('');

    this.auth.verifyOtp(code).subscribe({
      next: (data) => {
        this.loading.set(false);
        this.router.navigateByUrl(this.auth.homeRoute(data.role));
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(
          err?.message || 'That code is invalid or has expired. Please try again.'
        );
      },
    });
  }

  cancel(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
