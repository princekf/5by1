import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListBankComponent } from './list-bank/list-bank.component';
import { CreateBankComponent } from './create-bank/create-bank.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',

    component: ListBankComponent
  },
  {
    path: 'create',
    pathMatch: 'full',
    component: CreateBankComponent
  },


];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class BankRoutingModule { }
