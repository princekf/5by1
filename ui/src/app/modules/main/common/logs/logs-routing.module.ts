import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestLogsComponent } from './request-logs/request-logs.component';

const routes: Routes = [
  {
    path: 'request-logs',
    pathMatch: 'full',
    component: RequestLogsComponent
  },

];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class RequestLogsRoutingModule { }
