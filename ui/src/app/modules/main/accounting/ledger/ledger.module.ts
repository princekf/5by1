import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LedgerRoutingModule } from './ledger-routing.module';
import { ListLedgerComponent } from './list-ledger/list-ledger.component';
import { CreateLedgerComponent } from './create-ledger/create-ledger.component';
import { DeleteLedgerComponent } from './delete-ledger/delete-ledger.component';
import { FilterLedgerComponent } from './filter-ledger/filter-ledger.component';

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
  declarations: [ ListLedgerComponent, CreateLedgerComponent, DeleteLedgerComponent, FilterLedgerComponent ],
  imports: [
    CommonModule,
    LedgerRoutingModule,
    DataTableModule, MatTableModule, NgxSkeletonLoaderModule, MatSortModule, ToolBarModule,
    MatSelectModule, MatFormFieldModule, ReactiveFormsModule, FormsModule,
    MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatAutocompleteModule
  ]
})
export class LedgerModule { }
