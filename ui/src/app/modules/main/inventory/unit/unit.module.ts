import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatFormFieldModule} from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';

import { ListUnitComponent } from './list-unit/list-unit.component';
import { CreateUnitComponent } from './create-unit/create-unit.component';
import { DeleteUnitComponent } from './delete-unit/delete-unit.component';

import { UnitRoutingModule } from './unit.routing.module';
import { ToolBarModule } from '../../tool-bar/tool-bar.module';
import { DataTableModule } from '../../data-table/data-table.module';

import { FilterUnitComponent } from './filter-unit/filter-unit.component';


@NgModule({
  declarations: [ ListUnitComponent, CreateUnitComponent, DeleteUnitComponent, FilterUnitComponent ],
  imports: [
    CommonModule,
    UnitRoutingModule, ToolBarModule, DataTableModule, MatInputModule, MatFormFieldModule,
    ReactiveFormsModule, FormsModule, MatButtonModule, NgxSkeletonLoaderModule,
    MatSortModule, MatTableModule, MatSelectModule
  ]
})
export class UnitModule { }
