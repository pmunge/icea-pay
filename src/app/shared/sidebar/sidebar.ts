import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../core/services/auth';
import { ROLE_BUSINESS_UNIT } from '../../core/models/users';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private readonly auth = inject(AuthService);

  /** HQ sees every section; a business-unit role only sees its own dashboard. */
  readonly isHQ = computed(() => this.auth.currentUser()?.role === 'HQ');

  readonly unitHomeRoute = computed(() => this.auth.homeRoute());

  readonly unitLabel = computed(() => {
    const role = this.auth.currentUser()?.role;
    return role && role !== 'HQ' ? ROLE_BUSINESS_UNIT[role] : '';
  });

  dashboardOpen = false;
  productPerformanceOpen = false;
  productOpen = false;
  transactionsOpen = false;
  channelsOpen = false;
  branchOpen = false;
  usersOpen= false;
  financeOpen = false;
  agentsOpen = false;
  membersOpen = false;

  toggleDashboard(): void {
    this.dashboardOpen = !this.dashboardOpen;
  }
  toggleProduct(): void {
    this.productOpen = !this.productOpen;
  }

  toggleProductPerformance(): void {
    this.productPerformanceOpen = !this.productPerformanceOpen;
  }

  toggleTransactions(): void {
    this.transactionsOpen = !this.transactionsOpen;
  }
  toggleChannels(): void {
    this.channelsOpen = !this.channelsOpen;
  }
  toggleBranch(): void {
    this.branchOpen = !this.branchOpen;
  }
  toggleUsers(): void {
    this.usersOpen = !this.usersOpen;
  }
  toggleFinance(): void {
    this.financeOpen = !this.financeOpen;
  }
  toggleAgents(): void {
    this.agentsOpen = !this.agentsOpen;
  }
  toggleMembers(): void {
    this.membersOpen = !this.membersOpen;
  }
}
