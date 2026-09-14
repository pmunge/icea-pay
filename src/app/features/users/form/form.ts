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

import { UserRole, Users } from '../../../core/models/users';
import { UsersService } from '../../../core/services/users';
import { BUSINESS_UNITS } from '../../../core/models/analytics';


@Component({
  selector: 'app-product-form',

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

  private usersService = inject(UsersService);

  private dialogRef =
    inject(MatDialogRef<Form>);

  readonly businessUnits = BUSINESS_UNITS;

  usersForm = this.fb.nonNullable.group({
    fname: [
      '',
      Validators.required
    ],
    lname: [
      '',
      Validators.required
    ],
    branch: [
      '',
      Validators.required
    ],
    department: [
      '',
      Validators.required
    ],
    email: [
      '',
      Validators.required
    ],
    phone: [
      '',
      Validators.required
    ],
    role: [
      'HQ' as UserRole,
      Validators.required
    ],
    status: [
      'Active' as 'Active' | 'Inactive',
      Validators.required
    ]
  });
  save(): void {
    if (this.usersForm.invalid) {
      this.usersForm.markAllAsTouched();
      return;
    }
    const user: Users = {
      ...this.usersForm.getRawValue(),
      type: 'business'
    };
    this.usersService
      .createUser(user)
      .subscribe({
        next: (createdUser) => {
          console.log(
            'User created:',
            createdUser
          );

          this.dialogRef.close(
            createdUser
          );
        },
        error: (error) => {
          console.error(
            'Failed to create product',
            error
          );
        }
      });
  }
  cancel(): void {
    this.dialogRef.close();
  }

}
