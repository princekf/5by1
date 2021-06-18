export interface TaxS {
    // Group name like SGST, CGST, IGST etc
    groupName: string;
    // Name like SGST - 9%, CGST - 9% etc
    name: string;
    // Tax rate like 5%, 9% etc
    rate: number;
    // Applied to - like 100% of total, 50% of total etc
    appliedTo: number;
}

export interface Tax extends TaxS {
    _id?: string;
}
