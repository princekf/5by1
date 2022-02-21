import { Component, EventEmitter, Input, OnInit, Output, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { MainService } from '../../../services/main.service';
@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: [ './tool-bar.component.scss' ]
})
export class ToolBarComponent implements OnInit {

  @Input() createUri: string;

  @Input() mainHeader: string;

  @Input() subHeader: string;


  @Output() importClickEvent = new EventEmitter<File>();

  @Output() exportClickEvent = new EventEmitter<void>();


  constructor(
    private mainservice: MainService,
    private readonly router: Router,
    @Inject(DOCUMENT) private document: Document) { }

  ngOnInit(): void {
    const name = {
      filename: this.mainHeader,
      title: this.subHeader
    };
    this.mainservice.setHd(name);

  }



  onCreateClick(): void {

    this.router.navigate([ this.createUri ], { queryParams: {burl: this.router.url} });

  }

  openImportFile = (): void => {

    this.document.getElementById('importFileInput').click();

  }

  handleImportFileInput(files: FileList): void {

    this.importClickEvent.emit(files[0]);

  }

  handleExportData(): void {


    this.exportClickEvent.emit();

  }

}
