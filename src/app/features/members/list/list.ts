import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MemberService } from '../../../core/services/member-service'
import { Members } from '../../../core/models/members';

@Component({
  selector: 'app-business-products',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule],
  templateUrl: './list.html',
  styleUrl: './list.scss'
})
export class List implements OnInit {
  private readonly memberService = inject(MemberService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  members: Members[] = [];
  searchTerm = '';
  pageIndex = 0;
  pageSize = 5;
  readonly pageSizeOptions = [5, 10, 25];
  readonly displayedColumns = ['name', 'nationalId', 'phone', 'status'];
  get filteredMembers(): Members[] {
    const term = this.searchTerm.trim().toLowerCase();
    return !term ? this.members : this.members.filter(member => [member.name, member.nationalId, member.phone, member.status].some(value => value.toLowerCase().includes(term)));
  }
  get pagedMembers(): Members[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredMembers.slice(start, start + this.pageSize);
  }
  ngOnInit(): void {
    this.loadMembers();
  }
  loadMembers(): void {
    this.memberService.loadMembers().subscribe({
      next: members => {
        this.members = members;
        this.changeDetectorRef.markForCheck();
      },
      error: error => console.error('Failed to load members', error)
    });
  }
  applySearch(): void {
    this.pageIndex = 0;
  }
  changePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }
  
}
