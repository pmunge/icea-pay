import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth';

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{12,}$/;

@Component({
  selector: 'app-activate',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './activate.html',
  styleUrl: './activate.scss',
})
export class Activate implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  readonly loading = signal(true);
  readonly submitting = signal(false);
  readonly errorMessage = signal('');
  readonly email = signal('');
  readonly qrCodeDataUrl = signal('');
  private token = '';

  readonly activationForm = this.fb.nonNullable.group({
    password: ['', [Validators.required, Validators.pattern(PASSWORD_PATTERN)]],
    confirmPassword: ['', Validators.required],
    totpCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
  });

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    if (!this.token) {
      this.loading.set(false);
      this.errorMessage.set('This activation link is missing its token. Please request a new invitation.');
      return;
    }

    this.auth.getActivationDetails(this.token).subscribe({
      next: (details) => {
        this.email.set(details.email);
        this.qrCodeDataUrl.set(details.totpQrCodeDataUrl);
        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error?.message || 'This activation link is invalid or has expired.');
        this.loading.set(false);
      },
    });
  }

  submit(): void {
    if (this.activationForm.invalid) {
      this.activationForm.markAllAsTouched();
      return;
    }

    const { password, confirmPassword, totpCode } = this.activationForm.getRawValue();
    if (password !== confirmPassword) {
      this.errorMessage.set('The passwords do not match.');
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set('');
    this.auth.activateAccount({ token: this.token, password, totpCode }).subscribe({
      next: () => this.router.navigateByUrl('/login'),
      error: (error) => {
        this.errorMessage.set(error?.message || 'Account activation failed. Please try again.');
        this.submitting.set(false);
      },
    });
  }

  backToLogin(): void {
    this.router.navigateByUrl('/login');
  }
}
