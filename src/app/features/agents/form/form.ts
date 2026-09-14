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

import { AgentService } from '../../../core/services/agent-service';
import { Agents } from '../../../core/models/agents';


@Component({
  selector: 'app-paybill-form',

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

  styleUrl: './form.scss'
})
export class Form {

  private fb = inject(FormBuilder);

  private agentService = inject(AgentService);

  private dialogRef =
    inject(MatDialogRef<Form>);

  saving = false;

  agentsForm = this.fb.nonNullable.group({
    name: [
      '',
      Validators.required
    ],
    agentId: [
      '',
      Validators.required
    ],
    nationalId: [
      '',
      Validators.required
    ],
    phone: [
      '',
      Validators.required
    ],
    station: [
      '',
      Validators.required
    ],
    status: [
      'Active' as 'Active' | 'Inactive',
      Validators.required
    ]
  });

  save(): void {
    if (this.agentsForm.invalid) {
      this.agentsForm.markAllAsTouched();
      return;
    }

    const { name, agentId, nationalId, phone, station, status } = this.agentsForm.getRawValue();
    this.saving = true;

    const payload: Agents = { name, agentId, nationalId, phone, station, status };

    this.agentService
      .createAgent(payload)
      .subscribe({
        next: (createdAgent) => {
          this.saving = false;
          this.dialogRef.close(createdAgent);
        },
        error: (error) => {
          this.saving = false;
          console.error(
            'Failed to create agent',
            error
          );
        }
      });
  }
  cancel(): void {
    this.dialogRef.close();
  }

}
