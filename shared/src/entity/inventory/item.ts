export interface ItemS {
    name: string;
    pPrice: number;
    sPrice: number;
    status: 'Active' | 'Disabled' | 'Deleted';
}
export interface Item extends ItemS {
    _id?: string;
}
