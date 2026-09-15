import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs'
import { environment } from '../../../environments/env';
import { Roles } from '../models/roles';

interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class Role {
  private http = inject(HttpClient)
  private readonly apiUrl = `${environment.apiUrl}/roles`

  getRoles(): Observable<Roles[]> {
    return this.http
      .get<ApiResponse<Roles[]>>(this.apiUrl)
      .pipe(map((res) => res.data))
  }
  createRoles(role: Roles): Observable<Roles> {
    return this.http
      .post<ApiResponse<Roles>>(this.apiUrl, role)
      .pipe(map((res) => res.data))
  }
}
