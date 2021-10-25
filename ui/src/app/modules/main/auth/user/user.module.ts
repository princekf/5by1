import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { ListUserComponent } from './list-user/list-user.component';
import { DeleteUserComponent } from './delete-user/delete-user.component';
import { FilterUserComponent } from './filter-user/filter-user.component';
import { CreateUserComponent } from './create-user/create-user.component';


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


@NgModule({
  declarations: [ListUserComponent, DeleteUserComponent, FilterUserComponent, CreateUserComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    DataTableModule, MatTableModule, NgxSkeletonLoaderModule, MatSortModule, ToolBarModule,
    MatSelectModule, MatFormFieldModule, ReactiveFormsModule, FormsModule,
    MatInputModule, MatButtonModule,
  ]
})
export class UserModule { }
