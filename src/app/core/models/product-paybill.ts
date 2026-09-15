/** Payload sent to PUT /products/{productId}/paybills/countries/{countryId} to route a paybill to a product. */
export interface ProductPaybillRequest {
  countryId: number;
  paybillId: number;
  active?: boolean;
}

/** A product-paybill routing, as returned by the create/update/list routing endpoints. */
export interface ProductPaybillResponse {
  id: number;
  productId: number;
  countryId: number;
  paybillNo: string;
  provider: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
