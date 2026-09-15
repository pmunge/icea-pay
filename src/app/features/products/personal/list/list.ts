import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { businessLineName, Product } from '../../../../core/models/product';
import { ProductService } from '../../../../core/services/product';
import { ConfirmationService } from '../../../../core/services/confirmation';
import { BUSINESS_UNITS, BusinessUnit } from '../../../../core/models/analytics';
import { Form } from '../form/form';
import { Update } from '../update/update';

@Component({
  selector: 'app-business-products',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTableModule],
  templateUrl: './list.html',
  styleUrl: './list.scss'
})
export class List implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly dialog = inject(MatDialog);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  products: Product[] = [];
  searchTerm = '';
  businessLineFilter: BusinessUnit | 'All' = 'All';
  readonly businessLineOptions: (BusinessUnit | 'All')[] = ['All', ...BUSINESS_UNITS];
  pageIndex = 0;
  pageSize = 5;
  readonly pageSizeOptions = [5, 10, 25];
  readonly displayedColumns = ['index', 'name', 'code', 'businessUnit', 'status', 'description', 'actions'];

  unitOf(product: Product): string {
    return businessLineName(product.businessLineId) ?? 'Unknown';
  }

  statusOf(product: Product): 'Active' | 'Inactive' {
    return product.active ? 'Active' : 'Inactive';
  }

  get filteredProducts(): Product[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.products.filter(product => {
      if (this.businessLineFilter !== 'All' && this.unitOf(product) !== this.businessLineFilter) return false;
      if (!term) return true;
      return [product.name, this.unitOf(product), this.statusOf(product)]
        .some(value => value.toLowerCase().includes(term));
    });
  }
  get pagedProducts(): Product[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
  }
  ngOnInit(): void {
    this.loadProducts();
  }
  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: products => {
        this.products = products;
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
  openCreateDialog(): void {
    this.dialog.open(Form, { width: '560px', maxWidth: 'calc(100vw - 32px)' })
      .afterClosed()
      .subscribe(created => {
        if (created) this.loadProducts();
      });
  }
  openUpdateDialog(product: Product): void {
    this.dialog.open(Update, { width: '420px', maxWidth: 'calc(100vw-32px)', data: product })
      .afterClosed()
      .subscribe(updated => {
        if (updated) this.loadProducts();
      })
  }
  async deleteProduct(product: Product): Promise<void> {
    const confirmed = await this.confirmationService.confirmDelete(product.name);
    if (!confirmed) return;
    this.productService.deleteProduct(product.id!).subscribe({
      next: () => this.loadProducts(),
      error: error => console.error('Failed to delete product', error)
    });
  }
}
