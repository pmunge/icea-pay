import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { forkJoin } from 'rxjs';

import { Branches, slugify } from '../../core/models/branch';
import { Members, membersInBranch } from '../../core/models/members';
import { Transaction, transactionsInBranch } from '../../core/models/transactions';
import { Branch } from '../../core/services/branch';
import { MemberService } from '../../core/services/member-service';
import { TransactionsService } from '../../core/services/transactions';
import { AnalyticsService } from '../../core/services/analytics';
import { DashboardView } from '../../shared/dashboard-view/dashboard-view';

/**
 * Dashboard for a single physical branch — reused for every branch, keyed
 * dynamically off the route slug. Charts/cards run on the shared synthetic
 * analytics feed (scoped by branch name); the members and transactions
 * tables show real backend data filtered to this branch.
 */
@Component({
  selector: 'app-branch-dashboard',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTableModule,
    DashboardView
  ],
  templateUrl: './branch-dashboard.html',
  styleUrl: './branch-dashboard.scss'
})
export class BranchDashboard implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly branchService = inject(Branch);
  private readonly memberService = inject(MemberService);
  private readonly transactionsService = inject(TransactionsService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  /** Synthetic feed that powers the charts/cards — same dataset every dashboard reads. */
  protected readonly analyticsTxns = inject(AnalyticsService).getTransactions();

  readonly loading = signal(true);
  readonly notFound = signal(false);
  readonly branch = signal<Branches | null>(null);
  readonly members = signal<Members[]>([]);
  readonly transactions = signal<Transaction[]>([]);

  pageIndex = 0;
  pageSize = 5;
  readonly pageSizeOptions = [5, 10, 25];
  readonly displayedColumns = ['memberNo', 'name', 'phone', 'status'];

  get pagedMembers(): Members[] {
    const start = this.pageIndex * this.pageSize;
    return this.members().slice(start, start + this.pageSize);
  }

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.branchService.getBranches(false).subscribe({
      next: (branches) => {
        const match = branches.find((b) => slugify(b.name) === slug) ?? null;
        this.onBranchResolved(match);
      },
      error: (error) => {
        console.error('Failed to load branches', error);
        this.onBranchResolved(null);
      }
    });
  }

  private onBranchResolved(branch: Branches | null): void {
    if (!branch) {
      this.notFound.set(true);
      this.loading.set(false);
      this.changeDetectorRef.markForCheck();
      return;
    }

    this.branch.set(branch);

    forkJoin({
      members: this.memberService.getMembers(),
      transactions: this.transactionsService.getTransactions()
    }).subscribe({
      next: ({ members, transactions }) => {
        this.members.set(membersInBranch(members, branch.id ?? null));
        this.transactions.set(transactionsInBranch(transactions, branch.name));
        this.loading.set(false);
        this.changeDetectorRef.markForCheck();
      },
      error: (error) => {
        console.error('Failed to load branch data', error);
        this.loading.set(false);
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  changePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }
}
