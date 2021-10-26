import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CostCentreRoutingModule } from './cost-centre-routing.module';
import { ListCostCentreComponent } from './list-cost-centre/list-cost-centre.component';
import { CreateCostCentreComponent } from './create-cost-centre/create-cost-centre.component';
import { DeleteCostCentreComponent } from './delete-cost-centre/delete-cost-centre.component';

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
import { FilterCostCentreComponent } from './filter-cost-centre/filter-cost-centre.component';


@NgModule({
  declarations: [ ListCostCentreComponent, CreateCostCentreComponent,
    DeleteCostCentreComponent,
    FilterCostCentreComponent ],
  imports: [
    CommonModule,
    CostCentreRoutingModule, DataTableModule, MatTableModule, NgxSkeletonLoaderModule, MatSortModule, ToolBarModule,
    MatSelectModule, MatFormFieldModule, ReactiveFormsModule, FormsModule,
    MatInputModule, MatButtonModule
  ]
})
export class CostCentreModule { }
