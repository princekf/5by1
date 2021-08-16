import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListTransactionComponent } from './list-transaction/list-transaction.component';
import { CreateTransactionComponent } from './create-transaction/create-transaction.component';
import { TransactionRoutingModule } from './transaction.routing.module';


@NgModule({
  declarations: [ ListTransactionComponent, CreateTransactionComponent ],
  imports: [
    CommonModule, TransactionRoutingModule
  ]
})
export class TransactionModule { }
