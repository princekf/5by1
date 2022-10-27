import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateRequestLogsComponent } from './create-request-logs/create-request-logs.component';
import { RequestLogsComponent } from './request-logs/request-logs.component';

const routes: Routes = [
  {
    path: 'request-logs',
    pathMatch: 'full',
    component: RequestLogsComponent
  },
  {
    path: 'create',
    pathMatch: 'full',
    component: CreateRequestLogsComponent
  },

];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class RequestLogsRoutingModule { }
