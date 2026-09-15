import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/env';

import { Product } from '../models/product';
import { ProductPaybillRequest, ProductPaybillResponse } from '../models/product-paybill';
import { ProductPaybillDetail } from '../models/product-paybill-detail';

interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/products`;


  getProducts(): Observable<Product[]> {

    return this.http
      .get<ApiResponse<Product[]>>(this.apiUrl)
      .pipe(map((res) => res.data));

  }


  createProduct(product: Product): Observable<Product> {

    return this.http
      .post<ApiResponse<Product>>(this.apiUrl, product)
      .pipe(map((res) => res.data));

  }


  updateProduct(
    id: number,
    product: Product
  ): Observable<Product> {

    return this.http
      .put<ApiResponse<Product>>(`${this.apiUrl}/${id}`, product)
      .pipe(map((res) => res.data));

  }


  deleteProduct(id: number): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );

  }


  /** Flattened view of every product-paybill routing across all products. */
  getPaybillDetails(): Observable<ProductPaybillDetail[]> {

    return this.http
      .get<ApiResponse<ProductPaybillDetail[]>>(`${this.apiUrl}/paybills/details`)
      .pipe(map((res) => res.data));

  }


  /** Routes a paybill to a product for the given country, creating or updating the routing. */
  allocatePaybill(
    productId: number,
    countryId: number,
    request: ProductPaybillRequest
  ): Observable<ProductPaybillResponse> {

    return this.http
      .put<ApiResponse<ProductPaybillResponse>>(`${this.apiUrl}/${productId}/paybills/countries/${countryId}`, request)
      .pipe(map((res) => res.data));

  }

}
