import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';

import { ProductRoutingModule } from './product.routing.module';
import { ListProductComponent } from './list-product/list-product.component';
import { CreateProductComponent } from './create-product/create-product.component';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';

@NgModule({
  declarations: [
    ListProductComponent,
    CreateProductComponent,
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    MatTableModule,
    MatSortModule, MatInputModule,
    MatSelectModule, MatIconModule, MatPaginatorModule,
    MatButtonModule, MatButtonToggleModule, MatSlideToggleModule
  ]
})
export class ProductModule { }
