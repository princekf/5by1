import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LedgerReportComponent } from './ledger/ledger-report/ledger-report.component';
import { TrialBalanceReportComponent } from './trial-balance/trial-balance-report/trial-balance-report.component';

const routes: Routes = [
  {
    path: 'ledger',
    pathMatch: 'full',

    component: LedgerReportComponent
  },
  {
    path: 'trial-balance',
    pathMatch: 'full',

    component: TrialBalanceReportComponent
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ReportsRoutingModule { }