import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateTaxComponent } from './create-tax/create-tax.component';
import { ListTaxComponent } from './list-tax/list-tax.component';
import { TaxRoutingModule } from './tax.routing.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
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
    MatFormFieldModule, ReactiveFormsModule, FormsModule, MatAutocompleteModule,
    MatInputModule, MatButtonModule,
    NgxSkeletonLoaderModule, MatSortModule, MatTableModule,
  ]
})
export class TaxModule {}
