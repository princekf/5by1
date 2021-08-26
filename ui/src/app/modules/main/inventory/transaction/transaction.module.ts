import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListTransactionComponent } from './list-transaction/list-transaction.component';
import { TransactionRoutingModule } from './transaction.routing.module';


@NgModule({
  declarations: [ ListTransactionComponent ],
  imports: [
    CommonModule, TransactionRoutingModule
  ]
})
export class TransactionModule { }
