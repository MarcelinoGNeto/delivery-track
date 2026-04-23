export interface Customer {
  _id: string;
  name: string;
  phone: string;
  balance: number;
}

export interface TransactionResult {
  transaction: {
    amount: number;
    cashbackGenerated: number;
    cashbackUsed: number;
  };
  customerBalance: number;
}
