import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';

import { ItemRoutingModule } from './item.routing.module';
import { ListItemComponent } from './list-item/list-item.component';


@NgModule({
  declarations: [
    ListItemComponent,
  ],
  imports: [
    CommonModule,
    ItemRoutingModule,
    MatTableModule,
    MatSortModule,
  ]
})
export class ItemModule { }
