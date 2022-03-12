import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateFinYearComponent } from './create-fin-year/create-fin-year.component';
import { DeleteFinYearComponent } from './delete-fin-year/delete-fin-year.component';
import { FilterFinYearComponent } from './filter-fin-year/filter-fin-year.component';
import { ListFinYearComponent } from './list-fin-year/list-fin-year.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',

    component: ListFinYearComponent
  },
  {
    path: 'create',
    pathMatch: 'full',
    component: CreateFinYearComponent
  },
  {
    path: 'delete',
    pathMatch: 'full',
    component: DeleteFinYearComponent
  },
  {
    path: 'filter',
    pathMatch: 'full',
    component: FilterFinYearComponent
  },

];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class FinYearRoutingModule { }
