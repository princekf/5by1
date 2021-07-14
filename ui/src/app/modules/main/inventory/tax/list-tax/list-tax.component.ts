import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Tax } from '@shared/entity/inventory/tax';
import { MainService } from '@services/main.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

const Tax_DATA: Tax[] = [
  {_id: '01231',
    groupName: 'IGST',
    name: 'IGST 5%',
    rate: 5,
    appliedTo: 100,
    description: 'IGST 5% - For other state customers'},
  {_id: '01232',
    groupName: 'IGST',
    name: 'IGST 10%',
    rate: 10,
    appliedTo: 100,
    description: 'IGST 10% - For other state customers'},
  {_id: '01233',
    groupName: 'IGST',
    name: 'IGST 12%',
    rate: 12,
    appliedTo: 100,
    description: 'IGST 12% - For other state customers'}
];

@Component({
  selector: 'app-list-tax',
  templateUrl: './list-tax.component.html',
  styleUrls: [ './list-tax.component.scss' ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px',
        minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})


export class ListTaxComponent implements OnInit {

  expandedElement: Tax | null;

  displayedColumns: string[] = [ 'groupName', 'name', 'rate', 'appliedTo', 'description' ];

  columnHeaders = {
    groupName: 'Group Name',
    name: 'Name',
    rate: 'Rate (%)',
    appliedTo: 'Applied To (%)',
    description: 'Description'

  }

  extraColumns: string[] = [ ];

  dataSource = new MatTableDataSource<Tax>(Tax_DATA);


  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private readonly mainService: MainService) { }

  ngAfterViewInit():void {

    if (this.mainService.isMobileView()) {

      const COLUMN_COUNT_MOBILE_VIEW = 3;
      this.extraColumns = this.displayedColumns;
      this.displayedColumns = this.extraColumns.splice(0, COLUMN_COUNT_MOBILE_VIEW);

    }
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

  }

  ngOnInit(): void {


  }

}
