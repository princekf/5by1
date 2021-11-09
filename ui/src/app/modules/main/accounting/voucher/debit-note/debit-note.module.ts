import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListDebitNoteComponent } from './list-debit-note/list-debit-note.component';
import { DebitNoteRoutingModule } from './debit-note-routing.module';
import { ToolBarModule } from '../../../tool-bar/tool-bar.module';
import { VoucherTemplateModule } from '../template/voucher-template.module';
import { DataTableModule } from '../../../data-table/data-table.module';
import { CreateDebitNoteComponent } from './create-debit-note/create-debit-note.component';

@NgModule({
  declarations: [ ListDebitNoteComponent, CreateDebitNoteComponent ],
  imports: [
    CommonModule, ToolBarModule, VoucherTemplateModule, DataTableModule, DebitNoteRoutingModule
  ]
})
export class DebitNoteModule { }
