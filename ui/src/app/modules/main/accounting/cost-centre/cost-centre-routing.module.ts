import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateCostCentreComponent } from './create-cost-centre/create-cost-centre.component';
import { DeleteCostCentreComponent } from './delete-cost-centre/delete-cost-centre.component';
import { FilterCostCentreComponent } from './filter-cost-centre/filter-cost-centre.component';

import { ListCostCentreComponent } from './list-cost-centre/list-cost-centre.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',

    component: ListCostCentreComponent
  },
  {
    path: 'create',
    pathMatch: 'full',
    component: CreateCostCentreComponent
  },
  {
    path: 'delete',
    pathMatch: 'full',
    component: DeleteCostCentreComponent
  },
  {
    path: 'filter',
    pathMatch: 'full',
    component: FilterCostCentreComponent
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class CostCentreRoutingModule { }
