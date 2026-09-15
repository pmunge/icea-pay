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

import { Branches } from '../../../core/models/branch';
import { Branch } from '../../../core/services/branch';
import { StaffService } from '../../../core/services/staff';
import { AuthService } from '../../../core/services/auth';


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

  private fb = inject(FormBuilder);

  private authService = inject(AuthService);

  private staffService = inject(StaffService);

  private branchService = inject(Branch);

  private dialogRef =
    inject(MatDialogRef<Form>);

  readonly roles = signal<string[]>([]);

  readonly branches = signal<Branches[]>([]);

  readonly saving = signal(false);

  usersForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    firstName: ['', Validators.required],
    middleName: [''],
    surName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['', Validators.required],
    phoneNumber: [''],
    idNumber: [''],
    county: [''],
    branchId: [null as number | null]
  });

  ngOnInit(): void {
    this.staffService.getAllowedRoles().subscribe({
      next: (roles) => this.roles.set(roles),
      error: (error) => console.error('Failed to load allowed roles', error)
    });

    this.branchService.getBranches(true).subscribe({
      next: (branches) => this.branches.set(branches),
      error: (error) => console.error('Failed to load branches', error)
    });
  }

  save(): void {
    if (this.usersForm.invalid) {
      this.usersForm.markAllAsTouched();
      return;
    }

    const { branchId, ...rest } = this.usersForm.getRawValue();
    this.saving.set(true);

    this.authService
      .register({ ...rest, branchId: branchId ?? undefined })
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
