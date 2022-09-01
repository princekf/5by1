export interface TrialBalanceItem {
    id: string;
    parentId: string;
    name: string;
    code: string;
    credit?: number;
    debit?: number;
    obCredit?: number;
    obDebit?: number;
    closeCredit?: number;
    closeDebit?: number;
    children: Array<TrialBalanceItem>;
}
