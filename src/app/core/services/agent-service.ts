import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Agents } from '../models/agents';

@Injectable({
  providedIn: 'root',
})
export class AgentService {
  private http = inject(HttpClient)
  private readonly apiUrl = 'http://localhost:3000/agents';

  createAgent(agent: Agents): Observable<Agents> {
    return this.http.post<Agents>(this.apiUrl, agent);
  }
  loadAgents(): Observable<Agents[]> {
    return this.http.get<Agents[]>(this.apiUrl);
  }
  updateAgent(id: string, agent: Partial<Agents>): Observable<Agents> {
    return this.http.patch<Agents>(`${this.apiUrl}/${id}`, agent);
  }
  deleteAgent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
