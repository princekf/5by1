import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionRoutingModule } from './transaction-routing.module';
import { ListTransactionComponent } from './list-transaction/list-transaction.component';
import { CreateTransactionComponent } from './create-transaction/create-transaction.component';
import { DeleteTransactionComponent } from './delete-transaction/delete-transaction.component';
import { FilterTransactionComponent } from './filter-transaction/filter-transaction.component';


@NgModule({
  declarations: [ ListTransactionComponent, CreateTransactionComponent,
    DeleteTransactionComponent, FilterTransactionComponent ],
  imports: [
    CommonModule,
    TransactionRoutingModule
  ]
})
export class TransactionModule { }
