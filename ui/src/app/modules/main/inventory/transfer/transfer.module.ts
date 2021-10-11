import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListTransferComponent } from './list-transfer/list-transfer.component';
import { CreateTransferComponent } from './create-transfer/create-transfer.component';
import { TransferRoutingModule } from './transfer.routing.module';
import { DeleteTransferComponent } from './delete-transfer/delete-transfer.component';
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
import { FilterTransferComponent } from './filter-transfer/filter-transfer.component';

@NgModule({
  declarations: [ ListTransferComponent, CreateTransferComponent, DeleteTransferComponent, FilterTransferComponent ],
  imports: [
    CommonModule, TransferRoutingModule, MatSelectModule, MatFormFieldModule, ReactiveFormsModule,
    FormsModule, MatInputModule, MatButtonModule, MatTableModule, MatSortModule,
    NgxSkeletonLoaderModule, ToolBarModule, DataTableModule, MatNativeDateModule, MatDatepickerModule
  ]
})
export class TransferModule { }
