import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Users } from '../models/users';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/users';

  getUsers(
    type?: 'personal' | 'business'
  ): Observable<Users[]> {
    const url = type ? `${this.apiUrl}?type=${type}` : this.apiUrl;
    return this.http.get<Users[]>(url);
  }

  createUser(user: Users): Observable<Users> {
    return this.http.post<Users>(
      this.apiUrl,
      user
    );
  }

  updateUser(
    id: number,
    user: Users
  ): Observable<Users> {
    return this.http.put<Users>(
      `${this.apiUrl}/${id}`,
      user
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}
