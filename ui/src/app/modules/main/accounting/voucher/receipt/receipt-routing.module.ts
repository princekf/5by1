import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateReceiptComponent } from './create-receipt/create-receipt.component';
import { ListReceiptComponent } from './list-receipt/list-receipt.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',

    component: ListReceiptComponent
  },
  {
    path: 'create',
    pathMatch: 'full',
    component: CreateReceiptComponent
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ReceiptRoutingModule { }
