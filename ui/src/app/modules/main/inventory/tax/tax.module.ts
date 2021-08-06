import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateTaxComponent } from './create-tax/create-tax.component';
import { ListTaxComponent } from './list-tax/list-tax.component';
import { TaxRoutingModule } from './tax.routing.module';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';

import { ToolBarModule } from '../../tool-bar/tool-bar.module';
import { DataTableModule } from '../../data-table/data-table.module';
import { DeleteTaxComponent } from './delete-tax/delete-tax.component';

@NgModule({
  declarations: [ CreateTaxComponent, ListTaxComponent, DeleteTaxComponent ],
  imports: [
    CommonModule,
    TaxRoutingModule,
    ToolBarModule,
    DataTableModule,
    MatSelectModule, MatFormFieldModule, ReactiveFormsModule, FormsModule, MatAutocompleteModule,
    MatInputModule, MatIconModule, MatIconModule, MatButtonModule, MatDatepickerModule,
    NgxSkeletonLoaderModule, MatSortModule, MatTableModule,
  ]
})
export class TaxModule {}
