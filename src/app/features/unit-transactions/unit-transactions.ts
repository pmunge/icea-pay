import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { forkJoin } from 'rxjs';

import { Transaction } from '../../core/models/transactions';
import { TransactionsService } from '../../core/services/transactions';
import { ProductService } from '../../core/services/product';
import { BUSINESS_LINE_IDS } from '../../core/models/product';
import { ExportService } from '../../core/services/export';
import { AuthService } from '../../core/services/auth';
import { ROLE_BUSINESS_UNIT } from '../../core/models/users';

/**
 * Transactions page for a business-unit dashboard — shows only the
 * transactions made against products that belong to the signed-in user's
 * own unit (derived from their role), with PDF/Excel export.
 */
@Component({
  selector: 'app-unit-transactions',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule
  ],
  templateUrl: './unit-transactions.html',
  styleUrl: './unit-transactions.scss',
})
export class UnitTransactions implements OnInit {
  private readonly transactionService = inject(TransactionsService);
  private readonly productService = inject(ProductService);
  private readonly auth = inject(AuthService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly exportService = inject(ExportService);

  readonly businessUnit = computed(() => {
    const role = this.auth.currentUser()?.role;
    return role && role !== 'HQ' ? ROLE_BUSINESS_UNIT[role] : '';
  });

  transactions: Transaction[] = [];
  searchTerm = '';
  pageIndex = 0;
  pageSize = 5;
  readonly pageSizeOptions = [5, 10, 25];
  readonly displayedColumns = [
    'reference',
    'productId',
    'originChannel',
    'paymentOption',
    'payerPhone',
    'amount',
    'status',
    'date'
  ];

  get filteredTransactions(): Transaction[] {
    const term = this.searchTerm.trim().toLowerCase();
    return !term ? this.transactions : this.transactions.filter(transaction =>
      [
        transaction.reference,
        transaction.productId.toString(),
        transaction.originChannel,
        transaction.paymentOption,
        transaction.payerPhone,
        transaction.amount.toString(),
        transaction.status
      ].some(value => value.toLowerCase().includes(term))
    );
  }

  dateOf(transaction: Transaction): string {
    return transaction.completedAt ?? transaction.initiatedAt ?? transaction.createdAt;
  }

  get pagedTransactions(): Transaction[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredTransactions.slice(start, start + this.pageSize);
  }

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    const unit = this.businessUnit();

    forkJoin([
      this.transactionService.getTransactions(),
      this.productService.getProducts()
    ]).subscribe({
      next: ([transactions, products]) => {
        const businessLineId = unit ? BUSINESS_LINE_IDS[unit] : undefined;
        const productIds = new Set(
          products.filter(product => product.businessLineId === businessLineId).map(product => product.id)
        );

        this.transactions = transactions.filter(
          transaction => productIds.has(transaction.productId)
        );
        this.changeDetectorRef.markForCheck();
      },
      error: error => console.error('Failed to load transactions', error)
    });
  }

  applySearch(): void {
    this.pageIndex = 0;
  }

  changePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  exportToExcel(): void {
    const exportData = this.getExportData();

    this.exportService.exportToExcel(
      exportData,
      `${this.businessUnit().toLowerCase()}-transactions`
    );
  }

  exportToPdf(): void {
    const exportData = this.getExportData();
    const columns = ['reference', 'productId', 'originChannel', 'paymentOption', 'payerPhone', 'amount', 'status', 'date'];
    const title = `${this.businessUnit()} Transactions Report`;

    this.exportService.exportToPdf(
      exportData,
      columns,
      `${this.businessUnit().toLowerCase()}-transactions`,
      title
    );
  }

  private getExportData(): Array<Record<string, string | number>> {
    return this.filteredTransactions.map(transaction => ({
      reference: transaction.reference,
      productId: transaction.productId,
      originChannel: transaction.originChannel,
      paymentOption: transaction.paymentOption,
      payerPhone: transaction.payerPhone,
      amount: transaction.amount,
      status: transaction.status,
      date: new Date(this.dateOf(transaction)).toLocaleDateString()
    }));
  }
}
