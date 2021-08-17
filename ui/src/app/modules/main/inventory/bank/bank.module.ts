import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListBankComponent } from './list-bank/list-bank.component';
import { CreateBankComponent } from './create-bank/create-bank.component';
import { BankRoutingModule } from './bank.routing.module';
import { DeleteBankComponent } from './delete-bank/delete-bank.component';


@NgModule({
  declarations: [ ListBankComponent, CreateBankComponent, DeleteBankComponent ],
  imports: [
    CommonModule, BankRoutingModule
  ]
})
export class BankModule { }
