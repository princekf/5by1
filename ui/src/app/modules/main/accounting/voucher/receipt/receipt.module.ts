import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListReceiptComponent } from './list-receipt/list-receipt.component';
import { CreateReceiptComponent } from './create-receipt/create-receipt.component';
import { ReceiptRoutingModule } from './receipt-routing.module';
import { FilterReceiptComponent } from './filter-receipt/filter-receipt.component';

import { ToolBarModule } from '../../../tool-bar/tool-bar.module';
import { VoucherTemplateModule } from '../template/voucher-template.module';
import { DataTableModule } from '../../../data-table/data-table.module';

@NgModule({
  declarations: [ ListReceiptComponent, CreateReceiptComponent, FilterReceiptComponent ],
  imports: [
    CommonModule, ReceiptRoutingModule, ToolBarModule, VoucherTemplateModule, DataTableModule
  ]
})
export class ReceiptModule { }
