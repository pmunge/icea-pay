import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

import { BUSINESS_LINE_IDS, Product } from '../../core/models/product';
import { ProductService } from '../../core/services/product';
import { AuthService } from '../../core/services/auth';
import { ROLE_BUSINESS_UNIT } from '../../core/models/users';

/**
 * Products page for a business-unit dashboard — shows only the products
 * that belong to the signed-in user's own unit (derived from their role).
 */
@Component({
  selector: 'app-unit-products',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule
  ],
  templateUrl: './unit-products.html',
  styleUrl: './unit-products.scss'
})
export class UnitProducts implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly auth = inject(AuthService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  readonly businessUnit = computed(() => {
    const role = this.auth.currentUser()?.role;
    return role && role !== 'HQ' ? ROLE_BUSINESS_UNIT[role] : '';
  });

  products: Product[] = [];
  searchTerm = '';
  pageIndex = 0;
  pageSize = 5;
  readonly pageSizeOptions = [5, 10, 25];
  readonly displayedColumns = ['index', 'name', 'paybill', 'description', 'status'];

  statusOf(product: Product): 'Active' | 'Inactive' {
    return product.active ? 'Active' : 'Inactive';
  }

  get filteredProducts(): Product[] {
    const term = this.searchTerm.trim().toLowerCase();
    return !term
      ? this.products
      : this.products.filter(product =>
        [product.name, this.statusOf(product)]
          .some(value => value.toLowerCase().includes(term)));
  }

  get pagedProducts(): Product[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    const unit = this.businessUnit();
    const businessLineId = unit ? BUSINESS_LINE_IDS[unit] : undefined;
    this.productService.getProducts().subscribe({
      next: products => {
        this.products = products.filter(product => product.businessLineId === businessLineId);
        this.changeDetectorRef.markForCheck();
      },
      error: error => console.error('Failed to load products', error)
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
