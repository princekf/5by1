import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateCompanyComponent } from './create-company/create-company.component';
import { DeleteCompanyComponent } from './delete-company/delete-company.component';
import { FilterCompanyComponent } from './filter-company/filter-company.component';
import { ListCompanyComponent } from './list-company/list-company.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',

    component: ListCompanyComponent
  },
  {
    path: 'create',
    pathMatch: 'full',
    component: CreateCompanyComponent
  },
  {
    path: 'delete',
    pathMatch: 'full',
    component: DeleteCompanyComponent
  },
  {
    path: 'filter',
    pathMatch: 'full',
    component: FilterCompanyComponent
  },

];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class CompanyRoutingModule { }
