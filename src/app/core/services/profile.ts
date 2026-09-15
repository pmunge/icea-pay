import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, map } from 'rxjs'
import { Profile } from '../models/profile';

import { environment } from '../../../environments/env';


interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}
@Injectable({
  providedIn: 'root',
})
export class ProfileService {

  private http = inject(HttpClient)
  private readonly apiUrl = `${environment.apiUrl}/profiles`

  getProfiles(): Observable<Profile[]> {
    return this.http
      .get<ApiResponse<Profile[]>>(this.apiUrl)
      .pipe(map((res) => res.data))
  }
  createProfile(profile: Profile): Observable<Profile> {
    return this.http
      .post<ApiResponse<Profile>>(this.apiUrl, profile)
      .pipe(map((res) => res.data))
  }

}
