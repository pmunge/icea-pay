/**
 * Synthetic transaction feed for the analytics dashboards.
 *
 * A real deployment would stream these rows from the payments ledger; here we
 * generate a large, seeded set so the charts show realistic intraday peaks,
 * weekday seasonality and a slow growth trend. Generation is deterministic for
 * the lifetime of the browser session, so every widget on every dashboard
 * reads exactly the same underlying data.
 */

import {
  AnalyticsTxn,
  BusinessUnit,
  PaymentMethod,
  TxnChannel,
} from '../models/analytics';

/* ---------- deterministic PRNG (mulberry32) ---------- */

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function weightedPick<T>(rng: () => number, entries: [T, number][]): T {
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let roll = rng() * total;
  for (const [value, weight] of entries) {
    roll -= weight;
    if (roll <= 0) return value;
  }
  return entries[entries.length - 1][0];
}

/** Rough standard-normal sample in ~[-1, 1] via the central limit theorem. */
function gaussish(rng: () => number): number {
  return (rng() + rng() + rng() - 1.5) / 1.5;
}

/* ---------- shape parameters ---------- */

// Long enough to fully populate the 12-month and 12-week views while keeping
// the recent days dense enough for the hourly view.
const WINDOW_DAYS = 400;
const DAY_MS = 24 * 60 * 60 * 1000;

const BRANCHES: [string, number][] = [
  ['Nairobi', 0.4],
  ['Mombasa', 0.19],
  ['Kisumu', 0.15],
  ['Nakuru', 0.16],
  ['Eldoret', 0.1],
];

// Relative volume across the 24 hours of a day — quiet overnight, twin
// mid-morning and mid-afternoon peaks, tapering into the evening.
const HOUR_WEIGHTS = [
  5, 4, 3, 3, 4, 6, 9, 13, 17, 20, 23, 25, 24, 21, 23, 25, 22, 18, 15, 12, 10, 8,
  7, 6,
];

// Sun..Sat — business slows over the weekend.
const DOW_WEIGHTS = [0.6, 1.05, 1.12, 1.1, 1.08, 1.14, 0.68];

interface UnitConfig {
  unit: BusinessUnit;
  share: number;
  /** Median ticket size in KES. */
  ticket: number;
  /** Spread of the log-normal ticket distribution. */
  sigma: number;
  payment: [PaymentMethod, number][];
}

const UNIT_CONFIG: UnitConfig[] = [
  {
    unit: 'Life',
    share: 0.34,
    ticket: 3600,
    sigma: 0.7,
    payment: [
      ['MoMo', 0.64],
      ['Cards', 0.14],
      ['Bank Account', 0.22],
    ],
  },
  {
    unit: 'General',
    share: 0.24,
    ticket: 6200,
    sigma: 0.85,
    payment: [
      ['MoMo', 0.45],
      ['Cards', 0.28],
      ['Bank Account', 0.27],
    ],
  },
  {
    unit: 'Medical',
    share: 0.27,
    ticket: 4700,
    sigma: 0.75,
    payment: [
      ['MoMo', 0.5],
      ['Cards', 0.24],
      ['Bank Account', 0.26],
    ],
  },
  {
    unit: 'Investment',
    share: 0.15,
    ticket: 26000,
    sigma: 1.05,
    payment: [
      ['MoMo', 0.24],
      ['Cards', 0.16],
      ['Bank Account', 0.6],
    ],
  },
];

const CHANNEL_BY_PAYMENT: Record<PaymentMethod, [TxnChannel, number][]> = {
  MoMo: [
    ['USSD', 0.68],
    ['Mobile App', 0.32],
  ],
  Cards: [
    ['USSD', 0.15],
    ['Mobile App', 0.85],
  ],
  'Bank Account': [
    ['USSD', 0.3],
    ['Mobile App', 0.7],
  ],
};

/* ---------- generator ---------- */

function generateTransactions(seed: number, endTime: number): AnalyticsTxn[] {
  const rng = mulberry32(seed);
  const txns: AnalyticsTxn[] = [];

  const unitEntries = UNIT_CONFIG.map(
    (c) => [c, c.share] as [UnitConfig, number]
  );

  // Day 0 is `WINDOW_DAYS - 1` days ago; the final iteration is today, so the
  // most recent hours are populated for the hourly view.
  const startDay = new Date(endTime);
  startDay.setHours(0, 0, 0, 0);
  startDay.setDate(startDay.getDate() - (WINDOW_DAYS - 1));

  for (let day = 0; day < WINDOW_DAYS; day++) {
    const dayStart = startDay.getTime() + day * DAY_MS;
    const daysAgo = WINDOW_DAYS - 1 - day;
    const dow = new Date(dayStart).getDay();

    // Base volume: steady growth trend + two overlapping seasonal waves (so the
    // series has rolling peaks and dips rather than a straight line) + weekday
    // seasonality + a smooth bias toward recent days that keeps the hourly view
    // dense without distorting the weekly / monthly shape.
    const progress = day / WINDOW_DAYS;
    const trend = 35 + progress * 25;
    const wave =
      1 +
      0.2 * Math.sin(progress * Math.PI * 4) +
      0.1 * Math.sin(progress * Math.PI * 9 + 1);
    const recency = 1 + 2.6 * Math.pow(1 - daysAgo / WINDOW_DAYS, 2);
    const noise = 0.82 + rng() * 0.36;

    const dayVolume = Math.round(
      trend * wave * DOW_WEIGHTS[dow] * recency * noise
    );

    for (let i = 0; i < dayVolume; i++) {
      const hour = weightedPick(
        rng,
        HOUR_WEIGHTS.map((w, h) => [h, w] as [number, number])
      );
      const timestamp =
        dayStart +
        hour * 60 * 60 * 1000 +
        Math.floor(rng() * 60) * 60 * 1000 +
        Math.floor(rng() * 60) * 1000;

      if (timestamp > endTime) continue;

      const cfg = weightedPick(rng, unitEntries);
      const amount = Math.max(
        250,
        Math.round((cfg.ticket * Math.exp(cfg.sigma * gaussish(rng))) / 50) * 50
      );
      const paymentMethod = weightedPick(rng, cfg.payment);
      const channel = weightedPick(rng, CHANNEL_BY_PAYMENT[paymentMethod]);
      const branch = weightedPick(rng, BRANCHES);

      txns.push({
        id: `TXN-${day.toString().padStart(3, '0')}-${i
          .toString()
          .padStart(4, '0')}`,
        businessUnit: cfg.unit,
        paymentMethod,
        channel,
        branch,
        amount,
        timestamp,
      });
    }
  }

  return txns.sort((a, b) => a.timestamp - b.timestamp);
}

/** Fixed at module load so all widgets in a session share one dataset. */
export const ANALYTICS_GENERATED_AT = Date.now();

export const analyticsTransactions: AnalyticsTxn[] = generateTransactions(
  0x9e3779b9,
  ANALYTICS_GENERATED_AT
);
