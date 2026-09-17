import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { forkJoin } from 'rxjs';

import { Staff } from '../../core/models/staff';
import { StaffService } from '../../core/services/staff';
import { Branch } from '../../core/services/branch';
import { AuthService } from '../../core/services/auth';
import { BusinessUnit } from '../../core/models/analytics';
import { ROLE_BUSINESS_UNIT } from '../../core/models/users';

/**
 * Portal users page for a business-unit dashboard — shows only the staff
 * whose role belongs to the signed-in user's own unit (derived from their
 * role, same mapping the unit Products/Transactions pages use).
 */
@Component({
  selector: 'app-unit-users',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule
  ],
  templateUrl: './unit-users.html',
  styleUrl: './unit-users.scss'
})
export class UnitUsers implements OnInit {
  private readonly staffService = inject(StaffService);
  private readonly branchService = inject(Branch);
  private readonly auth = inject(AuthService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  readonly businessUnit = computed(() => {
    const role = this.auth.currentUser()?.role;
    return role && role !== 'HQ' ? ROLE_BUSINESS_UNIT[role] : '';
  });

  staff: Staff[] = [];
  branchNames = new Map<number, string>();
  searchTerm = '';
  pageIndex = 0;
  pageSize = 5;
  readonly pageSizeOptions = [5, 10, 25];
  readonly displayedColumns = ['index', 'username', 'name', 'email', 'phone', 'role', 'branch', 'status'];

  private unitOf(member: Staff): BusinessUnit | undefined {
    return ROLE_BUSINESS_UNIT[member.role as keyof typeof ROLE_BUSINESS_UNIT];
  }

  branchNameFor(member: Staff): string {
    return member.branchId != null ? this.branchNames.get(member.branchId) ?? `#${member.branchId}` : '—';
  }

  get filteredStaff(): Staff[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.staff;

    return this.staff.filter(member =>
      [member.username, member.firstName, member.surName, member.email, member.phoneNumber, member.role, member.status]
        .some(value => (value ?? '').toLowerCase().includes(term))
    );
  }

  get pagedStaff(): Staff[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredStaff.slice(start, start + this.pageSize);
  }

  ngOnInit(): void {
    this.loadStaff();
  }

  loadStaff(): void {
    forkJoin({
      staff: this.staffService.getStaff(),
      branches: this.branchService.getBranches(false)
    }).subscribe({
      next: ({ staff, branches }) => {
        const unit = this.businessUnit();
        this.staff = staff.filter(member => this.unitOf(member) === unit);
        this.branchNames = new Map(branches.filter(b => b.id != null).map(b => [b.id!, b.name]));
        this.changeDetectorRef.markForCheck();
      },
      error: error => console.error('Failed to load users', error)
    });
  }

  applySearch(): void {
    this.pageIndex = 0;
  }

  changePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }
}
