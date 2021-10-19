import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListBillComponent } from './list-bill/list-bill.component';
import { CreateBillComponent } from './create-bill/create-bill.component';
import { BillRoutingModule } from './bill.routing.module';
import { DeleteBillComponent } from './delete-bill/delete-bill.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { ToolBarModule } from '../../tool-bar/tool-bar.module';
import { DataTableModule } from '../../data-table/data-table.module';
import {MatIconModule} from '@angular/material/icon';
import { FilterBillComponent } from './filter-bill/filter-bill.component';
import {MatCardModule} from '@angular/material/card';

@NgModule({
  declarations: [ ListBillComponent, CreateBillComponent, DeleteBillComponent, FilterBillComponent ],
  imports: [
    CommonModule, BillRoutingModule, MatButtonModule, NgxSkeletonLoaderModule, MatSortModule, MatTableModule, 
    MatSelectModule,
    ReactiveFormsModule, FormsModule, MatInputModule, MatDatepickerModule, MatNativeDateModule,
    MatAutocompleteModule, DataTableModule, ToolBarModule, MatFormFieldModule, MatButtonToggleModule,
    MatSlideToggleModule, MatIconModule, MatCardModule
  ]
})
export class BillModule { }
