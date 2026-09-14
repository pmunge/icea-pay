import { Component, inject } from '@angular/core';

import { CategoryPerformance } from '../../../shared/category-performance/category-performance';
import { TransactionsTable } from '../../../shared/transactions-table/transactions-table';

import { investmentDashboardData } from '../../../core/data/category-performance-data';
import { applyScope } from '../../../core/data/dashboard-analytics';
import { AnalyticsService } from '../../../core/services/analytics';


@Component({
  selector: 'app-product-performance',
  imports: [CategoryPerformance, TransactionsTable],
  template: `
    <app-category-performance [data]="data" [transactions]="allTransactions" [businessUnit]="'Investment'" />
    <app-transactions-table [transactions]="transactions" />
  `
})
export class ProductPerformance {

  data = investmentDashboardData;

  allTransactions = inject(AnalyticsService).getTransactions();

  transactions = applyScope(this.allTransactions, { businessUnit: 'Investment' });

}
