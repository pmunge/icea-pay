/**
 * Analytics domain model.
 *
 * Every number shown on a dashboard — summary cards, time-series charts and
 * the donut breakdowns — is derived from a single list of `AnalyticsTxn`
 * records so the figures always reconcile with one another.
 */

export type BusinessUnit = 'Life' | 'General' | 'Medical' | 'Investment';

export type PaymentMethod = 'MoMo' | 'Cards' | 'Bank Account';

export type TxnChannel = 'USSD' | 'Mobile App';

/** Time bucket used by the global dashboard filter. */
export type TimeGranularity = 'hourly' | 'daily' | 'weekly' | 'monthly';

export interface AnalyticsTxn {
  id: string;
  businessUnit: BusinessUnit;
  paymentMethod: PaymentMethod;
  channel: TxnChannel;
  branch: string;
  /** Gross premium / contribution amount in KES. */
  amount: number;
  /** Epoch milliseconds. */
  timestamp: number;
}

/**
 * Narrows the underlying transaction set for a specific dashboard.
 * The default (HQ) dashboard passes an empty scope; a unit dashboard passes
 * `{ businessUnit: 'Life' }`; a branch dashboard passes `{ branch: 'Nakuru' }`.
 */
export interface DashboardScope {
  businessUnit?: BusinessUnit;
  branch?: string;
}

export const BUSINESS_UNITS: BusinessUnit[] = [
  'Life',
  'General',
  'Medical',
  'Investment',
];

export const PAYMENT_METHODS: PaymentMethod[] = ['MoMo', 'Cards', 'Bank Account'];

export const TXN_CHANNELS: TxnChannel[] = ['USSD', 'Mobile App'];

export const TIME_GRANULARITIES: TimeGranularity[] = [
  'hourly',
  'daily',
  'weekly',
  'monthly',
];
