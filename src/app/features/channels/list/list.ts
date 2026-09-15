import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
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
import { Channels } from '../../../core/models/channels';
import { ChannelsService } from '../../../core/services/channels-service';
import { Form } from '../form/form';

@Component({
  selector: 'app-list',
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
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class List {
  private readonly channelsService = inject(ChannelsService);
  private readonly dialog = inject(MatDialog);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  channels: Channels[] = [];
  searchTerm = '';
  pageIndex = 0;
  pageSize = 5;
  readonly pageSizeOptions = [5, 10, 25];
  readonly displayedColumns = ['index', 'name', 'category', 'description', 'status'];

  get filteredChannels(): Channels[] {
    const term = this.searchTerm.trim().toLowerCase();
    return !term ? this.channels : this.channels.filter(channel =>
      [channel.name, channel.category, channel.description, channel.status]
        .some(value => value.toLowerCase().includes(term))
    );
  }

  get pagedChannels(): Channels[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredChannels.slice(start, start + this.pageSize);
  }

  ngOnInit(): void {
    this.loadChannels();
  }

  loadChannels(): void {
    this.channelsService.getChannels().subscribe({
      next: channels => {
        this.channels = channels;
        this.changeDetectorRef.markForCheck();
      },
      error: error => console.error('Failed to load channels', error)
    });
  }

  applySearch(): void {
    this.pageIndex = 0;
  }

  changePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  openCreateDialog(): void {
    this.dialog.open(Form, { width: '560px', maxWidth: 'calc(100vw - 32px)' })
      .afterClosed()
      .subscribe(created => {
        if (created) this.loadChannels();
      });
  }
}
