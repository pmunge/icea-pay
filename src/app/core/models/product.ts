import { BusinessUnit } from './analytics';

/** A product record, as returned by GET/POST/PUT /products. */
export interface Product {
  id?: number;
  businessLineId: number;
  name: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
  /** Server-assigned ordering; never set or displayed on the client. */
  displayOrder?: number;
  description: string;
  code: string;
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
