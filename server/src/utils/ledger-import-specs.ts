
export interface LedgerImport {

    id?: string;
    Name?: string;
    Code?: string;
    LedgerGroupCode:string;
    OpeningBalance: number;
    OpeningType:'Credit' | 'Debit';
    Details?: string;

}
