import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileDragDropDirective } from './file-drag-drop.directive';


@NgModule({
  declarations: [ FileDragDropDirective ],
  imports: [
    CommonModule
  ],
  exports: [ FileDragDropDirective ]
})
export class FileDragDropModule { }
