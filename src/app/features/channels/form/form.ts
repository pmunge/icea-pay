import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { Channels } from '../../../core/models/channels';
import { ChannelsService } from '../../../core/services/channels-service';

@Component({
  selector: 'app-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule
  ],
  templateUrl: './form.html',
  styleUrl: './form.scss',
})
export class Form {
  private fb = inject(FormBuilder);
  private channelsService = inject(ChannelsService);
  private dialogRef = inject(MatDialogRef<Form>);

  categories = [
    'Mobile Money Transfer',
    'Cards',
    'Banks',
    'Cash Deposit'
  ];
  channelForm = this.fb.nonNullable.group({
    name: [
      '',
      Validators.required
    ],
    category: [
      '',
      Validators.required
    ],
    description: [
      '',
      Validators.required
    ],
    status: [
      'Active' as 'Active' | 'Inactive',
      Validators.required
    ]
  });
  save(): void {
    if (this.channelForm.valid) {
      const channel: Channels = this.channelForm.value as Channels;
      this.channelsService.createChannel(channel).subscribe({
        next: () => this.dialogRef.close(true),
        error: error => console.error('Failed to create channel', error)
      });
    }
  }
  cancel(): void {
    this.dialogRef.close(false);
  }
}
