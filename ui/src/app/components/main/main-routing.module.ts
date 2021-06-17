import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent} from './main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then((mod) => mod.DashboardModule)
      },
      {
        path: 'item',
        loadChildren: () => import('./inventory/item/item.module').then((mod) => mod.ItemModule)
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },

      
      
    ]
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class MainRoutingModule { }
