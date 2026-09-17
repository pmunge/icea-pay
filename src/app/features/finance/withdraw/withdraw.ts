import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { WalletService } from '../../../core/services/wallet-service';
import { WalletBalance } from '../../../core/models/wallet';
import { Update } from '../update/update';
import { Statement } from '../statement/statement';

@Component({
  selector: 'app-withdraw',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule
  ],
  templateUrl: './withdraw.html',
  styleUrl: './withdraw.scss',
})
export class Withdraw implements OnInit {
  private readonly walletService = inject(WalletService);
  private readonly dialog = inject(MatDialog);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  paybills: WalletBalance[] = [];
  searchTerm = '';
  pageIndex = 0;
  pageSize = 5;
  readonly pageSizeOptions = [5, 10, 25];  
  readonly displayedColumns = ['index', 'paybillNo', 'provider', 'balance', 'actions'];

  get filteredPaybills(): WalletBalance[] {
    const term = this.searchTerm.trim().toLowerCase();
    return !term
      ? this.paybills
      : this.paybills.filter(paybill =>
        [paybill.paybillNo, paybill.provider, paybill.balance].some(value =>
          String(value ?? '').toLowerCase().includes(term)
        )
      );
  }

  get pagedPaybills(): WalletBalance[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredPaybills.slice(start, start + this.pageSize);
  }

  ngOnInit(): void {
    this.loadPaybills();
  }

  loadPaybills(): void {
    this.walletService.getBalances().subscribe({
      next: paybills => {
        this.paybills = paybills;
        this.changeDetectorRef.markForCheck();
      },
      error: error => console.error('Failed to load paybill balances', error)
    });
  }

  applySearch(): void {
    this.pageIndex = 0;
  }

  changePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  openWithdrawDialog(paybill: WalletBalance): void {
    this.dialog.open(Update, { width: '420px', maxWidth: 'calc(100vw - 32px)', data: paybill })
      .afterClosed()
      .subscribe(updated => {
        if (updated) this.loadPaybills();
      });
  }

  openStatementDialog(paybill: WalletBalance): void {
    this.dialog.open(Statement, { width: '640px', maxWidth: 'calc(100vw - 32px)', data: paybill });
  }

}
