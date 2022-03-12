import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {RouterModule} from '@angular/router';

import { ToolBarComponent } from './tool-bar.component';


@NgModule({
  declarations: [ ToolBarComponent ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    RouterModule
  ],
  exports: [ ToolBarComponent ]
})
export class ToolBarModule { }
