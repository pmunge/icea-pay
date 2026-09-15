import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core'

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

import { PROFILE_STATUSES } from '../../../core/models/profile';
import { RoleEntity } from '../../../core/models/roles';
import { ProfileService } from '../../../core/services/profile';
import { StaffService } from '../../../core/services/staff';

@Component({
  selector: 'app-profile-form',
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
  styleUrl: './form.scss',
})
export class Form implements OnInit {
  private fb = inject(FormBuilder)
  private profileService = inject(ProfileService);
  private staffService = inject(StaffService);

  private dialogRef = inject(MatDialogRef<Form>);

  readonly statuses = PROFILE_STATUSES;

  readonly roles = signal<RoleEntity[]>([]);

  saving = false;

  profilesForm = this.fb.nonNullable.group({
    name: [
      '',
      Validators.required
    ],
    description: [
      '',
      Validators.required
    ],
    status: [
      'Active',
      Validators.required
    ],
    roles: [
      [] as string[],
      Validators.required
    ]
  });

  ngOnInit(): void {
    this.staffService.getAllowedRoles().subscribe({
      next: (roles) => this.roles.set(roles),
      error: (error) => console.error('Failed to load allowed roles', error)
    });
  }

  save(): void {
    if (this.profilesForm.invalid) {
      this.profilesForm.markAllAsTouched();
      return;
    }

    const profile = this.profilesForm.getRawValue();
    this.saving = true;

    this.profileService
      .createProfile(profile)
      .pipe(finalize(() => this.saving = false))
      .subscribe({
        next: (createdProfile) => {
          this.dialogRef.close(createdProfile);
        },
        error: (error) => {
          console.error('Failed to create Profile', error)
        }
      })
  }
  cancel(): void {
    this.dialogRef.close();
  }
}
