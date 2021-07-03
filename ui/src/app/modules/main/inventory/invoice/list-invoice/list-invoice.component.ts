import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
export interface Taxtable {
  gcolour: string;
  name: string;
  rate: number;
  apliedTo: number;
}

const Tax_DATA: Taxtable[] = [
  {gcolour: 'abc', name: 'fan',rate:9555,apliedTo: 55555},
  {gcolour: 'abc', name: 'fan',rate:3555,apliedTo: 75555},
  {gcolour: 'abc', name: 'tan',rate:3555,apliedTo: 55555},
  {gcolour: 'abc', name: 'fan',rate:3555,apliedTo: 25555},
  {gcolour: 'zbc', name: 'fan',rate:3555,apliedTo: 55555},
  {gcolour: 'abc', name: 'van',rate:5555,apliedTo: 15555},
  {gcolour: 'abc', name: 'van',rate:3555,apliedTo: 55555},
  {gcolour: 'kbc', name: 'fan',rate:3555,apliedTo: 35555},
  {gcolour: 'abc', name: 'fan',rate:2555,apliedTo: 85555},
  {gcolour: 'abc', name: 'fan',rate:3555,apliedTo: 55555},
  {gcolour: 'dbc', name: 'tan',rate:3555,apliedTo: 95555},
  {gcolour: 'abc', name: 'van',rate:4555,apliedTo: 65555},
  {gcolour: 'abc', name: 'fan',rate:2555,apliedTo: 55555},
  {gcolour: 'fbc', name: 'tan',rate:1555,apliedTo: 55555},
  {gcolour: 'pbc', name: 'fan',rate:3555,apliedTo: 45555},
   
];

@Component({
  selector: 'app-list-invoice',
  templateUrl: './list-invoice.component.html',
  styleUrls: ['./list-invoice.component.scss']
})
export class ListInvoiceComponent implements OnInit {

  displayedColumns: string[] = ['gcolour', 'name', 'rate', 'apliedTo'];
  dataSource = new MatTableDataSource<Taxtable>(Tax_DATA);

  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  


  constructor() { }

  ngOnInit(): void {
  }

}
