import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateVendorComponent } from './create-vendor/create-vendor.component';
import { ListVendorComponent } from './list-vendor/list-vendor.component';
import { VendorRoutingModule } from './vendor.routing.module';
import { DeleteVendorComponent } from './delete-vendor/delete-vendor.component';

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
import { FilterVendorComponent } from './filter-vendor/filter-vendor.component';

@NgModule({
  declarations: [ CreateVendorComponent, ListVendorComponent, DeleteVendorComponent, FilterVendorComponent ],
  imports: [
    ToolBarModule, DataTableModule,
    CommonModule, VendorRoutingModule, MatFormFieldModule, ReactiveFormsModule, FormsModule, MatSelectModule,
    MatInputModule, MatButtonModule, NgxSkeletonLoaderModule, MatSortModule, MatTableModule, MatAutocompleteModule,
  ]
})
export class VendorModule { }
