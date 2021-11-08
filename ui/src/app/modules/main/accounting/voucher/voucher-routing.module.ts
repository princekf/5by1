import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeleteVoucherComponent } from './delete-voucher/delete-voucher.component';

const routes: Routes = [
  {
    path: 'delete',
    pathMatch: 'full',
    component: DeleteVoucherComponent
  },
  {
    path: 'journal',
    loadChildren: () => import('./journal/journal.module').then((mod) => mod.JournalModule)
  },
  {
    path: 'receipt',
    loadChildren: () => import('./receipt/receipt.module').then((mod) => mod.ReceiptModule)
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class VoucherRoutingModule { }
