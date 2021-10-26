import { LedgerGroup } from './ledger-group';

export interface Ledger {
    id?: string;
    name?: string;
    ledgerGroup?: LedgerGroup;
    ledgerGroupId?: string;
    openingBalance?: number;
    refNo?: string;
    details?: string;
}
