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

import { BusinessLine } from '../../../core/models/business-line';
import { PAYBILL_PROVIDERS } from '../../../core/models/paybills';
import { BusinessLineService } from '../../../core/services/business-line-service';
import { FinanceService } from '../../../core/services/finance-service';


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
export class Form implements OnInit {

  private fb = inject(FormBuilder);

  private financeService = inject(FinanceService);

  private businessLineService = inject(BusinessLineService);

  private dialogRef =
    inject(MatDialogRef<Form>);

  readonly businessLines = signal<BusinessLine[]>([]);

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
    businessLineId: [
      null as number | null,
      Validators.required
    ]
  });

  ngOnInit(): void {
    this.businessLineService.getBusinessLines().subscribe({
      next: (businessLines) => this.businessLines.set(businessLines),
      error: (error) => console.error('Failed to load business lines', error)
    });
  }

  save(): void {
    if (this.paybillsForm.invalid) {
      this.paybillsForm.markAllAsTouched();
      return;
    }

    const { paybillNumber, provider, businessLineId } = this.paybillsForm.getRawValue();
    this.saving = true;

    this.financeService
      .createPaybill({ paybillNumber, provider, businessLineId: businessLineId! })
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
