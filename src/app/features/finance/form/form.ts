import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';

import { PAYBILL_PROVIDERS } from '../../../core/models/paybills';
import { FinanceService } from '../../../core/services/finance-service';
//import products

@Component({
  selector: 'app-paybill-form',

  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatDialogModule
  ],

  templateUrl: './form.html',

  styleUrl: './form.scss'
})
export class Form {

  private fb = inject(FormBuilder);

  private financeService = inject(FinanceService);


  private dialogRef =
    inject(MatDialogRef<Form>);


  readonly providers = PAYBILL_PROVIDERS;

  saving = false;

  paybillsForm = this.fb.nonNullable.group({
    paybillNumber: [
      '',
      Validators.required
    ],
    provider: [
      '',
      Validators.required
    ],

  });


  save(): void {
    if (this.paybillsForm.invalid) {
      this.paybillsForm.markAllAsTouched();
      return;
    }

    const { paybillNumber, provider } = this.paybillsForm.getRawValue();
    this.saving = true;

    this.financeService
      .createPaybill({ paybillNumber, provider })
      .pipe(finalize(() => this.saving = false))
      .subscribe({
        next: (createdPaybill) => {
          this.dialogRef.close(createdPaybill);
        },
        error: (error) => {
          console.error('Failed to create paybill', error);
        }
      });
  }
  cancel(): void {
    this.dialogRef.close();
  }

}
