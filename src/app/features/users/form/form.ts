import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';

import { AuthService } from '../../../core/services/auth';
import { Profile } from '../../../core/models/profile';
import { ProfileService } from '../../../core/services/profile';
import { Country } from '../../../core/models/country';
import { CountryService } from '../../../core/services/country-service';


@Component({
  selector: 'app-product-form',

  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatDialogModule
  ],

  templateUrl: './form.html',

  styleUrl: './form.scss'
})
export class Form implements OnInit {

  /** Sent to the backend as fixed defaults; not exposed in the form. */
  private static readonly DEFAULT_BRANCH_ID = 1;
  private static readonly DEFAULT_BUSINESS_LINE_ID = 1;
  private static readonly DEFAULT_COUNTY = 'Nairobi';

  private fb = inject(FormBuilder);

  private authService = inject(AuthService);

  private profileService = inject(ProfileService);

  private countryService = inject(CountryService);

  private dialogRef =
    inject(MatDialogRef<Form>);

  readonly profiles = signal<Profile[]>([]);

  readonly countries = signal<Country[]>([]);

  readonly saving = signal(false);

  usersForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    firstName: ['', Validators.required],
    middleName: [''],
    surName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    profileId: [null as number | null, Validators.required],
    phoneNumber: [''],
    idNumber: [''],
    countryCode: ['', Validators.required]
  });

  ngOnInit(): void {
    this.profileService.getActiveProfiles().subscribe({
      next: (profiles) => this.profiles.set(profiles),
      error: (error) => console.error('Failed to load active profiles', error)
    });

    this.countryService.getCountries().subscribe({
      next: (countries) => this.countries.set(countries),
      error: (error) => console.error('Failed to load countries', error)
    });
  }

  save(): void {
    if (this.usersForm.invalid) {
      this.usersForm.markAllAsTouched();
      return;
    }

    const { profileId, ...rest } = this.usersForm.getRawValue();
    this.saving.set(true);

    this.authService
      .register({
        ...rest,
        profileId: profileId!,
        branchId: Form.DEFAULT_BRANCH_ID,
        businessLineId: Form.DEFAULT_BUSINESS_LINE_ID,
        county: Form.DEFAULT_COUNTY
      })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (createdUser) => {
          this.dialogRef.close(createdUser);
        },
        error: (error) => {
          console.error('Failed to create user', error);
        }
      });
  }
  cancel(): void {
    this.dialogRef.close();
  }

}
