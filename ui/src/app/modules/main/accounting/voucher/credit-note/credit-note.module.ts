import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateCreditNoteComponent } from './create-credit-note/create-credit-note.component';

import { CreditNoteRoutingModule } from './credit-note-routing.module';
import { ToolBarModule } from '../../../tool-bar/tool-bar.module';
import { VoucherTemplateModule } from '../template/voucher-template.module';
import { DataTableModule } from '../../../data-table/data-table.module';
import { ListCreditNoteComponent } from './list-credit-note/list-credit-note.component';

@NgModule({
  declarations: [ CreateCreditNoteComponent, ListCreditNoteComponent ],
  imports: [
    CommonModule, ToolBarModule, VoucherTemplateModule, DataTableModule, CreditNoteRoutingModule
  ]
})
export class CreditNoteModule { }
