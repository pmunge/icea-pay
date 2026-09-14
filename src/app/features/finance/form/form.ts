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

import { paybillsRequest } from '../../../core/models/paybills';
import { FinanceService } from '../../../core/services/finance-service';
import { TransactionsService } from '../../../core/services/transactions';


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

  private financeService = inject(FinanceService);

  private transactionsService = inject(TransactionsService);

  private dialogRef =
    inject(MatDialogRef<Form>);

  saving = false;

  paybillsForm = this.fb.nonNullable.group({
    MoMo: [
      '',
      Validators.required
    ],
    paybill: [
      '',
      Validators.required
    ],
    status: [
      'Active' as 'Active' | 'Inactive',
      Validators.required
    ]
  });

  save(): void {
    if (this.paybillsForm.invalid) {
      this.paybillsForm.markAllAsTouched();
      return;
    }

    const { MoMo, paybill, status } = this.paybillsForm.getRawValue();
    this.saving = true;

    this.transactionsService.getTransactions().subscribe({
      next: (transactions) => {
        const amount = transactions
          .filter((transaction) => transaction.paymentOption.trim().toLowerCase() === MoMo.trim().toLowerCase())
          .reduce((total, transaction) => total + transaction.amount, 0);

        const payload: paybillsRequest = { MoMo, paybill, status, amount };

        this.financeService
          .createPaybill(payload)
          .subscribe({
            next: (createdPaybill) => {
              this.saving = false;
              this.dialogRef.close(createdPaybill);
            },
            error: (error) => {
              this.saving = false;
              console.error(
                'Failed to create paybill',
                error
              );
            }
          });
      },
      error: (error) => {
        this.saving = false;
        console.error(
          'Failed to load transactions',
          error
        );
      }
    });
  }
  cancel(): void {
    this.dialogRef.close();
  }

}
