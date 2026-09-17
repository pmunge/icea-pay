import { ChangeDetectorRef, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

import { WalletBalance, WalletTransaction } from '../../../core/models/wallet';
import { WalletService } from '../../../core/services/wallet-service';
import { ExportService } from '../../../core/services/export';

type StatementPeriod = 'daily' | 'weekly';

@Component({
  selector: 'app-paybill-statement',

  imports: [
    CommonModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatIconModule,
    MatTableModule
  ],

  templateUrl: './statement.html',

  styleUrl: './statement.scss'
})
export class Statement {

  private readonly walletService = inject(WalletService);

  private readonly exportService = inject(ExportService);

  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  readonly paybill: WalletBalance = inject(MAT_DIALOG_DATA);

  readonly displayedColumns = ['time', 'amount', 'by', 'note'];

  readonly period = signal<StatementPeriod>('daily');

  readonly loading = signal(true);

  readonly error = signal<string | null>(null);

  private readonly withdrawals = signal<WalletTransaction[]>([]);

  /** Withdrawals within the selected window, most recent first — the window rolls forward automatically, so it resets on its own each new day/week. */
  readonly windowWithdrawals = computed(() => {
    const start = this.windowStart(this.period()).getTime();
    return this.withdrawals()
      .filter(txn => new Date(txn.createdAt).getTime() >= start)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  });

  readonly totalWithdrawn = computed(() =>
    this.windowWithdrawals().reduce((sum, txn) => sum + Number(txn.amount ?? 0), 0)
  );

  constructor() {
    this.loadTransactions();
  }

  setPeriod(period: StatementPeriod): void {
    this.period.set(period);
  }

  downloadPdf(): void {
    const rows = this.windowWithdrawals().map(txn => ({
      time: new Date(txn.createdAt).toLocaleString(),
      amount: Number(txn.amount ?? 0).toLocaleString('en', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }),
      by: this.withdrawnBy(txn),
      note: this.note(txn)
    }));

    const periodLabel = this.period() === 'daily' ? 'Daily' : 'Weekly';
    const fileName = `${this.paybill.paybillNo}-statement-${this.period()}`;

    this.exportService.exportToPdf(
      rows,
      ['time', 'amount', 'by', 'note'],
      fileName,
      `${this.paybill.paybillNo} Withdrawal Statement (${periodLabel})`
    );
  }

  loadTransactions(): void {
    this.loading.set(true);
    this.error.set(null);

    this.walletService.getTransactions(this.paybill.paybillNo).subscribe({
      next: transactions => {
        this.withdrawals.set(transactions.filter(txn => txn.type === 'DEBIT'));
        this.loading.set(false);
        this.changeDetectorRef.markForCheck();
      },
      error: error => {
        console.error('Failed to load paybill statement', error);
        this.error.set('Could not load the withdrawal statement.');
        this.loading.set(false);
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  /** Who withdrew — the acting staff member is embedded in the description as "Withdrawn by <name>", since the wallet ledger itself has no actor field. */
  withdrawnBy(transaction: WalletTransaction): string {
    const match = transaction.description?.match(/^Withdrawn by ([^—]+?)(?:\s—|$)/);
    return match ? match[1].trim() : '—';
  }

  note(transaction: WalletTransaction): string {
    const match = transaction.description?.match(/—\s(.*)$/);
    if (match) return match[1].trim();
    if (transaction.description && !transaction.description.startsWith('Withdrawn by')) {
      return transaction.description;
    }
    return transaction.reference ?? '—';
  }

  private windowStart(period: StatementPeriod): Date {
    const now = new Date();
    if (period === 'daily') {
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }
    // Weekly window resets every Monday.
    const day = now.getDay();
    const daysSinceMonday = (day + 6) % 7;
    const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysSinceMonday);
    return monday;
  }
}
