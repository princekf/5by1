export interface Bank {
    // Bank, Cash etc
    type: 'Bank' | 'Cash' | 'Other';
    // Name of Bank
    name: string;
    openingBalance: number;
}
