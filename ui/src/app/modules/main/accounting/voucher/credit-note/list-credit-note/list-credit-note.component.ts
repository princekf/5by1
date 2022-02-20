import { Component } from '@angular/core';
import { VoucherType } from '@shared/entity/accounting/voucher';
import { ExportPopupComponent } from '../../../../export-popup/export-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { MainService } from '../../../../../../services/main.service';
import { VoucherService } from '@fboservices/accounting/voucher.service';

@Component({
  selector: 'app-list-credit-note',
  templateUrl: './list-credit-note.component.html',
  styleUrls: [ './list-credit-note.component.scss' ]
})
export class ListCreditNoteComponent {

  voucherType = VoucherType.CREDIT_NOTE;

  tableHeader = 'List of Credit Notes';

  editUri = '/voucher/credit-note/create';

  displayedColumns: string[] = [ 'number', 'date', 'pledger', 'cledger', 'amount', 'details' ];


  columnHeaders = {
    number: 'Voucher #',
    date: 'Date',
    pledger: 'Primary Ledger',
    cledger: 'Compound Ledger',
    amount: 'Amount',
    details: 'Details',
  }


  export:any = []


  constructor(private voucherService: VoucherService,
    private mainservice: MainService,
    private dialog: MatDialog) { }


    handleImportClick = (file: File): void => {

      this.voucherService.importVouchers(file).subscribe(() => {
  
        console.log('file uploaded');
  
      });
     
  
    }
  handleExportClick = (): void => {
    let data = []   
 
    
    this.mainservice.getExport().subscribe(result1=>{
      this.export= result1
      console.log(result1);
      
    })


  const items=this.export.items
     this.dialog.open(ExportPopupComponent, {
      height: '500px',
    data:{items,
    displayedColumns: this.displayedColumns,
    columnHeaders: this.columnHeaders,
    
       }  
      });

}

}
