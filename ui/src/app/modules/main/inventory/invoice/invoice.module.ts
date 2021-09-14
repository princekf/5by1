import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListInvoiceComponent } from './list-invoice/list-invoice.component';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { InvoiceRoutingModule } from './invoice.routing.module';
import { DeleteInvoiceComponent } from './delete-invoice/delete-invoice.component';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { ToolBarModule } from '../../tool-bar/tool-bar.module';
import { DataTableModule } from '../../data-table/data-table.module';
import {MatIconModule} from '@angular/material/icon';
@NgModule({
  declarations: [ ListInvoiceComponent, CreateInvoiceComponent, DeleteInvoiceComponent ],
  imports: [
    CommonModule, InvoiceRoutingModule, ToolBarModule, DataTableModule,
    MatButtonModule, NgxSkeletonLoaderModule, MatSortModule, MatTableModule, MatSelectModule,
    ReactiveFormsModule, FormsModule, MatInputModule, MatDatepickerModule, MatNativeDateModule,
    MatAutocompleteModule, MatIconModule
  ]
})
export class InvoiceModule { }
