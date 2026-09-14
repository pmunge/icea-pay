import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Members } from '../models/members';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private http = inject(HttpClient)
  private readonly apiUrl = 'http://localhost:3000/members';

  loadMembers(): Observable<Members[]> {
    return this.http.get<Members[]>(this.apiUrl);
  }
  updateMember(id: string, member: Partial<Members>): Observable<Members> {
    return this.http.patch<Members>(`${this.apiUrl}/${id}`, member);
  }
  deleteMember(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
