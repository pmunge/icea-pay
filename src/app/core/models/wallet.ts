/** A paybill's wallet, as returned by GET /wallets/{paybillNo}. */
export interface Wallet {
  id: number;
  paybillNo: string;
  balance: number;
  currency: string;
}

/** A paybill's current balance, as returned by GET /wallets/balances. */
export interface WalletBalance {
  paybillNo: string;
  provider: string;
  balance: number;
}

/** Payload sent to POST /wallets/{paybillNo}/withdraw. */
export interface WalletWithdrawalRequest {
  amount: number;
  description?: string;
}

/** A ledger entry on a wallet, as returned by the withdraw and transactions endpoints. */
export interface WalletTransaction {
  id: number;
  walletId: number;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  balanceAfter: number;
  paymentTransactionId?: number;
  reference?: string;
  description?: string;
  createdAt: string;
}
