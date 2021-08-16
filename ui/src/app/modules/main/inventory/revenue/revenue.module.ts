import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListRevenueComponent } from './list-revenue/list-revenue.component';
import { CreateRevenueComponent } from './create-revenue/create-revenue.component';
import { RevenueRoutingModule } from './revenue.routing.module';


@NgModule({
  declarations: [ ListRevenueComponent, CreateRevenueComponent ],
  imports: [
    CommonModule, RevenueRoutingModule
  ]
})
export class RevenueModule { }
