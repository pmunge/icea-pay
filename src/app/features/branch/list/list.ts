import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

import { Branches } from '../../../core/models/branch';
import { Branch } from '../../../core/services/branch';
import { ConfirmationService } from '../../../core/services/confirmation';
import { Form } from '../form/form';

@Component({
  selector: 'app-business-branches',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
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
  private readonly branchService = inject(Branch);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly dialog = inject(MatDialog);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  branches: Branches[] = [];
  searchTerm = '';
  pageIndex = 0;
  pageSize = 5;
  readonly pageSizeOptions = [5, 10, 25];
  readonly displayedColumns = ['name', 'code', 'location', 'phoneNumber', 'active', 'actions'];

  get filteredBranches(): Branches[] {
    const term = this.searchTerm.trim().toLowerCase();
    return !term
      ? this.branches
      : this.branches.filter(branch =>
          [branch.name, branch.code, branch.location, branch.phoneNumber].some(value =>
            String(value ?? '').toLowerCase().includes(term)
          )
        );
  }

  get pagedBranches(): Branches[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredBranches.slice(start, start + this.pageSize);
  }

  ngOnInit(): void {
    this.loadBranches();
  }

  loadBranches(): void {
    this.branchService.getBranches(false).subscribe({
      next: (branches) => {
        this.branches = branches;
        this.changeDetectorRef.markForCheck();
      },
      error: error => console.error('Failed to load branches', error)
    });
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
        if (created) this.loadBranches();
      });
  }

  openEditDialog(branch: Branches): void {
    this.dialog.open(Form, {
      width: '560px',
      maxWidth: 'calc(100vw - 32px)',
      data: branch
    })
      .afterClosed()
      .subscribe(updated => {
        if (updated) this.loadBranches();
      });
  }

  async deactivate(branch: Branches): Promise<void> {
    if (branch.id == null) return;

    const confirmed = await this.confirmationService.confirmDelete(branch.name);
    if (!confirmed) return;

    this.branchService.deactivateBranch(branch.id).subscribe({
      next: () => this.loadBranches(),
      error: error => console.error('Failed to deactivate branch', error)
    });
  }
}
