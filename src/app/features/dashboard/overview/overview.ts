import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';

import { DashboardView } from '../../../shared/dashboard-view/dashboard-view';
import { AnalyticsService } from '../../../core/services/analytics';
import { TransactionsService } from '../../../core/services/transactions';
import { Transaction } from '../../../core/models/transactions';


/**
 * Default HQ dashboard — every business unit, no scope filter.
 */
@Component({
  selector: 'app-dashboard-overview',
  imports: [DashboardView],
  template: `
    <app-dashboard-view
      [transactions]="transactions"
      [realTransactions]="realTransactions()"
      title="Group Performance Dashboard"
      subtitle="Combined premium inflow and transaction activity across Life, General, Medical and Investment" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Overview implements OnInit {
  private readonly transactionsService = inject(TransactionsService);

  protected readonly transactions = inject(AnalyticsService).getTransactions();

  protected readonly realTransactions = signal<Transaction[]>([]);

  ngOnInit(): void {
    this.transactionsService.getTransactions().subscribe({
      next: (transactions) => this.realTransactions.set(transactions),
      error: (error) => console.error('Failed to load transactions', error)
    });
  }
}
