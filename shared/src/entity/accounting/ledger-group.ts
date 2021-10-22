export interface LedgerGroup {
    id?: string;
    name?: string;
    parent?: LedgerGroup;
    parentId?: string;
    details?: string;
}
