import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateCreditNoteComponent } from './create-credit-note/create-credit-note.component';
import { ListCreditNoteComponent } from './list-credit-note/list-credit-note.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',

    component: ListCreditNoteComponent
  },
  {
    path: 'create',
    pathMatch: 'full',
    component: CreateCreditNoteComponent
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class CreditNoteRoutingModule { }
