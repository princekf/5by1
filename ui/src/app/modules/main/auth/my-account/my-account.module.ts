import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyAccountComponent } from './my-account.component';
import { MyAccountRoutingModule } from './my-account-routing.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [ MyAccountComponent ],
  imports: [
    CommonModule, MyAccountRoutingModule, NgxSkeletonLoaderModule, MatTableModule, MatIconModule
  ]
})
export class MyAccountModule { }
