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
  {
    path: 'sales',
    loadChildren: () => import('./sales/sales.module').then((mod) => mod.SalesModule)
  },
  {
    path: 'purchase',
    loadChildren: () => import('./purchase/purchase.module').then((mod) => mod.PurchaseModule)
  },
  {
    path: 'payment',
    loadChildren: () => import('./payment/payment.module').then((mod) => mod.PaymentModule)
  },
  {
    path: 'contra',
    loadChildren: () => import('./contra/contra.module').then((mod) => mod.ContraModule)
  },
  {
    path: 'credit-note',
    loadChildren: () => import('./credit-note/credit-note.module').then((mod) => mod.CreditNoteModule)
  },
  {
    path: 'debit-note',
    loadChildren: () => import('./debit-note/debit-note.module').then((mod) => mod.DebitNoteModule)
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class VoucherRoutingModule { }
