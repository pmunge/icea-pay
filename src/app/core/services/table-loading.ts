import { Injectable, computed, signal } from '@angular/core';

/** Tracks outstanding API reads that populate table views. */
@Injectable({ providedIn: 'root' })
export class TableLoadingService {
  private readonly pendingRequests = signal(0);

  readonly isLoading = computed(() => this.pendingRequests() > 0);

  begin(): void {
    this.pendingRequests.update((count) => count + 1);
  }

  end(): void {
    this.pendingRequests.update((count) => Math.max(0, count - 1));
  }
}
