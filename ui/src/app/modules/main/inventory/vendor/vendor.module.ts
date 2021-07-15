import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListVendorComponent } from './list-vendor/list-vendor.component';
import { CreateVendorComponent } from './create-vendor/create-vendor.component';
import { VendorRoutingModule } from './vendor.routing.module';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import { ToolBarModule } from '../../tool-bar/tool-bar.module';


@NgModule({
  declarations: [ ListVendorComponent, CreateVendorComponent ],
  imports: [
    CommonModule,
    ToolBarModule,
    VendorRoutingModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, MatButtonModule,
    MatIconModule, MatAutocompleteModule, FormsModule, MatSelectModule, MatTableModule,
    MatPaginatorModule, MatSortModule
  ]
})
export class VendorModule { }
