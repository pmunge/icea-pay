import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth';
import { CountryService } from '../../../core/services/country-service';
import { Country } from '../../../core/models/country';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private countryService = inject(CountryService);

  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly countries = signal<Country[]>([]);

  loginForm = this.fb.nonNullable.group({
    country: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    rememberMe: [false]
  });

  ngOnInit(): void {
    this.countryService.getCountries().subscribe({
      next: (countries) => {
        this.countries.set(
          countries
            .filter((country) => country.active)
            .sort((a, b) => a.name.localeCompare(b.name))
        );
      },
      error: (error) => console.error('Failed to load countries', error)
    });
  }

  submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.getRawValue();

    this.loading.set(true);
    this.errorMessage.set('');

    this.auth.requestOtp(email, password).subscribe({
      next: (data) => {
        this.loading.set(false);
        this.router.navigateByUrl(
          data.requiresOtp ? '/otp' : this.auth.homeRoute(data.role)
        );
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err?.message || 'Invalid email or password.');
      }
    });
  }
}
