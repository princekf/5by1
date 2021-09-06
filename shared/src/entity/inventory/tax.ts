export interface Tax {
    id?: string;
    // Group name like SGST, CGST, IGST etc
    groupName: string;
    // Name like SGST - 9%, CGST - 9% etc
    name: string;
    // Tax rate like 5%, 9% etc
    rate: number;
    // Applied to - like 100% of total, 50% of total etc
    appliedTo: number;
    // Descriptions like : For other state customers, etc
    description?: string;
}

