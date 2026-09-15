/** A payment record, as returned by GET /payments. */
export interface Transaction {
  id: number;
  reference: string;
  payerMemberId: number;
  policyNumber: string;
  policyId: number;
  productId: number;
  businessLineId?: number;
  paidFor: string;
  beneficiaryName: string;
  beneficiaryMemberId?: number;
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
  productName?: string;
  branchName?: string;
  memberName?: string;
  agentName?: string;
}

/**
 * The member this transaction should be attributed to: the beneficiary when
 * the payer made the payment on someone else's behalf, otherwise the payer
 * (member) themselves.
 */
export function transactionMemberName(transaction: Transaction): string {
  const beneficiary = transaction.beneficiaryName?.trim();
  const member = transaction.memberName?.trim();
  return beneficiary || member || '—';
}

/** Transactions attributed to a specific branch, matched by branch name. */
export function transactionsInBranch(transactions: Transaction[], branchName: string): Transaction[] {
  const target = branchName.trim().toLowerCase();
  return transactions.filter((t) => t.branchName?.trim().toLowerCase() === target);
}
