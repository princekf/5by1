import { ICardData } from '../ICardData';

export interface ILineData extends ICardData{
    results: Array<{name: string, series: Array<{name: string, value: number}>}>;
}
