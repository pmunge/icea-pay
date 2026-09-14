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
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import { paybillsResponse } from '../../../core/models/paybills';
import { FinanceService } from '../../../core/services/finance-service';
import { ConfirmationService } from '../../../core/services/confirmation';

@Component({
  selector: 'app-paybill-update',

  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule
  ],

  templateUrl: './update.html',

  styleUrl: './update.scss'
})
export class Update {

  private fb = inject(FormBuilder);

  private financeService = inject(FinanceService);

  private confirmationService = inject(ConfirmationService);

  private dialogRef = inject(MatDialogRef<Update>);

  paybill: paybillsResponse = inject(MAT_DIALOG_DATA);

  saving = false;

  updateForm = this.fb.nonNullable.group({
    amount: [
      this.paybill.amount,
      [Validators.required, Validators.min(0)]
    ]
  });

  async save(): Promise<void> {
    if (this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();
      return;
    }

    const confirmed = await this.confirmationService.confirmUpdate(this.paybill.MoMo);
    if (!confirmed) return;

    const { amount } = this.updateForm.getRawValue();
    this.saving = true;

    this.financeService
      .updatePaybill(this.paybill.id, { amount })
      .subscribe({
        next: (updatedPaybill) => {
          this.saving = false;
          this.dialogRef.close(updatedPaybill);
        },
        error: (error) => {
          this.saving = false;
          console.error(
            'Failed to update paybill',
            error
          );
        }
      });
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
