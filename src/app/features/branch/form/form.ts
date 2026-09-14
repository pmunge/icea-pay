import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { Branches } from '../../../core/models/branch';
import { Branch } from '../../../core/services/branch';


@Component({
  selector: 'app-branch-form',

  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule
  ],

  templateUrl: './form.html',

  styleUrl: './form.scss'
})
export class Form {

  private fb = inject(FormBuilder);

  private branchService = inject(Branch);

  private dialogRef =
    inject(MatDialogRef<Form>);
  branchForm = this.fb.nonNullable.group({
    name: [
      '',
      Validators.required
    ],
    code: [
      '',
      Validators.required
    ],
    manager: [
      '',
      Validators.required
    ],
    county: [
      '',
      Validators.required
    ],
    town: [
      '',
      Validators.required
    ],
    phone: [
      '',
      Validators.required
    ],
    status: [
      'Active' as 'Active' | 'Inactive',
      Validators.required
    ]
  });
  save(): void {
    if (this.branchForm.invalid) {
      this.branchForm.markAllAsTouched();
      return;
    }
    this.branchService
      .createBranch(this.branchForm.getRawValue())
      .subscribe({
        next: (createdBranch) => {
          console.log(
            'Branch created:',
            createdBranch
          );

          this.dialogRef.close(
            createdBranch
          );
        },
        error: (error) => {
          console.error(
            'Failed to create branch',
            error
          );
        }
      });
  }
  cancel(): void {
    this.dialogRef.close();
  }

}
