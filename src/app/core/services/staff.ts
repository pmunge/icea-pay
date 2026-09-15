import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/env';

import { Staff } from '../models/staff';
import { RoleEntity } from '../models/roles';

interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class StaffService {
  private http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/staff`;

  getStaff(): Observable<Staff[]> {
    return this.http
      .get<ApiResponse<Staff[]>>(this.apiUrl)
      .pipe(map((res) => res.data));
  }

  getAllowedRoles(): Observable<RoleEntity[]> {
    return this.http
      .get<ApiResponse<RoleEntity[]>>(`${this.apiUrl}/roles`)
      .pipe(map((res) => res.data));
  }

  transferBranch(staffId: string, branchId: number | null): Observable<Staff> {
    return this.http
      .put<ApiResponse<Staff>>(`${this.apiUrl}/${staffId}/branch`, { branchId })
      .pipe(map((res) => res.data));
  }
}
