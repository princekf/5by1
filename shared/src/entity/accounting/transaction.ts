import { CostCentre } from './cost-centre';
import { Ledger } from './ledger';

export enum TransactionType {
    DEBIT = 'Debit',
    CREDIT = 'Credit',
}

export interface Transaction {
    id?: string;
    // The order of transaction in the voucher.
    order: number;
    ledger?: Ledger;
    ledgerId?: string;
    amount: number;
    type: TransactionType;
    details?: string;
    costCentre?: CostCentre;
    costCentreId?: string;
}
