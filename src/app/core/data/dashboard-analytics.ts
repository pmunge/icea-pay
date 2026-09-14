/**
 * Pure aggregation layer shared by every dashboard.
 *
 * `computeDashboard()` takes the full transaction list, a scope (business unit
 * and/or branch) and the selected time granularity, and returns every figure
 * the dashboard renders. Because all outputs come from one filtered list, the
 * summary cards, the time-series charts and the donut breakdowns are always
 * consistent with each other.
 */

import {
  AnalyticsTxn,
  BUSINESS_UNITS,
  BusinessUnit,
  DashboardScope,
  PAYMENT_METHODS,
  TIME_GRANULARITIES,
  TimeGranularity,
  TXN_CHANNELS,
} from '../models/analytics';

const DAY_MS = 24 * 60 * 60 * 1000;

export interface Bucket {
  start: number;
  end: number;
  label: string;
}

export interface TimeWindow {
  start: number;
  end: number;
  granularity: TimeGranularity;
  buckets: Bucket[];
}

export interface Series {
  labels: string[];
  data: number[];
}

/** Per-business-unit time series over the same bucket labels. */
export interface UnitSeries {
  unit: BusinessUnit;
  money: number[];
  count: number[];
}

export interface Breakdown {
  labels: string[];
  values: number[];
}

export interface UnitTotal {
  unit: BusinessUnit;
  money: number;
  count: number;
  avgTicket: number;
  /**
   * Momentum within the visible window: percentage change in money between
   * its first and second half. Always defined from data inside the window.
   */
  trendPct: number;
}

export interface DashboardModel {
  granularity: TimeGranularity;
  window: TimeWindow;
  /** Totals per business unit for the visible window. */
  totals: UnitTotal[];
  /** Combined totals across every unit in scope. */
  overall: {
    money: number;
    count: number;
    avgTicket: number;
    trendMoneyPct: number;
    trendCountPct: number;
  };
  /** Shared x-axis labels for the time-series charts. */
  seriesLabels: string[];
  /** One line per business unit, for the "over time" charts. */
  unitSeries: UnitSeries[];
  moneyByUnit: Breakdown;
  countByUnit: Breakdown;
  byPaymentMethod: Breakdown;
  byChannel: Breakdown;
}

export const GRANULARITY_LABELS: Record<TimeGranularity, string> = {
  hourly: 'Hourly',
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

export { TIME_GRANULARITIES };

/* ---------- windowing ---------- */

function labelFor(granularity: TimeGranularity, start: number): string {
  const d = new Date(start);
  if (granularity === 'hourly') {
    return d.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }
  if (granularity === 'monthly') {
    return d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });
  }
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

/**
 * Build the contiguous set of buckets for a granularity, ending at `now`.
 * Bucket sizes: 48×1h, 30×1d, 12×1w (Mon-aligned), 12 calendar months.
 */
export function resolveWindow(
  granularity: TimeGranularity,
  now: number = Date.now()
): TimeWindow {
  const buckets: Bucket[] = [];

  if (granularity === 'monthly') {
    const count = 12;
    const anchor = new Date(now);
    anchor.setDate(1);
    anchor.setHours(0, 0, 0, 0);
    const first = new Date(anchor);
    first.setMonth(first.getMonth() - (count - 1));

    for (let i = 0; i < count; i++) {
      const bs = new Date(first);
      bs.setMonth(first.getMonth() + i);
      const be = new Date(bs);
      be.setMonth(bs.getMonth() + 1);
      buckets.push({
        start: bs.getTime(),
        end: be.getTime(),
        label: labelFor('monthly', bs.getTime()),
      });
    }
    return { start: buckets[0].start, end: now, granularity, buckets };
  }

  let count: number;
  let size: number;
  const anchor = new Date(now);

  if (granularity === 'hourly') {
    count = 48;
    size = 60 * 60 * 1000;
    anchor.setMinutes(0, 0, 0);
  } else if (granularity === 'daily') {
    count = 30;
    size = DAY_MS;
    anchor.setHours(0, 0, 0, 0);
  } else {
    count = 12;
    size = 7 * DAY_MS;
    const mondayOffset = (anchor.getDay() + 6) % 7;
    anchor.setDate(anchor.getDate() - mondayOffset);
    anchor.setHours(0, 0, 0, 0);
  }

  const startTime = anchor.getTime() - (count - 1) * size;
  for (let i = 0; i < count; i++) {
    const bs = startTime + i * size;
    buckets.push({ start: bs, end: bs + size, label: labelFor(granularity, bs) });
  }
  return { start: startTime, end: now, granularity, buckets };
}

/* ---------- filtering ---------- */

