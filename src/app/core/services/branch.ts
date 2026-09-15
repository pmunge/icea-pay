import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/env';

import { Branches } from '../models/branch';

interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class Branch {
  private http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/branches`;

  getBranches(activeOnly = false): Observable<Branches[]> {
    const params = new HttpParams().set('activeOnly', activeOnly);

    return this.http
      .get<ApiResponse<Branches[]>>(this.apiUrl, { params })
      .pipe(map((res) => res.data));
  }

  getBranch(id: number): Observable<Branches> {
    return this.http
      .get<ApiResponse<Branches>>(`${this.apiUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  createBranch(branch: Pick<Branches, 'name' | 'code' | 'location' | 'phoneNumber'>): Observable<Branches> {
    return this.http
      .post<ApiResponse<Branches>>(this.apiUrl, branch)
      .pipe(map((res) => res.data));
  }

  updateBranch(
    id: number,
    branch: Pick<Branches, 'name' | 'code' | 'location' | 'phoneNumber'>
  ): Observable<Branches> {
    return this.http
      .put<ApiResponse<Branches>>(`${this.apiUrl}/${id}`, branch)
      .pipe(map((res) => res.data));
  }

  deactivateBranch(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(map(() => void 0));
  }
}
