import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListRevenueComponent } from './list-revenue/list-revenue.component';
import { CreateRevenueComponent } from './create-revenue/create-revenue.component';
import { RevenueRoutingModule } from './revenue.routing.module';
import { DeleteRevenueComponent } from './delete-revenue/delete-revenue.component';


@NgModule({
  declarations: [ ListRevenueComponent, CreateRevenueComponent, DeleteRevenueComponent ],
  imports: [
    CommonModule, RevenueRoutingModule
  ]
})
export class RevenueModule { }
