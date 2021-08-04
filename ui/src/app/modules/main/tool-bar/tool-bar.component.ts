import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: [ './tool-bar.component.scss' ]
})
export class ToolBarComponent implements OnInit {

  @Input() createUri: string;

  @Input() mainHeader: string;

  @Input() subHeader: string;

  constructor(private readonly router: Router) { }

  ngOnInit(): void {
  }

  onCreateClick(): void {

    this.router.navigate([ this.createUri ], { queryParams: {burl: this.router.url} });

  }

}
