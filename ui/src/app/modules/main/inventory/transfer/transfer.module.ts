import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListTransferComponent } from './list-transfer/list-transfer.component';
import { CreateTransferComponent } from './create-transfer/create-transfer.component';
import { TransferRoutingModule } from './transfer.routing.module';


@NgModule({
  declarations: [ ListTransferComponent, CreateTransferComponent ],
  imports: [
    CommonModule, TransferRoutingModule
  ]
})
export class TransferModule { }
