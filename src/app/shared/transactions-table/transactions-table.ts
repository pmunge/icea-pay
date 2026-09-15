import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

import { Transaction, transactionMemberName } from '../../core/models/transactions';

/** Rolling-window filter applied on top of the free-text search. */
export type PeriodFilter = 'all' | 'daily' | 'weekly' | 'monthly';

/**
 * Paginated transaction log dropped below a dashboard's charts. Given a
 * (possibly pre-scoped) transaction list, it just sorts, searches and pages
 * it — filtering by business unit or branch is the caller's job.
 */
@Component({
  selector: 'app-transactions-table',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTableModule,
  ],
  templateUrl: './transactions-table.html',
  styleUrl: './transactions-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsTable {
  readonly transactions = input.required<Transaction[]>();

  readonly searchTerm = signal('');
  readonly periodFilter = signal<PeriodFilter>('all');
  readonly pageIndex = signal(0);
  readonly pageSize = signal(5);

  readonly pageSizeOptions = [5, 10, 25];
  readonly periodOptions: { value: PeriodFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];
  readonly displayedColumns = [
    'index',
    'reference',
    'productId',
    'originChannel',
    'paymentOption',
    'memberName',
    'amount',
    'status',
    'date',
  ];

  dateOf(transaction: Transaction): string {
    return transaction.completedAt ?? transaction.initiatedAt ?? transaction.createdAt;
  }

  memberNameOf(transaction: Transaction): string {
    return transactionMemberName(transaction);
  }

  private readonly sorted = computed(() =>
    [...this.transactions()].sort(
      (a, b) => new Date(this.dateOf(b)).getTime() - new Date(this.dateOf(a)).getTime()
    )
  );

  readonly filtered = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const period = this.periodFilter();
    const rows = this.sorted().filter((t) => this.isWithinPeriod(this.dateOf(t), period));
    if (!term) return rows;
    return rows.filter((t) =>
      [t.reference, t.productId, t.originChannel, t.paymentOption, t.payerPhone, this.memberNameOf(t), t.amount, t.status]
        .some((value) => String(value ?? '').toLowerCase().includes(term))
    );
  });

  private isWithinPeriod(dateValue: string, period: PeriodFilter): boolean {
    if (period === 'all') return true;
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return false;

    const now = new Date();
    if (period === 'daily') {
      return date.toDateString() === now.toDateString();
    }
    if (period === 'monthly') {
      return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
    }

    const daysSinceMonday = (now.getDay() + 6) % 7;
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysSinceMonday);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);
    return date >= startOfWeek && date < endOfWeek;
  }

  readonly paged = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filtered().slice(start, start + this.pageSize());
  });

  applySearch(value: string): void {
    this.searchTerm.set(value);
    this.pageIndex.set(0);
  }

  applyPeriod(value: PeriodFilter): void {
    this.periodFilter.set(value);
    this.pageIndex.set(0);
  }

  changePage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }
}
