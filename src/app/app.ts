import { Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TableLoadingService } from './core/services/table-loading';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('insurance');
  private readonly tableLoading = inject(TableLoadingService);

  constructor() {
    effect(() => {
      document.body.classList.toggle('is-table-loading', this.tableLoading.isLoading());
    });
  }
}
