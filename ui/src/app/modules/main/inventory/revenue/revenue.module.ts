import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListRevenueComponent } from './list-revenue/list-revenue.component';
import { CreateRevenueComponent } from './create-revenue/create-revenue.component';
import { RevenueRoutingModule } from './revenue.routing.module';
import { DeleteRevenueComponent } from './delete-revenue/delete-revenue.component';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { ToolBarModule } from '../../tool-bar/tool-bar.module';
import { DataTableModule } from '../../data-table/data-table.module';
import {MatTableModule} from '@angular/material/table';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {MatSortModule} from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS } from '@angular/material/core';
import { FilterRevenueComponent } from './filter-revenue/filter-revenue.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { DatePickerAdapter, PICK_FORMATS } from '@fboutil/date-picker-adapter';
@NgModule({
  declarations: [ ListRevenueComponent, CreateRevenueComponent, DeleteRevenueComponent, FilterRevenueComponent ],
  imports: [
    CommonModule, RevenueRoutingModule,
    MatSelectModule, MatFormFieldModule, ReactiveFormsModule,
    FormsModule, MatInputModule, MatButtonModule, MatTableModule, MatSortModule,
    NgxSkeletonLoaderModule, ToolBarModule, MatDatepickerModule, MatNativeDateModule,
    DataTableModule, MatAutocompleteModule
  ],
  providers: [
    {provide: DateAdapter,
      useClass: DatePickerAdapter},
    {provide: MAT_DATE_FORMATS,
      useValue: PICK_FORMATS}
  ]
})
export class RevenueModule { }
