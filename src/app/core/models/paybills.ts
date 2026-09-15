/** Mobile money providers a paybill can be registered under. */
export const PAYBILL_PROVIDERS = ['M-Pesa', 'Airtel Money', 'T-Kash'] as const;

export type PaybillProvider = typeof PAYBILL_PROVIDERS[number];

export interface PaybillRequest {
    paybillNumber: string;
    provider: string;
    businessLineId: number;
}

export interface Paybill extends PaybillRequest {
    id?: number;
    /** Defaults to 0 on creation; can be set on update. */
    amount?: number;
    createdAt?: string;
    updatedAt?: string;
}
