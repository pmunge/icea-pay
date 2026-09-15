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

import { WalletBalance } from '../../../core/models/wallet';
import { WalletService } from '../../../core/services/wallet-service';
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

  private walletService = inject(WalletService);

  private confirmationService = inject(ConfirmationService);

  private dialogRef = inject(MatDialogRef<Update>);

  paybill: WalletBalance = inject(MAT_DIALOG_DATA);

  readonly currentAmount = this.paybill.balance ?? 0;

  saving = false;

  withdrawForm = this.fb.nonNullable.group({
    adjustAmount: [
      null as number | null,
      [Validators.required, Validators.min(0.01), this.maxWithdrawal(this.currentAmount)]
    ],
    description: ['']
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

    const { adjustAmount, description } = this.withdrawForm.getRawValue();

    const confirmed = await this.confirmationService.confirmWithdraw(
      this.paybill.paybillNo,
      String(adjustAmount)
    );
    if (!confirmed) return;

    this.saving = true;

    this.walletService
      .withdraw(this.paybill.paybillNo, {
        amount: adjustAmount!,
        ...(description ? { description } : {})
      })
      .subscribe({
        next: (transaction) => {
          this.saving = false;
          this.dialogRef.close(transaction);
        },
        error: (error: unknown) => {
          this.saving = false;
          console.error('Failed to withdraw from paybill', error);
        }
      });
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
