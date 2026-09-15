/** Mobile money providers a paybill can be registered under. */
export const PAYBILL_PROVIDERS = ['M-Pesa', 'Airtel Money', 'T-Kash'] as const;

export type PaybillProvider = typeof PAYBILL_PROVIDERS[number];

export interface PaybillRequest {
    paybillNumber: string;
    provider: string;
    /** Country code, e.g. "KE". */
    countryCode: string;
}

export interface Paybill extends PaybillRequest {
    id?: number;
    createdAt?: string;
    updatedAt?: string;
}
