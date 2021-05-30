import { Component, Input, OnInit } from '@angular/core';
import { ColorHelper, ScaleType } from '@swimlane/ngx-charts';
import { IPieData } from './IPieData';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: [ './pie-chart.component.scss' ]
})
export class PieChartComponent implements OnInit {

  @Input() pieData: IPieData;

  colorScheme = {
    domain: [ '#F2F7FF', '#0062FF' ]
  };

  legendNames: Array<string>;

  legendColors:ColorHelper;

  constructor() { }

  ngOnInit(): void {

    this.legendNames = this.pieData?.results.map((res) => res.name);
    this.legendColors = new ColorHelper(this.colorScheme, ScaleType.Ordinal, this.legendNames, this.colorScheme);

  }

}
