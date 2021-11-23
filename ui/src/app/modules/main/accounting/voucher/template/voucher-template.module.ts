import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatIconModule} from '@angular/material/icon';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

import { CreateVoucherComponent } from './create-voucher/create-voucher.component';
import { ListVoucherComponent } from './list-voucher/list-voucher.component';

import { DataTableModule } from '../../../data-table/data-table.module';
import { FilterVoucherComponent } from './filter-voucher/filter-voucher.component';

@NgModule({
  declarations: [ CreateVoucherComponent, ListVoucherComponent, FilterVoucherComponent, ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatSortModule,
    NgxSkeletonLoaderModule,
    MatTableModule,
    MatFormFieldModule, ReactiveFormsModule, FormsModule, NgxSkeletonLoaderModule, MatButtonModule,
    MatInputModule, MatNativeDateModule, MatAutocompleteModule, MatIconModule, MatDatepickerModule,
    MatSelectModule, MatSortModule, MatTableModule, MatButtonToggleModule, DataTableModule,
  ],
  exports: [ CreateVoucherComponent, ListVoucherComponent ]
})
export class VoucherTemplateModule { }
