import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs/operators';

import { Members } from '../../../core/models/members';
import { MemberService } from '../../../core/services/member-service';

@Component({
  selector: 'app-member-view',

  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],

  templateUrl: './view.html',

  styleUrl: './view.scss'
})
export class View implements OnInit {

  private memberService = inject(MemberService);

  private dialogRef = inject(MatDialogRef<View>);

  readonly memberNo: string = inject(MAT_DIALOG_DATA);

  readonly loading = signal(true);

  readonly member = signal<Members | null>(null);

  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.memberService
      .getMemberByNumber(this.memberNo)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (member) => this.member.set(member),
        error: (error) => {
          console.error('Failed to load member', error);
          this.error.set('Could not load this member\'s details.');
        }
      });
  }

  close(): void {
    this.dialogRef.close();
  }
}
