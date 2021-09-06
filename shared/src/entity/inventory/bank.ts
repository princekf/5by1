export interface Bank {
    id?: string;
    // Bank, Cash etc
    type: 'Bank' | 'Cash' | 'Other';
    // Name of Bank
    name: string;
    openingBalance: number;
     // Description of Bank
    description?:string;

}
