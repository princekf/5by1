import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListBillComponent } from './list-bill/list-bill.component';
import { CreateBillComponent } from './create-bill/create-bill.component';
import { BillRoutingModule } from './bill.routing.module';
import { DeleteBillComponent } from './delete-bill/delete-bill.component';


@NgModule({
  declarations: [ ListBillComponent, CreateBillComponent, DeleteBillComponent ],
  imports: [
    CommonModule, BillRoutingModule
  ]
})
export class BillModule { }
