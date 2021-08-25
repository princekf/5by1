
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateCategoryComponent } from './create-category/create-category.component';
import { ListCategoryComponent } from './list-category/list-category.component';
import { CategoryRoutingModule } from './category.routing.module';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { ToolBarModule } from '../../tool-bar/tool-bar.module';
import { DataTableModule } from '../../data-table/data-table.module';
import { DeleteCategoryComponent } from './delete-category/delete-category.component';
import {MatTableModule} from '@angular/material/table';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {MatSortModule} from '@angular/material/sort';
@NgModule({
  declarations: [ CreateCategoryComponent, ListCategoryComponent, DeleteCategoryComponent ],
  imports: [
    CommonModule,
    ToolBarModule,
    DataTableModule,
    CategoryRoutingModule, MatSelectModule, MatFormFieldModule, ReactiveFormsModule,
    FormsModule, MatInputModule, MatButtonModule, MatTableModule, MatSortModule,
    NgxSkeletonLoaderModule
  ]
})
export class CategoryModule { }
