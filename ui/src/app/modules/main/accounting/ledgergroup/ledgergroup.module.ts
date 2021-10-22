import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LedgergroupRoutingModule } from './ledgergroup-routing.module';
import { ListLedgergroupComponent } from './list-ledgergroup/list-ledgergroup.component';
import { CreateLedgergroupComponent } from './create-ledgergroup/create-ledgergroup.component';
import { DeleteLedgergroupComponent } from './delete-ledgergroup/delete-ledgergroup.component';
import { FilterLedgergroupComponent } from './filter-ledgergroup/filter-ledgergroup.component';

import {MatFormFieldModule} from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import { ToolBarModule } from '../../tool-bar/tool-bar.module';
import { DataTableModule } from '../../data-table/data-table.module';
import {MatAutocompleteModule} from '@angular/material/autocomplete';


@NgModule({
  declarations: [ ListLedgergroupComponent, CreateLedgergroupComponent,
    DeleteLedgergroupComponent, FilterLedgergroupComponent ],
  imports: [
    CommonModule,
    LedgergroupRoutingModule,
    ToolBarModule, DataTableModule, MatInputModule, MatFormFieldModule,
    ReactiveFormsModule, FormsModule, MatButtonModule, NgxSkeletonLoaderModule,
    MatSortModule, MatTableModule, MatSelectModule, MatAutocompleteModule
  ]
})
export class LedgergroupModule { }
