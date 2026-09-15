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
import { MatSelectModule } from '@angular/material/select';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import { BusinessLine } from '../../../core/models/business-line';
import { PAYBILL_PROVIDERS, Paybill } from '../../../core/models/paybills';
import { BusinessLineService } from '../../../core/services/business-line-service';
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
    MatSelectModule,
    MatDialogModule
  ],

  templateUrl: './update.html',

  styleUrl: './update.scss'
})
export class Update implements OnInit {

  private fb = inject(FormBuilder);

  private financeService = inject(FinanceService);

  private businessLineService = inject(BusinessLineService);

  private confirmationService = inject(ConfirmationService);

  private dialogRef = inject(MatDialogRef<Update>);

  paybill: Paybill = inject(MAT_DIALOG_DATA);

  readonly businessLines = signal<BusinessLine[]>([]);

  readonly providers = PAYBILL_PROVIDERS;

  saving = false;

  updateForm = this.fb.nonNullable.group({
    paybillNumber: [
      this.paybill.paybillNumber,
      Validators.required
    ],
    provider: [
      this.paybill.provider,
      Validators.required
    ],
    amount: [
      this.paybill.amount,
      Validators.required
    ],
    businessLineId: [
      this.paybill.businessLineId,
      Validators.required
    ]
  });

  ngOnInit(): void {
    this.businessLineService.getBusinessLines().subscribe({
      next: (businessLines) => this.businessLines.set(businessLines),
      error: (error) => console.error('Failed to load business lines', error)
    });
  }

  async save(): Promise<void> {
    if (this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();
      return;
    }

    const confirmed = await this.confirmationService.confirmUpdate(this.paybill.paybillNumber);
    if (!confirmed) return;

    const payload = this.updateForm.getRawValue();
    this.saving = true;

    this.financeService
      .updatePaybill(this.paybill.id!, payload)
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
