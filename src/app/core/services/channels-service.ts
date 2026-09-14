import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Channels } from '../models/channels';

@Injectable({
  providedIn: 'root',
})
export class ChannelsService {
  private http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/channels';

  getChannels(): Observable<Channels[]> {
    return this.http.get<Channels[]>(this.apiUrl);
  }

  createChannel(channel: Channels): Observable<Channels> {
    return this.http.post<Channels>(
      this.apiUrl,
      channel
    );
  }

  updateChannel(
    id: number,
    channel: Channels
  ): Observable<Channels> {
    return this.http.put<Channels>(
      `${this.apiUrl}/${id}`,
      channel
    );
  }

  deleteChannel(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}
