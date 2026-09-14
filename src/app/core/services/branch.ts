import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Branches } from '../models/branch';

@Injectable({
  providedIn: 'root',
})
export class Branch {
  private http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/branches';

  getBranches(): Observable<Branches[]> {
    return this.http.get<Branches[]>(this.apiUrl);
  }

  createBranch(branch: Branches): Observable<Branches> {
    return this.http.post<Branches>(
      this.apiUrl,
      branch
    );
  }

  updateBranch(
    id: number,
    branch: Branches
  ): Observable<Branches> {
    return this.http.put<Branches>(
      `${this.apiUrl}/${id}`,
      branch
    );
  }

  deleteBranch(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }

}
