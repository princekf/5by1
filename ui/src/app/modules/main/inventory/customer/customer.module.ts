import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListCustomerComponent } from './list-customer/list-customer.component';
import { CreateCustomerComponent } from './create-customer/create-customer.component';
import { CustomerRoutingModule } from './customer.routing.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSelectModule} from '@angular/material/select';
import { ToolBarModule } from '../../tool-bar/tool-bar.module';
import { DataTableModule } from '../../data-table/data-table.module';
import { DeleteCustomerComponent } from './delete-customer/delete-customer.component';
import { FilterCustomerComponent } from './filter-customer/filter-customer.component';

@NgModule({
  declarations: [ ListCustomerComponent, CreateCustomerComponent, DeleteCustomerComponent, FilterCustomerComponent ],
  imports: [
    CommonModule, CustomerRoutingModule, MatFormFieldModule, ReactiveFormsModule, FormsModule,
    MatInputModule, MatButtonModule, NgxSkeletonLoaderModule, MatSortModule, MatTableModule,
    ToolBarModule, DataTableModule, MatAutocompleteModule, MatSelectModule
  ]
})
export class CustomerModule { }
