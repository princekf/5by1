import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListPurchaseComponent } from './list-purchase/list-purchase.component';
import { PurchaseRoutingModule } from './purchase-routing.module';
import { ToolBarModule } from '../../../tool-bar/tool-bar.module';
import { VoucherTemplateModule } from '../template/voucher-template.module';
import { DataTableModule } from '../../../data-table/data-table.module';
import { CreatePurchaseComponent } from './create-purchase/create-purchase.component';


@NgModule({
  declarations: [ ListPurchaseComponent, CreatePurchaseComponent ],
  imports: [
    CommonModule, ToolBarModule, VoucherTemplateModule, DataTableModule, PurchaseRoutingModule
  ]
})
export class PurchaseModule { }
