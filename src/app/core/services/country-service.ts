import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/env';

import { Country } from '../models/country';

interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/countries`;

  getCountries(): Observable<Country[]> {
    return this.http
      .get<ApiResponse<Country[]>>(this.apiUrl)
      .pipe(map((res) => res.data));
  }
}
