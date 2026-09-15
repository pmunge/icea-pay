import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

import { ProductPaybillDetail } from '../../../../core/models/product-paybill-detail';
import { ProductService } from '../../../../core/services/product';

/**
 * Read-only flattened view of every product-paybill routing — which
 * product, on which business line, is reachable through which paybill.
 */
@Component({
  selector: 'app-product-paybill-details',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule
  ],
  templateUrl: './list.html',
  styleUrl: './list.scss'
})
export class List implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  details: ProductPaybillDetail[] = [];
  searchTerm = '';
  pageIndex = 0;
  pageSize = 5;
  readonly pageSizeOptions = [5, 10, 25];
  readonly displayedColumns = [
    'index',
    'productCode',
    'productName',
    'businesslineName',
    'description',
    'paybillNumber',
    'provider',
    'countryName'
  ];

  get filteredDetails(): ProductPaybillDetail[] {
    const term = this.searchTerm.trim().toLowerCase();
    return !term
      ? this.details
      : this.details.filter(detail =>
        [
          detail.productCode,
          detail.productName,
          detail.businesslineName,
          detail.description,
          detail.paybillNumber,
          detail.provider,
          detail.countryName
        ].some(value => String(value ?? '').toLowerCase().includes(term))
      );
  }

  get pagedDetails(): ProductPaybillDetail[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredDetails.slice(start, start + this.pageSize);
  }

  ngOnInit(): void {
    this.loadDetails();
  }

  loadDetails(): void {
    this.productService.getPaybillDetails().subscribe({
      next: details => {
        this.details = details;
        this.changeDetectorRef.markForCheck();
      },
      error: error => console.error('Failed to load product paybill details', error)
    });
  }

  applySearch(): void {
    this.pageIndex = 0;
  }

  changePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }
}
