/** Mobile money providers a paybill can be registered under. */
export const PAYBILL_PROVIDERS = ['M-Pesa', 'Airtel Money', 'T-Kash'] as const;

export type PaybillProvider = typeof PAYBILL_PROVIDERS[number];

export interface PaybillRequest {
    paybillNumber: string;
    provider: string;
}

export interface Paybill extends PaybillRequest {
    id?: number;
    /** Set once the paybill has been allocated to a business line and product. */
    businessLineId?: number;
    product?: string;
    /** Current balance held on the paybill. Defaults to 0 on creation. */
    amount?: number;
    createdAt?: string;
    updatedAt?: string;
}

/** Payload sent to POST /paybills/{id}/allocate to assign a business line and product to a paybill. */
export interface PaybillAllocate {
    paybillNumber: string;
    provider: string;
    businessLineId: number;
    product: string;
}

export interface withdrawPaybill {
    paybillNumber: string;
    provider: string;
    currentAmount: string;
    adjustAmount: string;
}
