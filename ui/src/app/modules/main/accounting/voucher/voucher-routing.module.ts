import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [

  {
    path: 'journal',
    loadChildren: () => import('./journal/journal.module').then((mod) => mod.JournalModule)
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class VoucherRoutingModule { }
