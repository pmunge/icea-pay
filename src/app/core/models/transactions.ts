/** A payment record, as returned by GET /payments. */
export interface Transaction {
  id: number;
  reference: string;
  payerMemberId: number;
  policyNumber: string;
  policyId: number;
  productId: number;
  paidFor: string;
  beneficiaryName: string;
  initiatedByType: string;
  initiatedByRef: string;
  originChannel: string;
  paymentOption: string;
  amount: number;
  currency: string;
  rail: string;
  provider: string;
  payerPhone: string;
  cardId: number | null;
  status: string;
  externalReference: string | null;
  failureReason: string | null;
  dueDate: string | null;
  initiatedAt: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
