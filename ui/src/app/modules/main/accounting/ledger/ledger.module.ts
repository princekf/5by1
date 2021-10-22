import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LedgerRoutingModule } from './ledger-routing.module';
import { ListLedgerComponent } from './list-ledger/list-ledger.component';
import { CreateLedgerComponent } from './create-ledger/create-ledger.component';
import { DeleteLedgerComponent } from './delete-ledger/delete-ledger.component';
import { FilterLedgerComponent } from './filter-ledger/filter-ledger.component';


@NgModule({
  declarations: [ ListLedgerComponent, CreateLedgerComponent, DeleteLedgerComponent, FilterLedgerComponent ],
  imports: [
    CommonModule,
    LedgerRoutingModule
  ]
})
export class LedgerModule { }
