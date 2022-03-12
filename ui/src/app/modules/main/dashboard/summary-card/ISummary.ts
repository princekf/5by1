import { ICardData } from '../ICardData';

export interface ISummary extends ICardData {
    content: string;
    footer: {
        left: string;
        right: string;
    };
}
