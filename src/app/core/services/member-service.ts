import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/env';

import { Members } from '../models/members';

interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/members`;

  getMembers(roles?: string[]): Observable<Members[]> {
    let params = new HttpParams();
    if (roles?.length) {
      params = params.set('roles', roles.join(','));
    }

    return this.http
      .get<ApiResponse<Members[]>>(this.apiUrl, { params })
      .pipe(map((res) => res.data));
  }

  searchMembers(query: string): Observable<Members[]> {
    const params = new HttpParams().set('q', query);

    return this.http
      .get<ApiResponse<Members[]>>(`${this.apiUrl}/search`, { params })
      .pipe(map((res) => res.data));
  }

  getMemberByNumber(memberNo: string): Observable<Members> {
    return this.http
      .get<ApiResponse<Members>>(`${this.apiUrl}/${memberNo}`)
      .pipe(map((res) => res.data));
  }
}
