import { BusinessUnit } from './analytics';

/** A product record, as returned by GET/POST/PUT /products. */
export interface Product {
  id?: number;
  businessLineId: number;
  code: string;
  name: string;
  description: string;
  displayOrder: number;
  active: boolean;
  paybill: string;
  accountNumber: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Fixed backend id for each business line. */
export const BUSINESS_LINE_IDS: Record<BusinessUnit, number> = {
  Life: 1,
  General: 2,
  Medical: 3,
  Investment: 4,
};

const BUSINESS_LINE_NAMES: Record<number, BusinessUnit> = {
  1: 'Life',
  2: 'General',
  3: 'Medical',
  4: 'Investment',
};

/** Resolves a product's businessLineId back to its business unit name. */
export function businessLineName(businessLineId: number): BusinessUnit | undefined {
  return BUSINESS_LINE_NAMES[businessLineId];
}
