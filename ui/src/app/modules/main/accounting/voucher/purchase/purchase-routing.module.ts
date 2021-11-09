import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListPurchaseComponent } from './list-purchase/list-purchase.component';
import { CreatePurchaseComponent } from './create-purchase/create-purchase.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',

    component: ListPurchaseComponent
  },
  {
    path: 'create',
    pathMatch: 'full',
    component: CreatePurchaseComponent
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class PurchaseRoutingModule { }
