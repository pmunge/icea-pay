import { Component, OnInit, inject, signal } from '@angular/core';

import { CategoryPerformance } from '../../../shared/category-performance/category-performance';
import { TransactionsTable } from '../../../shared/transactions-table/transactions-table';

import { generalDashboardData } from '../../../core/data/category-performance-data';
import { AnalyticsService } from '../../../core/services/analytics';
import { TransactionsService } from '../../../core/services/transactions';
import { Transaction } from '../../../core/models/transactions';
import { BUSINESS_LINE_IDS } from '../../../core/models/product';


@Component({
  selector: 'app-product-performance',
  imports: [CategoryPerformance, TransactionsTable],
  template: `
    <app-category-performance [data]="data" [transactions]="allTransactions" [businessUnit]="'General'" />
    <app-transactions-table [transactions]="realTransactions()" />
  `
})
export class ProductPerformance implements OnInit {

  private readonly transactionsService = inject(TransactionsService);

  data = generalDashboardData;

  allTransactions = inject(AnalyticsService).getTransactions();

  readonly realTransactions = signal<Transaction[]>([]);

  ngOnInit(): void {
    this.transactionsService.getTransactions().subscribe({
      next: (transactions) => {
        this.realTransactions.set(
          transactions.filter((t) => t.businessLineId === BUSINESS_LINE_IDS['General'])
        );
      },
      error: (error) => console.error('Failed to load transactions', error)
    });
  }

}
