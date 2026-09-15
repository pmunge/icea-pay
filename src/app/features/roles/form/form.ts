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

import { Role} from '../../../core/services/role';

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
  private roleService = inject(Role);

  private dialogRef = inject(MatDialogRef<Form>);

  saving = false;

  rolesForm = this.fb.nonNullable.group({
    role: [
      '',
      Validators.required
    ]
  });

  save(): void {
    if (this.rolesForm.invalid) {
      this.rolesForm.markAllAsTouched();
      return;
    }

    const { role } = this.rolesForm.getRawValue();
    this.saving = true;

    this.roleService
      .createRoles({ role })
      .pipe(finalize(() => this.saving = false))
      .subscribe({
        next: (createdRole) => {
          this.dialogRef.close(createdRole);
        },
        error: (error) => {
          console.error('Failed to create Role', error)
        }
      })
  }
  cancel(): void {
    this.dialogRef.close();
  }
}
