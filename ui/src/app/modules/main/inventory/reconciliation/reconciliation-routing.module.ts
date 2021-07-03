import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import{ListReconciliationComponent} from './list-reconciliation/list-reconciliation.component'
import{ CreateReconciliationComponent } from './create-reconciliation/create-reconciliation.component'
const routes: Routes = [

  {
    path: '',
    pathMatch: 'full',

    component:  ListReconciliationComponent
  },
  {
    path: 'create',
    pathMatch: 'full',
    component:  CreateReconciliationComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReconciliationRoutingModule { }
