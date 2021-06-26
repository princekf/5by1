import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateCustomerComponent } from './create-customer/create-customer.component';
import { ListCustomerComponent } from './list-customer/list-customer.component';
import { CustomerRoutingModule } from './cutomer.routing.module';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import {FormsModule,} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table'; 
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
@NgModule({
  declarations: [ CreateCustomerComponent, ListCustomerComponent ],
  imports: [
    CommonModule,
    CustomerRoutingModule,MatSelectModule,MatFormFieldModule,ReactiveFormsModule,FormsModule,
    MatAutocompleteModule,MatInputModule,MatIconModule,MatButtonModule,MatTableModule,MatPaginatorModule,
    MatSortModule

  ]
})
export class CustomerModule { }
