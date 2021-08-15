export interface Account {
    // Bank, Cash etc
    type: 'Bank' | 'Cash' | 'Other';
    // Name of Bank
    name: string;
    openingBalance: number;
}
