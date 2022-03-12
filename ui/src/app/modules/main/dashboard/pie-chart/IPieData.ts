import { ICardData } from '../ICardData';

export interface IPieData extends ICardData{
    results: Array<{name: string, value: number}>;
}
