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
import { AgentService } from '../../../core/services/agent-service';
import { Agents } from '../../../core/models/agents';
import { Form } from '../form/form';
import { Update } from '../update/update';


@Component({
  selector: 'app-business-products',
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
    MatTableModule],
  templateUrl: './list.html',
  styleUrl: './list.scss'
})
export class List implements OnInit {
  private readonly agentService = inject(AgentService);
  private readonly dialog = inject(MatDialog);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  agents: Agents[] = [];
  searchTerm = '';
  pageIndex = 0;
  pageSize = 5;
  readonly pageSizeOptions = [5, 10, 25];
  readonly displayedColumns = ['index', 'name', 'agentId', 'nationalId', 'station', 'phone', 'status', 'actions'];
  get filteredAgents(): Agents[] {
    const term = this.searchTerm.trim().toLowerCase();
    return !term ? this.agents : this.agents.filter(agent => [agent.name, agent.agentId, agent.nationalId, agent.phone, agent.status].some(value => value.toLowerCase().includes(term)));
  }
  get pagedAgents(): Agents[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredAgents.slice(start, start + this.pageSize);
  }
  ngOnInit(): void {
    this.loadAgents();
  }
  loadAgents(): void {
    this.agentService.loadAgents().subscribe({
      next: agents => {
        this.agents = agents;
        this.changeDetectorRef.markForCheck();
      },
      error: error => console.error('Failed to load agents', error)
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
        if (created) this.loadAgents();
      });
  }
  openUpdateDialog(agent: Agents): void {
    this.dialog.open(Update, { width: '420px', maxWidth: 'calc(100vw - 32px)', data: agent })
      .afterClosed()
      .subscribe(updated => {
        if (updated) this.loadAgents();
      });
  }
}



