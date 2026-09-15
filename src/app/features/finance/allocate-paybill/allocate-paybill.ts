import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
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
import { Product } from '../../../core/models/product';
import { BusinessLineService } from '../../../core/services/business-line-service';
import { FinanceService } from '../../../core/services/finance-service';
import { ProductService } from '../../../core/services/product';

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

  templateUrl: './allocate-paybill.html',

  styleUrl: './allocate-paybill.scss'
})
export class AllocatePaybills implements OnInit {

  private fb = inject(FormBuilder);

  private financeService = inject(FinanceService);

  private businessLineService = inject(BusinessLineService);

  private productService = inject(ProductService);

  private dialogRef =
    inject(MatDialogRef<AllocatePaybills>);

  readonly businessLines = signal<BusinessLine[]>([]);

  readonly products = signal<Product[]>([]);

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
    ],
    //products (from dropdown depending on selected businessline)
    product: [
      '',
      Validators.required
    ]
  });

  /** Products belonging to the currently selected business line, active only. */
  readonly availableProducts = computed(() => {
    const businessLineId = this.selectedBusinessLineId();
    if (businessLineId == null) return [];
    return this.products().filter(
      (product) => product.businessLineId === businessLineId && product.active
    );
  });

  private readonly selectedBusinessLineId = signal<number | null>(null);

  ngOnInit(): void {
    this.businessLineService.getBusinessLines().subscribe({
      next: (businessLines) => this.businessLines.set(businessLines),
      error: (error) => console.error('Failed to load business lines', error)
    });

    this.productService.getProducts().subscribe({
      next: (products) => this.products.set(products),
      error: (error) => console.error('Failed to load products', error)
    });

    this.paybillsForm.controls.businessLineId.valueChanges.subscribe((businessLineId) => {
      this.selectedBusinessLineId.set(businessLineId);
      // Selected product no longer belongs to the newly chosen business line.
      this.paybillsForm.controls.product.setValue('');
    });
  }

  businessLineName(businessLineId: number | null): string {
    if (businessLineId == null) return '—';
    return this.businessLines().find((line) => line.id === businessLineId)?.name ?? '—';
  }

  save(): void {
    if (this.paybillsForm.invalid) {
      this.paybillsForm.markAllAsTouched();
      return;
    }

    const { paybillNumber, provider, businessLineId, product } = this.paybillsForm.getRawValue();
    this.saving = true;

    this.financeService
      .allocatePaybill({ paybillNumber, provider, businessLineId: businessLineId!, product })
      .pipe(finalize(() => this.saving = false))
      .subscribe({
        next: (allocatedPaybill) => {
          this.dialogRef.close(allocatedPaybill);
        },
        error: (error) => {
          console.error('Failed to allocate paybill', error);
        }
      });
  }
  cancel(): void {
    this.dialogRef.close();
  }

}
