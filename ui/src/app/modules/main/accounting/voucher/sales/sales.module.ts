import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateSalesComponent } from './create-sales/create-sales.component';
import { SalesRoutingModule } from './sales-routing.module';
import { ToolBarModule } from '../../../tool-bar/tool-bar.module';
import { VoucherTemplateModule } from '../template/voucher-template.module';
import { DataTableModule } from '../../../data-table/data-table.module';
import { ListSalesComponent } from './list-sales/list-sales.component';


@NgModule({
  declarations: [ CreateSalesComponent, ListSalesComponent ],
  imports: [
    CommonModule, ToolBarModule, VoucherTemplateModule, DataTableModule, SalesRoutingModule
  ]
})
export class SalesModule { }
