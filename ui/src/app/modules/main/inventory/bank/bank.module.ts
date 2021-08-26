import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListBankComponent } from './list-bank/list-bank.component';
import { CreateBankComponent } from './create-bank/create-bank.component';
import { BankRoutingModule } from './bank.routing.module';
import { DeleteBankComponent } from './delete-bank/delete-bank.component';
import { DataTableModule } from '../../data-table/data-table.module';
import {MatTableModule} from '@angular/material/table';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {MatSortModule} from '@angular/material/sort';
import { ToolBarModule } from '../../tool-bar/tool-bar.module';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
@NgModule({
  declarations: [ ListBankComponent, CreateBankComponent, DeleteBankComponent ],
  imports: [
    CommonModule, BankRoutingModule, DataTableModule, MatTableModule, NgxSkeletonLoaderModule,
    MatSortModule, ToolBarModule, MatSelectModule, MatFormFieldModule, ReactiveFormsModule, FormsModule
  ]
})
export class BankModule { }
