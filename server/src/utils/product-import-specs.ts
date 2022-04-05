export interface ProductImport {

    id?: string;
    Name?: string;
    Code?:string;
    Brand?:string;
    Location?:string;
    Barcode?: string;
    ReOrder: number;
    Category?:string;
   Status?: 'Active'|'Disabled'|'Deleted';


}
