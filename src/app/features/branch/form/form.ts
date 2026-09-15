import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { finalize } from 'rxjs/operators';

import { Branches } from '../../../core/models/branch';
import { Branch } from '../../../core/services/branch';

@Component({
  selector: 'app-branch-form',

  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatDialogModule
  ],

  templateUrl: './form.html',

  styleUrl: './form.scss'
})
export class Form {

  private fb = inject(FormBuilder);

  private branchService = inject(Branch);

  private dialogRef = inject(MatDialogRef<Form>);

  readonly editingBranch: Branches | null = inject(MAT_DIALOG_DATA, { optional: true });

  readonly saving = signal(false);

  branchForm = this.fb.nonNullable.group({
    name: [this.editingBranch?.name ?? '', Validators.required],
    code: [
      this.editingBranch?.code ?? '',
      [Validators.required, Validators.maxLength(40), Validators.pattern(/^[A-Z0-9_-]+$/)]
    ],
    location: [this.editingBranch?.location ?? '', Validators.required],
    phoneNumber: [this.editingBranch?.phoneNumber ?? ''],
    active: [this.editingBranch?.active ?? true]
  });

  save(): void {
    if (this.branchForm.invalid) {
      this.branchForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const { name, code, location, phoneNumber } = this.branchForm.getRawValue();
    const payload = { name, code, location, phoneNumber };

    const save$ = this.editingBranch?.id
      ? this.branchService.updateBranch(this.editingBranch.id, payload)
      : this.branchService.createBranch(payload);

    save$
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (branch) => this.dialogRef.close(branch),
        error: (error) => console.error('Failed to save branch', error)
      });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
