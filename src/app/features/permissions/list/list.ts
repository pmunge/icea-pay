import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

import { Permissions } from '../../../core/models/permissions';
import { Roles } from '../../../core/models/roles';
import { Permission } from '../../../core/services/permissions';
import { Role } from '../../../core/services/role';
import { Form } from '../form/form';


@Component({
  selector: 'app-permissions-list',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule],
  templateUrl: './list.html',
  styleUrl: './list.scss'
})
export class List implements OnInit {
  private readonly permissionService = inject(Permission)
  private readonly roleService = inject(Role)
  private readonly dialog = inject(MatDialog);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  permissions: Permissions[] = []
  roles: Roles[] = []

  searchTerm = '';
  pageIndex = 0;
  pageSize = 5;
  readonly pageSizeOptions = [5, 10, 25];
  readonly displayedColumns = ['permission', 'role'];

  get filteredPermissions(): Permissions[] {
    const term = this.searchTerm.trim().toLowerCase();
    return !term
      ? this.permissions
      : this.permissions.filter(permission =>
        permission.permission.toLowerCase().includes(term) ||
        this.roleName(permission.roleId).toLowerCase().includes(term)
      );
  }

  get pagedPermissions(): Permissions[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredPermissions.slice(start, start + this.pageSize);
  }

  ngOnInit(): void {
    this.loadRoles();
    this.loadPermissions();
  }

  loadPermissions(): void {
    this.permissionService.getPermissions().subscribe({
      next: permissions => {
        this.permissions = permissions;
        this.changeDetectorRef.markForCheck();
      },
      error: error => console.error('Failed to load permissions', error)
    });
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe({
      next: roles => {
        this.roles = roles;
        this.changeDetectorRef.markForCheck();
      },
      error: error => console.error('Failed to load roles', error)
    });
  }

  /** Resolves a permission's roleId to its role name for display in the table. */
  roleName(roleId: string): string {
    return this.roles.find(role => role.id === roleId)?.role ?? '—';
  }

  applySearch(): void {
    this.pageIndex = 0;
  }

  changePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  openCreateDialog(): void {
    this.dialog.open(Form, { width: '560px', maxWidth: 'calc(100vw - 32px)' })
      .afterClosed()
      .subscribe(created => {
        if (created) this.loadPermissions();
      });
  }
}
