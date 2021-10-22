import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinYearRoutingModule } from './fin-year-routing.module';
import { CreateFinYearComponent } from './create-fin-year/create-fin-year.component';
import { FilterFinYearComponent } from './filter-fin-year/filter-fin-year.component';
import { DeleteFinYearComponent } from './delete-fin-year/delete-fin-year.component';
import { ListFinYearComponent } from './list-fin-year/list-fin-year.component';

import { DataTableModule } from '../../data-table/data-table.module';
import {MatTableModule} from '@angular/material/table';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {MatSortModule} from '@angular/material/sort';
import { ToolBarModule } from '../../tool-bar/tool-bar.module';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';


@NgModule({
  declarations: [ CreateFinYearComponent, FilterFinYearComponent, DeleteFinYearComponent, ListFinYearComponent ],
  imports: [
    CommonModule,
    FinYearRoutingModule, DataTableModule, MatTableModule, NgxSkeletonLoaderModule, MatSortModule, ToolBarModule,
    MatSelectModule, MatFormFieldModule, ReactiveFormsModule, FormsModule,
    MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatAutocompleteModule
  ]
})
export class FinYearModule { }
