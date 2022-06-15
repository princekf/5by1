export interface LedgerGroup {
    id?: string;
    name?: string;
    code?: string;
    parent?: LedgerGroup;
    parents?: Array<LedgerGroup>;
    children?: Array<LedgerGroup>;
    parentId?: string;
    details?: string;
    [prop: string]: unknown;
}
