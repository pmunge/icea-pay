import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, map } from 'rxjs'
import { Profiles } from '../models/profile';

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
export class Profile {

  private http = inject(HttpClient)
  private readonly apiUrl = `${environment.apiUrl}/profiles`

  getProfiles(): Observable<Profiles[]> {
    return this.http
      .get<ApiResponse<Profiles[]>>(this.apiUrl)
      .pipe(map((res) => res.data))
  }
  createProfiles(profile: Profiles): Observable<Profiles> {
    return this.http
      .post<ApiResponse<Profiles>>(this.apiUrl, profile)
      .pipe(map((res) => res.data))
  }

}
