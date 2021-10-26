import { CostCentre } from './cost-centre';
import { Ledger } from './ledger';

export interface Transaction {
    id?: string;
    ledger?: Ledger;
    ledgerid?: string;
    debit: number;
    credit: number;
    details?: string;
    costCentre?: CostCentre;
}
