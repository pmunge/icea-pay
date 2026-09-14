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
import { Branches } from '../../../core/models/branch';
import { Branch } from '../../../core/services/branch';
import { Form } from '../form/form';

@Component({
  selector: 'app-business-branches',
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
  private readonly branchService = inject(Branch);
  private readonly dialog = inject(MatDialog);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  branches: Branches[] = [];
  searchTerm = '';
  pageIndex = 0;
  pageSize = 5;
  readonly pageSizeOptions = [5, 10, 25];
  readonly displayedColumns = ['name', 'code', 'manager', 'county', 'town', 'phone', 'status'];
  get filteredBranches(): Branches[] {
    const term = this.searchTerm.trim().toLowerCase();
    return !term ? this.branches : this.branches.filter(branch => [branch.name, branch.code, branch.manager, branch.county, branch.town, branch.phone, branch.status].some(value => value.toLowerCase().includes(term)));
  }
  get pagedBranches(): Branches[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredBranches.slice(start, start + this.pageSize);
  }
  ngOnInit(): void {
    this.loadBranches();
  }
  loadBranches(): void {
    this.branchService.getBranches().subscribe({
      next: branches => {
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
}
