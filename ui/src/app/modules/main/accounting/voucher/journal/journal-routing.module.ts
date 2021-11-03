import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateJournalComponent } from './create-journal/create-journal.component';
import { ListJournalComponent } from './list-journal/list-journal.component';
import { DeleteJournalComponent } from './delete-journal/delete-journal.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',

    component: ListJournalComponent
  },
  {
    path: 'create',
    pathMatch: 'full',
    component: CreateJournalComponent
  },
  {
    path: 'delete',
    pathMatch: 'full',
    component: DeleteJournalComponent
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class JournalRoutingModule { }
