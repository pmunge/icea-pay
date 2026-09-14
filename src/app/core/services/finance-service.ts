import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { paybillsRequest, paybillsResponse } from '../models/paybills';

@Injectable({
  providedIn: 'root',
})
export class FinanceService {
  private http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/paybills';

  createPaybill(paybill: paybillsRequest): Observable<paybillsResponse> {
    return this.http.post<paybillsResponse>(this.apiUrl, paybill);
  }

  // Get all paybills
  getPaybills(): Observable<paybillsResponse[]> {
    return this.http.get<paybillsResponse[]>(this.apiUrl);
  }

  // Update paybill (partial - e.g. amount, status)
  updatePaybill(id: string, paybill: Partial<paybillsRequest>): Observable<paybillsResponse> {
    return this.http.patch<paybillsResponse>(`${this.apiUrl}/${id}`, paybill);
  }

  // Delete paybill
  deletePaybill(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
