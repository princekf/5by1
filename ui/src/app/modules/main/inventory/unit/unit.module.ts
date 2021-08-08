import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListUnitComponent } from './list-unit/list-unit.component';
import { CreateUnitComponent } from './create-unit/create-unit.component';
import { DeleteUnitComponent } from './delete-unit/delete-unit.component';

import { UnitRoutingModule } from './unit.routing.module';
import { ToolBarModule } from '../../tool-bar/tool-bar.module';
import { DataTableModule } from '../../data-table/data-table.module';


@NgModule({
  declarations: [ ListUnitComponent, CreateUnitComponent, DeleteUnitComponent ],
  imports: [
    CommonModule,
    UnitRoutingModule, ToolBarModule, DataTableModule
  ]
})
export class UnitModule { }
