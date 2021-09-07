import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListTransactionComponent } from './list-transaction/list-transaction.component';
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
import { MatNativeDateModule } from '@angular/material/core';
import { TransactionRoutingModule } from './transaction.routing.module';
import {MatPaginatorModule} from '@angular/material/paginator';
@NgModule({
  declarations: [ ListTransactionComponent ],
  imports: [
    CommonModule, TransactionRoutingModule, ToolBarModule, DataTableModule, MatTableModule,
    NgxSkeletonLoaderModule, MatSortModule, MatDatepickerModule, MatNativeDateModule, MatPaginatorModule,
    MatButtonModule, ReactiveFormsModule, FormsModule, MatInputModule, MatSelectModule, MatFormFieldModule
  ]
})
export class TransactionModule { }
