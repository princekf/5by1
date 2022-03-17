
export interface LedgerImport {

    id?: string;
    Name?: string;
    Code?: string;
    ledgerGroupId?: string;
    OpeningBalance: number;
    OpeningType:'Credit' | 'Debit';
    Details?: string;

}
