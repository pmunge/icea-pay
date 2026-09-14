import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';

import {
  ChartConfiguration,
  ChartOptions,
  TooltipItem
} from 'chart.js';

import { BaseChartDirective } from 'ng2-charts';

import { CategoryDashboardData } from '../../core/data/category-performance-data';
import { AnalyticsTxn, BusinessUnit, TimeGranularity } from '../../core/models/analytics';
import {
  Breakdown,
  computeDashboard,
  GRANULARITY_LABELS,
  TIME_GRANULARITIES
} from '../../core/data/dashboard-analytics';


/**
 * Per-business-unit product performance. The Hourly / Daily / Weekly /
 * Monthly filter drives the same `computeDashboard` engine as the Group
 * Performance Dashboard, and this view mirrors that dashboard's structure:
 * two "over time" line charts (transactions and amount) and four breakdown
 * pies (transactions, account, channels and transaction method) — scoped to
 * this business unit instead of split across all four.
 */
@Component({
  selector: 'app-category-performance',
  imports: [
    CommonModule,
    MatCardModule,
    BaseChartDirective
  ],
  templateUrl: './category-performance.html',
  styleUrl: './category-performance.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryPerformance {

  readonly data = input.required<CategoryDashboardData>();
  readonly transactions = input.required<AnalyticsTxn[]>();
  readonly businessUnit = input.required<BusinessUnit>();

  private readonly productColours =
    ['#146C94', '#19A7CE', '#7E57C2', '#E49B3B'];

  /** One monochrome palette per pie, in the same order as the group dashboard. */
  private readonly pieColours = [
    ['#146C94', '#55B8D2', '#B2E2EE', '#D8F0F5'],
    ['#19A7CE', '#9ADCEC', '#D7F3F8', '#EAF9FB'],
    ['#7E57C2', '#AA92DD', '#D2C7ED', '#ECE7F8'],
    ['#E49B3B', '#F0BF77', '#F8DDB4', '#FCEEDC']
  ];

  /** Global time filter for this unit — defaults to Daily, like the group dashboard. */
  readonly granularity = signal<TimeGranularity>('daily');

  readonly granularities = TIME_GRANULARITIES;

  /** Fixed per instance so the window stays stable while filtering. */
  private readonly now = Date.now();

  private readonly nfFull = new Intl.NumberFormat('en');
  private readonly nfCompact = new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1
  });

  readonly model = computed(() =>
    computeDashboard(
      this.transactions(),
      { businessUnit: this.businessUnit() },
      this.granularity(),
      this.now
    )
  );

  /** This unit's totals for the selected window — feeds the pie/line captions. */
  readonly unitTotal = computed(() =>
    this.model().totals.find((t) => t.unit === this.businessUnit())
  );

  readonly windowCaption = computed(() => {
    const w = this.model().window;
    const fmt = (ms: number) =>
      new Date(ms).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    const updated = new Date(w.end).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return `${fmt(w.start)} – ${fmt(w.end)} · ${GRANULARITY_LABELS[w.granularity]} intervals · updated ${updated}`;
  });

  /** Each product's fixed share of the unit's static income total. */
  private readonly productShares = computed(() => {
    const products = this.data().products;
    const total = products.reduce((sum, p) => sum + p.income, 0) || 1;
    return products.map((p) => p.income / total);
  });

  /** Each product's fixed share of the unit's static transaction total. */
  private readonly productTransactionShares = computed(() => {
    const products = this.data().products;
    const total = products.reduce((sum, p) => sum + p.transactions, 0) || 1;
    return products.map((p) => p.transactions / total);
  });

  /** Product summary cards, with income and transactions recomputed for the selected window. */
  readonly productTotals = computed(() => {
    const unit = this.unitTotal();
    const money = unit?.money ?? 0;
    const count = unit?.count ?? 0;
    const moneyShares = this.productShares();
    const txnShares = this.productTransactionShares();
    return this.data().products.map((product, i) => ({
      ...product,
      windowIncome: Math.round(money * moneyShares[i]),
      windowTransactions: Math.round(count * txnShares[i])
    }));
  });


  /*
   * LINE CHARTS — one line per product, built from the unit's real
   * time-bucketed series split by each product's income/transaction share.
   */

  readonly transactionsChartData = computed<ChartConfiguration<'line'>['data']>(() =>
    this.productLineData('count')
  );

  readonly amountChartData = computed<ChartConfiguration<'line'>['data']>(() =>
    this.productLineData('money')
  );

  private productLineData(kind: 'money' | 'count'): ChartConfiguration<'line'>['data'] {
    const model = this.model();
    const unitSeries = model.unitSeries.find((s) => s.unit === this.businessUnit());
    const series = kind === 'money' ? unitSeries?.money : unitSeries?.count;
    const values = series ?? model.seriesLabels.map(() => 0);
    const shares = kind === 'money' ? this.productShares() : this.productTransactionShares();

    return {
      labels: model.seriesLabels,
      datasets: this.data().products.map((product, i) => ({
        label: product.name,
        data: values.map((v) => Math.round(v * shares[i])),
        tension: 0,
        fill: false,
        borderColor: this.productColours[i % this.productColours.length],
        backgroundColor: this.productColours[i % this.productColours.length],
        pointRadius: 3,
        pointHoverRadius: 5
      }))
    };
  }

  readonly lineOptionsCount = this.lineOptions('count');
  readonly lineOptionsMoney = this.lineOptions('money');

  private lineOptions(kind: 'money' | 'count'): ChartOptions<'line'> {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 18
          }
        },
        tooltip: {
          callbacks: {
            label: (context: TooltipItem<'line'>) => {
              const y = Number(context.parsed.y ?? 0);
              return kind === 'money'
                ? `${context.dataset.label}: KES ${this.nfFull.format(Math.round(y))}`
                : `${context.dataset.label}: ${this.nfFull.format(y)} txns`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 8 }
        },
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) =>
              kind === 'money'
                ? `KES ${this.nfCompact.format(Number(value))}`
                : this.nfCompact.format(Number(value))
          }
        }
      }
    };
  }


  /*
   * PIE CHARTS — transactions and account (both by product), plus channels
   * and transaction method (both scoped to this business unit).
   */

  readonly transactionsPie = computed(() =>
    this.pieData(this.productBreakdown('count'), this.pieColours[0])
  );

  readonly accountPie = computed(() =>
    this.pieData(this.productBreakdown('money'), this.pieColours[1])
  );

  readonly channelPie = computed(() =>
    this.pieData(this.model().byChannel, this.pieColours[2])
  );

  readonly paymentMethodPie = computed(() =>
    this.pieData(this.model().byPaymentMethod, this.pieColours[3])
  );

  private productBreakdown(kind: 'money' | 'count'): Breakdown {
    const totals = this.productTotals();
    return {
      labels: totals.map((p) => p.name),
      values: totals.map((p) => (kind === 'money' ? p.windowIncome : p.windowTransactions))
    };
  }

  private pieData(breakdown: Breakdown, palette: string[]): ChartConfiguration<'pie'>['data'] {
    return {
      labels: breakdown.labels,
      datasets: [
        {
          data: breakdown.values,
          backgroundColor: breakdown.values.map((_, i) => palette[i % palette.length]),
          borderColor: '#ffffff',
          borderWidth: 2
        }
      ]
    };
  }

  readonly pieOptionsCount = this.pieOptions('count');
  readonly pieOptionsMoney = this.pieOptions('money');

  private pieOptions(kind: 'money' | 'count'): ChartOptions<'pie'> {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 10,
            padding: 10,
            font: { size: 11 }
          }
        },
        tooltip: {
          callbacks: {
            label: (item: TooltipItem<'pie'>) => {
              const data = item.dataset.data as number[];
              const total = data.reduce((a, b) => a + Number(b), 0);
              const value = Number(item.parsed);
              const pct = total ? ((value / total) * 100).toFixed(1) : '0.0';
              return kind === 'money'
                ? ` ${item.label}: KES ${this.nfFull.format(value)} (${pct}%)`
                : ` ${item.label}: ${this.nfFull.format(value)} txns (${pct}%)`;
            }
          }
        }
      }
    };
  }

  /* ---------- template helpers ---------- */

  labelOf(granularity: TimeGranularity): string {
    return GRANULARITY_LABELS[granularity];
  }

  money(value: number): string {
    return `KES ${this.nfCompact.format(value)}`;
  }

  count(value: number): string {
    return this.nfFull.format(value);
  }

  setGranularity(value: string): void {
    this.granularity.set(value as TimeGranularity);
  }

}
