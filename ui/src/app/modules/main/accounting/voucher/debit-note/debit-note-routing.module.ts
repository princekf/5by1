import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListDebitNoteComponent } from './list-debit-note/list-debit-note.component';
import { CreateDebitNoteComponent } from './create-debit-note/create-debit-note.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',

    component: ListDebitNoteComponent
  },
  {
    path: 'create',
    pathMatch: 'full',
    component: CreateDebitNoteComponent
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class DebitNoteRoutingModule { }
