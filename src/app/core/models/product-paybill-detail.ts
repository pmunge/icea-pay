/** A product-paybill routing row, as returned by GET /products/paybills/details. */
export interface ProductPaybillDetail {
  id: number;
  businesslineName: string;
  productCode: string;
  productName: string;
  description: string;
  paybillNumber: string;
  provider: string;
  countryName: string;
}
