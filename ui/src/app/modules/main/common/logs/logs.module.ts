import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestLogsComponent } from './request-logs/request-logs.component';
import { RequestLogsRoutingModule } from './logs-routing.module';


@NgModule({
  declarations: [ RequestLogsComponent ],
  imports: [
    CommonModule, RequestLogsRoutingModule
  ]
})
export class LogsModule { }
