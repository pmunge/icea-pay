import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/env';

import { Transaction } from '../models/transactions';

interface PaymentsResponse {
  status: number;
  success: boolean;
  message: string;
  data: Transaction[];
}

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  private http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/payments`;

  /** Fetches a large page so the table's own search/pagination has the full set to work with. */
  getTransactions(page = 0, size = 1000): Observable<Transaction[]> {
    return this.http
      .get<PaymentsResponse>(`${this.apiUrl}?page=${page}&size=${size}`)
      .pipe(map((res) => res.data));
  }
}
