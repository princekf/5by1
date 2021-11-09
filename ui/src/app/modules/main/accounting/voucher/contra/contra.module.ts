import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListContraComponent } from './list-contra/list-contra.component';
import { CreateContraComponent } from './create-contra/create-contra.component';
import { ContraRoutingModule } from './contra-routing.module';
import { ToolBarModule } from '../../../tool-bar/tool-bar.module';
import { VoucherTemplateModule } from '../template/voucher-template.module';
import { DataTableModule } from '../../../data-table/data-table.module';

@NgModule({
  declarations: [ ListContraComponent, CreateContraComponent ],
  imports: [
    CommonModule, ToolBarModule, VoucherTemplateModule, DataTableModule, ContraRoutingModule
  ]
})
export class ContraModule { }
