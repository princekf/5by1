import { ICardData } from '../ICardData';

export interface ITableData extends ICardData {
    results: Array<Record<string, string|number>>;
}
