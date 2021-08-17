import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListInvoiceComponent } from './list-invoice/list-invoice.component';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { InvoiceRoutingModule } from './invoice.routing.module';
import { DeleteInvoiceComponent } from './delete-invoice/delete-invoice.component';



@NgModule({
  declarations: [ListInvoiceComponent, CreateInvoiceComponent, DeleteInvoiceComponent],
  imports: [
    CommonModule, InvoiceRoutingModule
  ]
})
export class InvoiceModule { }
