import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/env';

import { Paybill, PaybillRequest, PaybillAllocate, withdrawPaybill } from '../models/paybills';

interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class FinanceService {
  private http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/paybills`;

  getPaybills(): Observable<Paybill[]> {
    return this.http
      .get<ApiResponse<Paybill[]>>(this.apiUrl)
      .pipe(map((res) => res.data));
  }

  createPaybill(paybill: PaybillRequest): Observable<Paybill> {
    return this.http
      .post<ApiResponse<Paybill>>(this.apiUrl, paybill)
      .pipe(map((res) => res.data));
  }

  updatePaybill(id: number, paybill: PaybillRequest): Observable<Paybill> {
    return this.http
      .put<ApiResponse<Paybill>>(`${this.apiUrl}/${id}`, paybill)
      .pipe(map((res) => res.data));
  }

  deletePaybill(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(map(() => void 0));
  }
  allocatePaybill(allocation: PaybillAllocate): Observable<Paybill> {
    return this.http
      .post<ApiResponse<Paybill>>(`${this.apiUrl}/allocate`, allocation)
      .pipe(map((res) => res.data));
  }

  withdraw(id: number, withdrawal: withdrawPaybill): Observable<Paybill> {
    return this.http
      .post<ApiResponse<Paybill>>(`${this.apiUrl}/${id}/withdraw`, withdrawal)
      .pipe(map((res) => res.data));
  }
}
