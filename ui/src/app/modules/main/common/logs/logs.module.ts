import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestLogsRoutingModule } from './logs-routing.module';
import { RequestLogsComponent } from './request-logs/request-logs.component';
import { DataTableModule } from '../../data-table/data-table.module';
import { FilterRequestLogsComponent } from './filter-request-logs/filter-request-logs.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CreateRequestLogsComponent } from './create-request-logs/create-request-logs.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';


@NgModule({
  declarations: [ RequestLogsComponent, FilterRequestLogsComponent, CreateRequestLogsComponent ],
  imports: [
    CommonModule, RequestLogsRoutingModule, DataTableModule, MatSelectModule,
    MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatButtonModule,
    FormsModule,MatDatepickerModule,NgxSkeletonLoaderModule
  ]
})
export class LogsModule { }
