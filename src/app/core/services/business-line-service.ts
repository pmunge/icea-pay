import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/env';

import { BusinessLine } from '../models/business-line';

interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class BusinessLineService {
  private http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/business-lines`;

  getBusinessLines(): Observable<BusinessLine[]> {
    return this.http
      .get<ApiResponse<BusinessLine[]>>(this.apiUrl)
      .pipe(map((res) => res.data));
  }
}
