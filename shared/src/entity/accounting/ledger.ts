import { LedgerGroup } from './ledger-group';

export interface Ledger {
    id?: string;
    name?: string;
    code?: string;
    ledgerGroup?: LedgerGroup;
    ledgerGroupId?: string;
    // Opening balance amount and type
    obAmount?: number;
    obType?: 'Credit' | 'Debit';
    details?: string;
    [prop: string]: unknown;
}
