import { Component, EventEmitter, Input, OnInit, Output, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: [ './tool-bar.component.scss' ]
})
export class ToolBarComponent implements OnInit {

  @Input() createUri: string;

  @Input() mainHeader: string;

  @Input() subHeader: string;

  @Output() onImportClickEvent = new EventEmitter<File>();

  @Output() onExportClickEvent = new EventEmitter<void>();


  constructor(private readonly router: Router,
    @Inject(DOCUMENT) private document: Document) { }

  ngOnInit(): void {
  }

  onCreateClick(): void {

    this.router.navigate([ this.createUri ], { queryParams: {burl: this.router.url} });

  }

  openImportFile = ():void => {

    this.document.getElementById('importFileInput').click();

  }

  handleImportFileInput(files: FileList): void {

    this.onImportClickEvent.emit(files[0]);

  }

  handleExportData(): void {

    this.onExportClickEvent.emit();

  }

}
