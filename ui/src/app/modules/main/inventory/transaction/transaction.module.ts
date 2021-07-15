import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionRoutingModule } from './transaction-routing.module';
import { CreateTransactionComponent } from './create-transaction/create-transaction.component';
import { ListTransactionComponent } from './list-transaction/list-transaction.component';


import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import { ToolBarModule } from '../../tool-bar/tool-bar.module';

@NgModule({
  declarations: [ CreateTransactionComponent, ListTransactionComponent ],
  imports: [
    CommonModule,
    TransactionRoutingModule,
    ToolBarModule,
    MatSelectModule, MatFormFieldModule, ReactiveFormsModule, FormsModule, MatAutocompleteModule,
    MatInputModule, MatIconModule, MatIconModule, MatButtonModule, MatDatepickerModule,
    MatTableModule, MatSortModule, MatPaginatorModule
  ]
})
export class TransactionModule { }
