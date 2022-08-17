export interface DayBookItem {
    voucherId: string;
    ledgerId: string;
    ledgerName: string;
    ledgerCode: string;
    date: Date;
    type: string;
    number: string;
    credit: number;
    debit: number;
    children: Array<DayBookItem>;
}
