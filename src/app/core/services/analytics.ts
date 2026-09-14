import { Injectable } from '@angular/core';

import { AnalyticsTxn } from '../models/analytics';
import { analyticsTransactions } from '../data/analytics-data';

/**
 * Supplies the raw transaction feed that powers the dashboards.
 *
 * Today this returns the seeded in-memory dataset; swapping in a real
 * `HttpClient` call here is all that's needed to go live, since every
 * dashboard consumes transactions through this one method.
 */
@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  getTransactions(): AnalyticsTxn[] {
    return analyticsTransactions;
  }
}
