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
import { MatTableModule } from '@angular/material/table';

import { AnalyticsTxn } from '../../core/models/analytics';

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
    MatTableModule,
  ],
  templateUrl: './transactions-table.html',
  styleUrl: './transactions-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsTable {
  readonly transactions = input.required<AnalyticsTxn[]>();

  readonly searchTerm = signal('');
  readonly pageIndex = signal(0);
  readonly pageSize = signal(5);

  readonly pageSizeOptions = [5, 10, 25];
  readonly displayedColumns = [
    'businessUnit',
    'branch',
    'paymentMethod',
    'channel',
    'amount',
    'date',
  ];

  private readonly sorted = computed(() =>
    [...this.transactions()].sort((a, b) => b.timestamp - a.timestamp)
  );

  readonly filtered = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const rows = this.sorted();
    if (!term) return rows;
    return rows.filter((t) =>
      [t.businessUnit, t.branch, t.paymentMethod, t.channel, t.amount.toString()]
        .some((value) => value.toLowerCase().includes(term))
    );
  });

  readonly paged = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filtered().slice(start, start + this.pageSize());
  });

  applySearch(value: string): void {
    this.searchTerm.set(value);
    this.pageIndex.set(0);
  }

  changePage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }
}