export function applyScope(
  txns: AnalyticsTxn[],
  scope: DashboardScope
): AnalyticsTxn[] {
  return txns.filter(
    (t) =>
      (!scope.businessUnit || t.businessUnit === scope.businessUnit) &&
      (!scope.branch || t.branch === scope.branch)
  );
}

function inRange(txns: AnalyticsTxn[], start: number, end: number): AnalyticsTxn[] {
  return txns.filter((t) => t.timestamp >= start && t.timestamp < end);
}

/* ---------- aggregation ---------- */

const sum = (values: number[]): number => values.reduce((a, b) => a + b, 0);

function bucketIndex(window: TimeWindow, timestamp: number): number {
  // Buckets are contiguous and ascending, so a scan from the end is cheap and
  // also copes with the uneven lengths of calendar months.
  for (let i = window.buckets.length - 1; i >= 0; i--) {
    if (timestamp >= window.buckets[i].start) {
      return timestamp < window.buckets[i].end ? i : -1;
    }
  }
  return -1;
}

function buildUnitSeries(
  txns: AnalyticsTxn[],
  window: TimeWindow
): { labels: string[]; unitSeries: UnitSeries[] } {
  const labels = window.buckets.map((b) => b.label);

  const money = {} as Record<BusinessUnit, number[]>;
  const count = {} as Record<BusinessUnit, number[]>;
  for (const unit of BUSINESS_UNITS) {
    money[unit] = window.buckets.map(() => 0);
    count[unit] = window.buckets.map(() => 0);
  }

  for (const t of txns) {
    const idx = bucketIndex(window, t.timestamp);
    if (idx === -1) continue;
    money[t.businessUnit][idx] += t.amount;
    count[t.businessUnit][idx] += 1;
  }

  return {
    labels,
    unitSeries: BUSINESS_UNITS.map((unit) => ({
      unit,
      money: money[unit],
      count: count[unit],
    })),
  };
}

function unitTotals(
  windowTxns: AnalyticsTxn[],
  midpoint: number
): UnitTotal[] {
  return BUSINESS_UNITS.map((unit) => {
    const cur = windowTxns.filter((t) => t.businessUnit === unit);
    const money = sum(cur.map((t) => t.amount));
    const firstHalf = sum(
      cur.filter((t) => t.timestamp < midpoint).map((t) => t.amount)
    );
    const secondHalf = money - firstHalf;

    return {
      unit,
      money,
      count: cur.length,
      avgTicket: cur.length ? money / cur.length : 0,
      trendPct: pctChange(secondHalf, firstHalf),
    };
  });
}

function pctChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

function breakdown<T extends string>(
  txns: AnalyticsTxn[],
  keys: readonly T[],
  keyFn: (t: AnalyticsTxn) => T,
  metric: 'money' | 'count'
): Breakdown {
  const values = keys.map((key) => {
    const rows = txns.filter((t) => keyFn(t) === key);
    return metric === 'money' ? sum(rows.map((r) => r.amount)) : rows.length;
  });
  return { labels: [...keys], values };
}

/* ---------- entry point ---------- */

export function computeDashboard(
  allTxns: AnalyticsTxn[],
  scope: DashboardScope,
  granularity: TimeGranularity,
  now: number = Date.now()
): DashboardModel {
  const window = resolveWindow(granularity, now);
  const scoped = applyScope(allTxns, scope);

  const windowTxns = inRange(scoped, window.start, window.end);
  const midpoint = window.start + (window.end - window.start) / 2;
  const firstHalf = windowTxns.filter((t) => t.timestamp < midpoint);

  const series = buildUnitSeries(windowTxns, window);
  const totals = unitTotals(windowTxns, midpoint);

  const money = sum(windowTxns.map((t) => t.amount));
  const firstHalfMoney = sum(firstHalf.map((t) => t.amount));

  return {
    granularity,
    window,
    totals,
    overall: {
      money,
      count: windowTxns.length,
      avgTicket: windowTxns.length ? money / windowTxns.length : 0,
      trendMoneyPct: pctChange(money - firstHalfMoney, firstHalfMoney),
      trendCountPct: pctChange(
        windowTxns.length - firstHalf.length,
        firstHalf.length
      ),
    },
    seriesLabels: series.labels,
    unitSeries: series.unitSeries,
    moneyByUnit: breakdown(windowTxns, BUSINESS_UNITS, (t) => t.businessUnit, 'money'),
    countByUnit: breakdown(windowTxns, BUSINESS_UNITS, (t) => t.businessUnit, 'count'),
    byPaymentMethod: breakdown(
      windowTxns,
      PAYMENT_METHODS,
      (t) => t.paymentMethod,
      'money'
    ),
    byChannel: breakdown(windowTxns, TXN_CHANNELS, (t) => t.channel, 'count'),
  };
}
