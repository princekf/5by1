import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from './data-table.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatMenuModule} from '@angular/material/menu';

import { TableFilterDirective } from '../directives/table-filter/table-filter.directive';

@NgModule({
  declarations: [ DataTableComponent, TableFilterDirective, ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatSortModule,
    MatPaginatorModule,
    NgxSkeletonLoaderModule,
    MatTableModule,
    MatCheckboxModule, MatMenuModule,
  ],
  exports: [ DataTableComponent ]
})
export class DataTableModule { }
