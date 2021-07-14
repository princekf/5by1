import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: [ './tool-bar.component.scss' ]
})
export class ToolBarComponent implements OnInit {

  @Input() createUri: string;

  @Input() mainHeader: string;

  @Input() subHeader: string;

  constructor() { }

  ngOnInit(): void {
  }

}
