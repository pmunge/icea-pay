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

import { BUSINESS_LINE_IDS, Product } from '../../../../core/models/product';
import { ProductService } from '../../../../core/services/product';
import { BusinessUnit } from '../../../../core/models/analytics';


@Component({
  selector: 'app-product-form',

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

  private productService = inject(ProductService);

  private dialogRef =
    inject(MatDialogRef<Form>);
  categories: BusinessUnit[] = [
    'Life',
    'Investment',
    'General',
    'Medical'
  ];
  productForm = this.fb.nonNullable.group({
    code: [
      '',
      Validators.required
    ],
    name: [
      '',
      Validators.required
    ],
    businessUnit: [
      '' as BusinessUnit | '',
      Validators.required
    ],
    paybill: [
      '',
      Validators.required
    ],
    accountNumber: [
      '',
      Validators.required
    ],
    description: [
      '',
      Validators.required
    ],
    displayOrder: [
      0,
      Validators.required
    ],
    status: [
      'Active' as 'Active' | 'Inactive',
      Validators.required
    ]
  });
  save(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    const { businessUnit, status, ...rest } = this.productForm.getRawValue();
    const product: Product = {
      ...rest,
      businessLineId: BUSINESS_LINE_IDS[businessUnit as BusinessUnit],
      active: status === 'Active'
    };
    this.productService
      .createProduct(product)
      .subscribe({
        next: (createdProduct) => {
          console.log(
            'Product created:',
            createdProduct
          );

          this.dialogRef.close(
            createdProduct
          );
        },
        error: (error) => {
          console.error(
            'Failed to create product',
            error
          );
        }
      });
  }
  cancel(): void {
    this.dialogRef.close();
  }

}
