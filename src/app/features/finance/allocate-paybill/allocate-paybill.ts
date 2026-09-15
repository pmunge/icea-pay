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
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';

import { BusinessLine } from '../../../core/models/business-line';
import { Paybill } from '../../../core/models/paybills';
import { Product } from '../../../core/models/product';
import { Country } from '../../../core/models/country';
import { BusinessLineService } from '../../../core/services/business-line-service';
import { ProductService } from '../../../core/services/product';
import { CountryService } from '../../../core/services/country-service';

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

  private productService = inject(ProductService);

  private businessLineService = inject(BusinessLineService);

  private countryService = inject(CountryService);

  private dialogRef =
    inject(MatDialogRef<AllocatePaybills>);

  /** The paybill being routed to a product — already exists, so its own details are read-only here. */
  readonly paybill: Paybill = inject(MAT_DIALOG_DATA);

  readonly businessLines = signal<BusinessLine[]>([]);

  readonly products = signal<Product[]>([]);

  readonly countries = signal<Country[]>([]);

  /** The paybill's own country, resolved to its numeric id once the countries list has loaded. */
  readonly countryId = computed(() => {
    const code = this.paybill.countryCode?.trim().toLowerCase();
    return this.countries().find((country) => country.code.toLowerCase() === code)?.id ?? null;
  });

  saving = false;

  paybillsForm = this.fb.nonNullable.group({
    // Client-side filter only for the product dropdown below — never sent to the backend.
    businessLineId: [
      null as number | null,
      Validators.required
    ],
    productId: [
      null as number | null,
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

    this.countryService.getCountries().subscribe({
      next: (countries) => this.countries.set(countries),
      error: (error) => console.error('Failed to load countries', error)
    });

    this.paybillsForm.controls.businessLineId.valueChanges.subscribe((businessLineId) => {
      this.selectedBusinessLineId.set(businessLineId);
      // Selected product no longer belongs to the newly chosen business line.
      this.paybillsForm.controls.productId.setValue(null);
    });
  }

  save(): void {
    if (this.paybillsForm.invalid) {
      this.paybillsForm.markAllAsTouched();
      return;
    }

    const countryId = this.countryId();
    if (countryId == null) {
      console.error(`Could not resolve a country for code "${this.paybill.countryCode}"`);
      return;
    }

    const { productId } = this.paybillsForm.getRawValue();
    this.saving = true;

    this.productService
      .allocatePaybill(productId!, countryId, {
        countryId,
        paybillId: this.paybill.id!,
        active: true
      })
      .pipe(finalize(() => this.saving = false))
      .subscribe({
        next: (routing) => {
          this.dialogRef.close(routing);
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
