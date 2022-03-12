import { Component, Input, OnInit } from '@angular/core';
import { ColorHelper, ScaleType } from '@swimlane/ngx-charts';
import { ILineData } from './ILineData';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: [ './line-chart.component.scss' ]
})
export class LineChartComponent implements OnInit {

  @Input() lineData: ILineData;

  colorScheme = {
    domain: [ '#1E3354', '#0062FF', '#CFDFFE' ]
  };

  legendNames: Array<string>;

  legendColors:ColorHelper;

  constructor() {}

  ngOnInit(): void {

    this.legendNames = this.lineData?.results.map((res) => res.name);
    this.legendColors = new ColorHelper(this.colorScheme, ScaleType.Ordinal, this.legendNames, this.colorScheme);

  }

}
