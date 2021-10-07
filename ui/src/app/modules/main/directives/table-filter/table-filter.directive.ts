import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[filterHost]'
})
export class TableFilterDirective {

  constructor(
    public viewContainerRef: ViewContainerRef) { }

}
