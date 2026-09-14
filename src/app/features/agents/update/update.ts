import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import { Agents } from '../../../core/models/agents';
import { AgentService } from '../../../core/services/agent-service';
import { ConfirmationService } from '../../../core/services/confirmation';

@Component({
  selector: 'app-agent-update',

  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule
  ],

  templateUrl: './update.html',

  styleUrl: './update.scss'
})
export class Update {

  private fb = inject(FormBuilder);

  private agentService = inject(AgentService);

  private confirmationService = inject(ConfirmationService);

  private dialogRef = inject(MatDialogRef<Update>);

  agent: Agents = inject(MAT_DIALOG_DATA);

  saving = false;

  updateForm = this.fb.nonNullable.group({
    status: [
      this.agent.status as 'Active' | 'Inactive',
      Validators.required
    ]
  });

  async save(): Promise<void> {
    if (this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();
      return;
    }

    const confirmed = await this.confirmationService.confirmUpdate(this.agent.name);
    if (!confirmed) return;

    const { status } = this.updateForm.getRawValue();
    this.saving = true;

    this.agentService
      .updateAgent(this.agent.id!, { status })
      .subscribe({
        next: (updatedAgent) => {
          this.saving = false;
          this.dialogRef.close(updatedAgent);
        },
        error: (error) => {
          this.saving = false;
          console.error(
            'Failed to update agent',
            error
          );
        }
      });
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
