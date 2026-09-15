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
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';

import { Roles } from '../../../core/models/roles';
import { Role } from '../../../core/services/role';
import { Permission } from '../../../core/services/permissions';

@Component({
  selector: 'app-permission-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  templateUrl: './form.html',
  styleUrl: './form.scss',
})
export class Form implements OnInit {
  private fb = inject(FormBuilder)
  private permissionService = inject(Permission);
  private roleService = inject(Role);

  private dialogRef = inject(MatDialogRef<Form>);

  readonly roles = signal<Roles[]>([]);

  saving = false;

  permissionsForm = this.fb.nonNullable.group({
    permission: [
      '',
      Validators.required
    ],
    roleId: [
      '',
      Validators.required
    ]
  });

  ngOnInit(): void {
    this.roleService.getRoles().subscribe({
      next: (roles) => this.roles.set(roles),
      error: (error) => console.error('Failed to load roles', error)
    });
  }

  save(): void {
    if (this.permissionsForm.invalid) {
      this.permissionsForm.markAllAsTouched();
      return;
    }

    const { permission, roleId } = this.permissionsForm.getRawValue();
    this.saving = true;

    this.permissionService
      .createPermissions({ permission, roleId })
      .pipe(finalize(() => this.saving = false))
      .subscribe({
        next: (createdPermission) => {
          this.dialogRef.close(createdPermission);
        },
        error: (error) => {
          console.error('Failed to create Permission', error)
        }
      })
  }
  cancel(): void {
    this.dialogRef.close();
  }
}
