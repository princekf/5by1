import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LedgergroupRoutingModule } from './ledgergroup-routing.module';
import { ListLedgergroupComponent } from './list-ledgergroup/list-ledgergroup.component';
import { CreateLedgergroupComponent } from './create-ledgergroup/create-ledgergroup.component';
import { DeleteLedgergroupComponent } from './delete-ledgergroup/delete-ledgergroup.component';
import { FilterLedgergroupComponent } from './filter-ledgergroup/filter-ledgergroup.component';


@NgModule({
  declarations: [ ListLedgergroupComponent, CreateLedgergroupComponent,
    DeleteLedgergroupComponent, FilterLedgergroupComponent ],
  imports: [
    CommonModule,
    LedgergroupRoutingModule
  ]
})
export class LedgergroupModule { }
