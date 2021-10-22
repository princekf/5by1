import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BranchRoutingModule } from './branch-routing.module';
import { CreateBranchComponent } from './create-branch/create-branch.component';
import { FilterBranchComponent } from './filter-branch/filter-branch.component';
import { DeleteBranchComponent } from './delete-branch/delete-branch.component';
import { ListBranchComponent } from './list-branch/list-branch.component';
import { DataTableModule } from '../../data-table/data-table.module';
import {MatTableModule} from '@angular/material/table';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {MatSortModule} from '@angular/material/sort';
import { ToolBarModule } from '../../tool-bar/tool-bar.module';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';


@NgModule({
  declarations: [ CreateBranchComponent, FilterBranchComponent, DeleteBranchComponent, ListBranchComponent ],
  imports: [
    CommonModule,
    BranchRoutingModule,
    DataTableModule, MatTableModule, NgxSkeletonLoaderModule, MatSortModule, ToolBarModule,
    MatSelectModule, MatFormFieldModule, ReactiveFormsModule, FormsModule,
    MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatAutocompleteModule
  ]
})
export class BranchModule { }
