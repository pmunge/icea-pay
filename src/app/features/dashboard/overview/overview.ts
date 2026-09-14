import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { DashboardView } from '../../../shared/dashboard-view/dashboard-view';
import { AnalyticsService } from '../../../core/services/analytics';


/**
 * Default HQ dashboard — every business unit, no scope filter.
 */
@Component({
  selector: 'app-dashboard-overview',
  imports: [DashboardView],
  template: `
    <app-dashboard-view
      [transactions]="transactions"
      title="Group Performance Dashboard"
      subtitle="Combined premium inflow and transaction activity across Life, General, Medical and Investment" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Overview {
  protected readonly transactions = inject(AnalyticsService).getTransactions();
}
