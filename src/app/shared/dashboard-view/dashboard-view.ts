import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartConfiguration, ChartOptions, TooltipItem } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import {
  AnalyticsTxn,
  BusinessUnit,
  DashboardScope,
  TimeGranularity,
} from '../../core/models/analytics';
import {
  Breakdown,
  computeDashboard,
  GRANULARITY_LABELS,
  TIME_GRANULARITIES,
} from '../../core/data/dashboard-analytics';
import { Transaction } from '../../core/models/transactions';
import { TransactionsTable } from '../transactions-table/transactions-table';

/** Line-series colours — one per business unit (matches the unit dashboards). */
const PRODUCT_COLORS = ['#146C94', '#19A7CE', '#7E57C2', '#E49B3B'];

/**
 * Monochrome pie palettes, one per pie, taken verbatim from the per-business
 * unit dashboards so the two views read as one product.
 */
const PIE_PALETTES = [
  ['#146C94', '#55B8D2', '#B2E2EE', '#D8F0F5'],
  ['#19A7CE', '#9ADCEC', '#D7F3F8', '#EAF9FB'],
  ['#7E57C2', '#AA92DD', '#D2C7ED', '#ECE7F8'],
  ['#E49B3B', '#F0BF77', '#F8DDB4', '#FCEEDC'],
];

/**
 * Reusable analytics dashboard.
 *
 *   <app-dashboard-view [transactions]="txns" />                         (all units)
 *   <app-dashboard-view [transactions]="txns" [scope]="{ businessUnit: 'Life' }" />
 *   <app-dashboard-view [transactions]="txns" [scope]="{ branch: 'Nakuru' }" />
 *
 * The Hourly / Daily / Weekly / Monthly filter drives every card, line chart
 * and pie, and all of them read from the same scoped, windowed dataset.
 */
@Component({
  selector: 'app-dashboard-view',
  imports: [CommonModule, BaseChartDirective, TransactionsTable],
  templateUrl: './dashboard-view.html',
  styleUrl: './dashboard-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardView {
  readonly transactions = input.required<AnalyticsTxn[]>();
  /** Real (non-synthetic) transactions for the log table below the charts. */
  readonly realTransactions = input<Transaction[]>([]);
  readonly scope = input<DashboardScope>({});
  readonly title = input('Group Performance Dashboard');
  readonly subtitle = input(
    'Combined premium inflow and transaction activity across all business units'
  );

  /** Global time filter — defaults to Daily. */
  readonly granularity = signal<TimeGranularity>('daily');

  readonly granularities = TIME_GRANULARITIES;

  /** Fixed per instance so trend comparisons stay stable while filtering. */
  private readonly now = Date.now();

  private readonly nfFull = new Intl.NumberFormat('en');
  private readonly nfCompact = new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  });

  readonly model = computed(() =>
    computeDashboard(
      this.transactions(),
      this.scope(),
      this.granularity(),
      this.now
    )
  );

  readonly scopedToUnit = computed(() => !!this.scope().businessUnit);

  readonly visibleUnitTotals = computed(() => {
    const unit = this.scope().businessUnit;
    const totals = this.model().totals;
    return unit ? totals.filter((t) => t.unit === unit) : totals;
  });

  readonly windowCaption = computed(() => {
    const w = this.model().window;
    const fmt = (ms: number) =>
      new Date(ms).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    const updated = new Date(w.end).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${fmt(w.start)} – ${fmt(w.end)} · ${GRANULARITY_LABELS[w.granularity]} intervals · updated ${updated}`;
  });

  /* ---------- line charts (one line per business unit) ---------- */

  readonly moneyChartData = computed(() => this.lineData('money'));
  readonly countChartData = computed(() => this.lineData('count'));

  private lineData(kind: 'money' | 'count'): ChartConfiguration<'line'>['data'] {
    const model = this.model();
    return {
      labels: model.seriesLabels,
      datasets: model.unitSeries
        .filter(
          (s) => !this.scope().businessUnit || s.unit === this.scope().businessUnit
        )
        .map((s, i) => {
          const color = PRODUCT_COLORS[i % PRODUCT_COLORS.length];
          return {
            label: s.unit,
            data: kind === 'money' ? s.money : s.count,
            borderColor: color,
            backgroundColor: color,
            pointBackgroundColor: color,
            tension: 0,
            fill: false,
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5,
          };
        }),
    };
  }

  readonly lineOptionsMoney = this.lineOptions('money');
  readonly lineOptionsCount = this.lineOptions('count');

  private lineOptions(kind: 'money' | 'count'): ChartOptions<'line'> {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 16,
            boxWidth: 8,
            font: { size: 11 },
          },
        },
        tooltip: {
          callbacks: {
            label: (item: TooltipItem<'line'>) => {
              const y = Number(item.parsed.y ?? 0);
              return kind === 'money'
                ? `${item.dataset.label}: KES ${this.nfFull.format(Math.round(y))}`
                : `${item.dataset.label}: ${this.nfFull.format(y)} txns`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 8 },
        },
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(13, 26, 99, 0.06)' },
          ticks: {
            maxTicksLimit: 6,
            callback: (value) =>
              kind === 'money'
                ? `KES ${this.nfCompact.format(Number(value))}`
                : this.nfCompact.format(Number(value)),
          },
        },
      },
    };
  }

  /* ---------- pie charts ---------- */

  readonly moneyByUnitPie = computed(() =>
    this.pieData(this.model().moneyByUnit, PIE_PALETTES[0])
  );

  readonly countByUnitPie = computed(() =>
    this.pieData(this.model().countByUnit, PIE_PALETTES[1])
  );

  readonly paymentMethodPie = computed(() =>
    this.pieData(this.model().byPaymentMethod, PIE_PALETTES[2])
  );

  readonly channelPie = computed(() =>
    this.pieData(this.model().byChannel, PIE_PALETTES[3])
  );

  private pieData(
    breakdown: Breakdown,
    palette: string[]
  ): ChartConfiguration<'pie'>['data'] {
    return {
      labels: breakdown.labels,
      datasets: [
        {
          data: breakdown.values,
          backgroundColor: breakdown.values.map(
            (_, i) => palette[i % palette.length]
          ),
          borderColor: '#ffffff',
          borderWidth: 2,
        },
      ],
    };
  }

  readonly pieOptionsMoney = this.pieOptions('money');
  readonly pieOptionsCount = this.pieOptions('count');

  private pieOptions(kind: 'money' | 'count'): ChartOptions<'pie'> {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { boxWidth: 10, padding: 10, font: { size: 11 } },
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
            },
          },
        },
      },
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
