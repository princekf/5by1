export interface ICardData {
    type: 'Summary' | 'LineChart' | 'PieChart' | 'Table'
    width: 'width33' | 'width50' | 'width100'
    title: {
        value: string;
        icon?: string;
    };
}
