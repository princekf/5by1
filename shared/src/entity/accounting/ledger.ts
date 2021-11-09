import { LedgerGroup } from './ledger-group';

export interface Ledger {
    id?: string;
    name?: string;
    ledgerGroup?: LedgerGroup;
    ledgerGroupId?: string;
    // Opening balance amount and type
    obAmount?: number;
    obType?: 'Credit' | 'Debit';
    refNo?: string;
    details?: string;
    [prop: string]: unknown;
}
