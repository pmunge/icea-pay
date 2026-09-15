import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { Transaction, transactionMemberName } from '../../core/models/transactions';
import { TransactionsService } from '../../core/services/transactions';
import { ExportService } from '../../core/services/export';

@Component({
  selector: 'app-transactions',
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
  templateUrl: './transactions.html',
  styleUrl: './transactions.scss',
})
export class Transactions implements OnInit {
  private readonly transactionService = inject(TransactionsService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly exportService = inject(ExportService);

  transactions: Transaction[] = [];
  searchTerm = '';
  pageIndex = 0;
  pageSize = 5;
  readonly pageSizeOptions = [5, 10, 25];
  readonly displayedColumns = [
    'date',
    'reference',
    'memberName',
    'productId',
    'originChannel',
    'rail',
    'paymentOption',
    'amount',
    'status'
  ];

  get filteredTransactions(): Transaction[] {
    const term = this.searchTerm.trim().toLowerCase();
    return !term ? this.transactions : this.transactions.filter(transaction =>
      [
        transaction.reference,
        transaction.productId,
        transaction.rail,
        transaction.originChannel,
        transaction.paymentOption,
        this.memberNameOf(transaction),
        transaction.amount,
        transaction.status
      ].some(value => String(value ?? '').toLowerCase().includes(term))
    );
  }

  memberNameOf(transaction: Transaction): string {
    return transactionMemberName(transaction);
  }

  dateOf(transaction: Transaction): string {
    return transaction.completedAt ?? transaction.initiatedAt ?? transaction.createdAt;
  }

  paymentOptionClass(transaction: Transaction): string {
    return /full/i.test(transaction.paymentOption ?? '') ? 'full' : 'partial';
  }

  statusClass(transaction: Transaction): string {
    return /complete/i.test(transaction.status ?? '') ? 'complete' : 'awaiting';
  }

  get pagedTransactions(): Transaction[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredTransactions.slice(start, start + this.pageSize);
  }

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.transactionService.getTransactions().subscribe({
      next: transactions => {
        this.transactions = transactions;
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
      'transactions'
    );
  }

  exportToPdf(): void {
    const exportData = this.getExportData();
    const columns = ['reference', 'productId', 'originChannel', 'rail', 'paymentOption', 'payerPhone', 'memberName', 'amount', 'status', 'date'];
    const title = 'Transactions Report';

    this.exportService.exportToPdf(
      exportData,
      columns,
      'transactions',
      title
    );
  }

  private getExportData(): Array<Record<string, string | number>> {
    return this.filteredTransactions.map(transaction => ({
      reference: transaction.reference,
      productId: transaction.productId,
      originChannel: transaction.originChannel,
      rail: transaction.rail,
      paymentOption: transaction.paymentOption,
      payerPhone: transaction.payerPhone,
      memberName: this.memberNameOf(transaction),
      amount: transaction.amount,
      status: transaction.status,
      date: new Date(this.dateOf(transaction)).toLocaleDateString()
    }));
  }

}
