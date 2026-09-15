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
import { forkJoin } from 'rxjs';

import { FinanceService } from '../../../core/services/finance-service';
import { BusinessLineService } from '../../../core/services/business-line-service';
import { Paybill } from '../../../core/models/paybills';
import { Form } from '../form/form';
import { Update } from '../update/update';

@Component({
  selector: 'app-business-products',
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
  private readonly financeService = inject(FinanceService);
  private readonly businessLineService = inject(BusinessLineService);
  private readonly dialog = inject(MatDialog);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  paybills: Paybill[] = [];
  businessLineNames = new Map<number, string>();
  searchTerm = '';
  pageIndex = 0;
  pageSize = 5;
  readonly pageSizeOptions = [5, 10, 25];
  readonly displayedColumns = ['paybillNumber', 'provider', 'businessLine', 'amount', 'actions'];

  get filteredPaybills(): Paybill[] {
    const term = this.searchTerm.trim().toLowerCase();
    return !term
      ? this.paybills
      : this.paybills.filter(paybill =>
          [paybill.paybillNumber, paybill.provider, this.businessLineNameFor(paybill)].some(value =>
            String(value ?? '').toLowerCase().includes(term)
          )
        );
  }

  get pagedPaybills(): Paybill[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredPaybills.slice(start, start + this.pageSize);
  }

  ngOnInit(): void {
    this.loadPaybills();
  }

  loadPaybills(): void {
    forkJoin({
      paybills: this.financeService.getPaybills(),
      businessLines: this.businessLineService.getBusinessLines()
    }).subscribe({
      next: ({ paybills, businessLines }) => {
        this.paybills = paybills;
        this.businessLineNames = new Map(businessLines.map(line => [line.id, line.name]));
        this.changeDetectorRef.markForCheck();
      },
      error: error => console.error('Failed to load paybills', error)
    });
  }

  businessLineNameFor(paybill: Paybill): string {
    return this.businessLineNames.get(paybill.businessLineId) ?? `#${paybill.businessLineId}`;
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
        if (created) this.loadPaybills();
      });
  }

  openUpdateDialog(paybill: Paybill): void {
    this.dialog.open(Update, { width: '420px', maxWidth: 'calc(100vw - 32px)', data: paybill })
      .afterClosed()
      .subscribe(updated => {
        if (updated) this.loadPaybills();
      });
  }
}
