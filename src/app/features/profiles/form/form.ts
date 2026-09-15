import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core'

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';

import { Profile } from '../../../core/services/profile';

@Component({
  selector: 'app-profile-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  templateUrl: './form.html',
  styleUrl: './form.scss',
})
export class Form {
  private fb = inject(FormBuilder)
  private profileService = inject(Profile);

  private dialogRef = inject(MatDialogRef<Form>);

  saving = false;

  profilesForm = this.fb.nonNullable.group({
    profile: [
      '',
      Validators.required
    ]
  });

  save(): void {
    if (this.profilesForm.invalid) {
      this.profilesForm.markAllAsTouched();
      return;
    }

    const { profile } = this.profilesForm.getRawValue();
    this.saving = true;

    this.profileService
      .createProfiles({ profile })
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
