import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
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

import { Paybill } from '../../../core/models/paybills';
import { FinanceService } from '../../../core/services/finance-service';
import { ConfirmationService } from '../../../core/services/confirmation';

@Component({
  selector: 'app-paybill-withdraw',

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

  paybill: Paybill = inject(MAT_DIALOG_DATA);

  readonly currentAmount = this.paybill.amount ?? 0;

  saving = false;

  withdrawForm = this.fb.nonNullable.group({
    adjustAmount: [
      null as number | null,
      [Validators.required, Validators.min(0.01), this.maxWithdrawal(this.currentAmount)]
    ]
  });

  private maxWithdrawal(max: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = Number(control.value);
      return control.value != null && value > max ? { exceedsBalance: true } : null;
    };
  }

  async save(): Promise<void> {
    if (this.withdrawForm.invalid) {
      this.withdrawForm.markAllAsTouched();
      return;
    }

    const { adjustAmount } = this.withdrawForm.getRawValue();

    const confirmed = await this.confirmationService.confirmWithdraw(
      this.paybill.paybillNumber,
      String(adjustAmount)
    );
    if (!confirmed) return;

    this.saving = true;

    this.financeService
      .withdraw(this.paybill.id!, {
        paybillNumber: this.paybill.paybillNumber,
        provider: this.paybill.provider,
        currentAmount: String(this.currentAmount),
        adjustAmount: String(adjustAmount)
      })
      .subscribe({
        next: (updatedPaybill) => {
          this.saving = false;
          this.dialogRef.close(updatedPaybill);
        },
        error: (error) => {
          this.saving = false;
          console.error('Failed to withdraw from paybill', error);
        }
      });
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
