/** A supported country, as returned by GET /countries. */
export interface Country {
  id: number;
  code: string;
  name: string;
  currencyCode: string;
  callingCode: string;
  active: boolean;
}
