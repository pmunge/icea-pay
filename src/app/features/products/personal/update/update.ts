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
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import { BUSINESS_LINE_IDS, businessLineName, Product } from '../../../../core/models/product';
import { ProductService } from '../../../../core/services/product';
import { ConfirmationService } from '../../../../core/services/confirmation';
import { BusinessUnit } from '../../../../core/models/analytics';

@Component({
  selector: 'app-product-update',

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
export class Update {

  private fb = inject(FormBuilder);

  private productService = inject(ProductService);

  private confirmationService = inject(ConfirmationService);

  private dialogRef = inject(MatDialogRef<Update>);

  product: Product = inject(MAT_DIALOG_DATA);

  saving = false;

  categories: BusinessUnit[] = [
    'Life',
    'Investment',
    'General',
    'Medical'
  ];

  updateForm = this.fb.nonNullable.group({
    name: [
      this.product.name,
      Validators.required
    ],
    businessUnit: [
      businessLineName(this.product.businessLineId) ?? ('' as BusinessUnit | ''),
      Validators.required
    ],
    status: [
      (this.product.active ? 'Active' : 'Inactive') as 'Active' | 'Inactive',
      Validators.required
    ]
  });

  async save(): Promise<void> {
    if (this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();
      return;
    }

    const confirmed = await this.confirmationService.confirmUpdate(this.product.name);
    if (!confirmed) return;

    const { businessUnit, status, ...rest } = this.updateForm.getRawValue();
    const product: Product = {
      ...this.product,
      ...rest,
      businessLineId: BUSINESS_LINE_IDS[businessUnit as BusinessUnit],
      active: status === 'Active'
    };
    this.saving = true;

    this.productService
      .updateProduct(this.product.id!, product)
      .subscribe({
        next: (updatedProduct) => {
          this.saving = false;
          this.dialogRef.close(updatedProduct);
        },
        error: (error) => {
          this.saving = false;
          console.error(
            'Failed to update product',
            error
          );
        }
      });
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
