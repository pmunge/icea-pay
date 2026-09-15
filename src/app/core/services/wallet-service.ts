import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/env';

import { Wallet, WalletBalance, WalletTransaction, WalletWithdrawalRequest } from '../models/wallet';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/wallets`;

  getBalances(): Observable<WalletBalance[]> {
    return this.http.get<WalletBalance[]>(`${this.apiUrl}/balances`);
  }

  getWallet(paybillNo: string): Observable<Wallet> {
    return this.http.get<Wallet>(`${this.apiUrl}/${paybillNo}`);
  }

  getTransactions(paybillNo: string): Observable<WalletTransaction[]> {
    return this.http.get<WalletTransaction[]>(`${this.apiUrl}/${paybillNo}/transactions`);
  }

  withdraw(paybillNo: string, withdrawal: WalletWithdrawalRequest): Observable<WalletTransaction> {
    return this.http.post<WalletTransaction>(`${this.apiUrl}/${paybillNo}/withdraw`, withdrawal);
  }
}
