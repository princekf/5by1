import { Component, Input, OnInit } from '@angular/core';
import { ISummary } from './ISummary';

@Component({
  selector: 'app-summary-card',
  templateUrl: './summary-card.component.html',
  styleUrls: [ './summary-card.component.scss' ]
})
export class SummaryCardComponent implements OnInit {

  @Input() summary: ISummary;
  constructor() { }

  ngOnInit(): void {
  }

}
