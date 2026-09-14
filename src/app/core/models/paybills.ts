export interface paybillsRequest {
    MoMo: string;
    paybill: string;
    amount: number;
    status: 'Active' | 'Inactive';
}

export interface paybillsResponse extends paybillsRequest {
    id: string;
}
