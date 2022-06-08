import { Directive, EventEmitter, HostBinding as hostBinding, HostListener as hostListener, Output} from '@angular/core';

@Directive({
  selector: '[appFileDragDrop]'
})
export class FileDragDropDirective {

  @Output() filesDropped: EventEmitter<File[]> = new EventEmitter();

  @hostBinding('style.background') private background = '#EEEEEE';


  @hostListener('dragover', [ '$event' ])
  public onDragOver(evt: DragEvent): void {

    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#999';

  }

  @hostListener('dragleave', [ '$event' ])
  public onDragLeave(evt: DragEvent): void {

    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#eee';

  }

  @hostListener('drop', [ '$event' ])
  public onDrop(evt: DragEvent): void {

    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#eee';
    const files: File[] = [];
    for (let idx = 0; idx < evt.dataTransfer.files.length; idx++) {

      const file = evt.dataTransfer.files[idx];
      files.push(file);

    }
    if (files.length > 0) {

      this.filesDropped.emit(files);

    }

  }

}
