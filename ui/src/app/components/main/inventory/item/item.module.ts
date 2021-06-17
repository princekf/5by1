import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';

import { ItemRoutingModule } from './item.routing.module';
import { ListItemComponent } from './list-item/list-item.component';
import { CreateItemComponent } from './create-item/create-item.component';


import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { AngularFileUploaderModule } from "angular-file-uploader";

@NgModule({
  declarations: [
    ListItemComponent,
    CreateItemComponent,
  ],
  imports: [
    CommonModule,
    ItemRoutingModule,
    MatTableModule,
    MatSortModule,MatInputModule, 
    MatSelectModule, MatIconModule,MatPaginatorModule,
    MatButtonModule, MatButtonToggleModule,MatSlideToggleModule,AngularFileUploaderModule]
})
export class ItemModule { }
