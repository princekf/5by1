export interface TrialBalanceItem {
    id: string;
    parentId: string;
    name: string;
    code: string;
    credit: number | null;
    debit: number | null;
    obCredit: number;
    obDebit: number;
    opening: string;
    balance: string;
    children: Array<TrialBalanceItem>;
}
