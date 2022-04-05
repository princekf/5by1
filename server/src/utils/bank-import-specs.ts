export interface BankImport {

    id?: string;
    Name?: string;
    Type?:'Bank'|'Cash'|'Other';
    OpeningBalance?:number;
    Description?:string;


}
