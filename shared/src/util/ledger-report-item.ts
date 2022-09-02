import { VoucherDocument } from '../entity/accounting/voucher-document';

export interface LedgerReportItem {
    id: string;
    number:string;
    date: Date;
    type: string;
    name: string;
    pname: string;
    debit: number | null;
    credit: number | null;
    details: string;
    documents: Array<VoucherDocument>;
}
