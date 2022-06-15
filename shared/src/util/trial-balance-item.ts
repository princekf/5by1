export interface TrialBalanceItem {
    id: string;
    parentId: string;
    name: string;
    code: string;
    credit: number;
    debit: number;
    obCredit: number;
    obDebit: number;
    opening: string;
    balance: string;
    children: Array<TrialBalanceItem>;
}
