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
import { Subject, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { MemberService } from '../../../core/services/member-service';
import { AuthService } from '../../../core/services/auth';
import { Members } from '../../../core/models/members';
import { View } from '../view/view';

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
  private readonly memberService = inject(MemberService);
  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly search$ = new Subject<string>();

  /** HQ sees every member; every other role only sees members of their own branch. */
  readonly isHQ = this.authService.getRole() === 'HQ';
  private myBranchId: number | null = null;

  members: Members[] = [];
  searchTerm = '';
  pageIndex = 0;
  pageSize = 5;
  readonly pageSizeOptions = [5, 10, 25];
  readonly displayedColumns = ['memberNo', 'name', 'nationalId', 'phone', 'role', 'status', 'actions'];

  get pagedMembers(): Members[] {
    const start = this.pageIndex * this.pageSize;
    return this.members.slice(start, start + this.pageSize);
  }

  ngOnInit(): void {
    this.search$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(term => {
          const query = term.trim();
          const results$ = query ? this.memberService.searchMembers(query) : this.memberService.getMembers();
          return results$.pipe(catchError(error => {
            console.error('Failed to search members', error);
            return of<Members[]>([]);
          }));
        })
      )
      .subscribe(members => {
        this.pageIndex = 0;
        this.members = this.scopeToBranch(members);
        this.changeDetectorRef.markForCheck();
      });

    if (this.isHQ) {
      this.loadMembers();
    } else {
      // Resolve the signed-in manager's own branch before loading so members
      // from other branches never briefly appear.
      this.authService.getMyBranchId().subscribe({
        next: branchId => {
          this.myBranchId = branchId;
          this.loadMembers();
        },
        error: error => {
          console.error('Failed to resolve signed-in staff member\'s branch', error);
          this.loadMembers();
        }
      });
    }
  }

  loadMembers(): void {
    this.memberService.getMembers().subscribe({
      next: members => {
        this.members = this.scopeToBranch(members);
        this.changeDetectorRef.markForCheck();
      },
      error: error => console.error('Failed to load members', error)
    });
  }

  private scopeToBranch(members: Members[]): Members[] {
    return this.isHQ ? members : members.filter(member => member.branchId === this.myBranchId);
  }

  applySearch(): void {
    this.search$.next(this.searchTerm);
  }

  changePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  openView(member: Members): void {
    this.dialog.open(View, {
      width: '480px',
      maxWidth: 'calc(100vw - 32px)',
      data: member.memberNo
    });
  }
}
