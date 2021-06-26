import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
export interface Categorytable {
   
  name: string;
  daterange: string;
  pname: string;
}

const Tax_DATA: Categorytable[] = [
  {name: 'jabc', daterange: '26/6/2021-22/12/2021',pname:'abc'},
  {name: 'abc', daterange: '26/6/2011-16/12/2021',pname:'abc'},
  {name: 'abc', daterange: '26/6/2021-12/2/2021',pname:'abc'},
  {name: 'lkbc', daterange: '26/6/2021-28/2/2021',pname:'abc'},
  {name: 'fabc', daterange: '26/6/2021-28/2/2021',pname:'abc'},
  {name: 'abc', daterange: '26/6/2021-28/2/2021',pname:'abc'},
  {name: 'fabc', daterange: '26/6/2021-28/2/2021',pname:'abc'},
  {name: 'avbc', daterange: '26/6/2021-28/2/2021',pname:'abc'},
  {name: 'tabc', daterange: '26/6/2021-28/2/2021',pname:'abc'},
  {name: 'jabc', daterange: '26/6/2021-28/2/2021',pname:'abc'},
  {name: 'khabc', daterange: '26/6/2021-28/2/2021',pname:'abc'},
  {name: 'abc', daterange: '26/6/2021-28/2/2021',pname:'abc'},
  {name: 'abc', daterange: '26/6/2021-28/2/2021',pname:'abc'},
  {name: 'fabc', daterange: '26/6/2021-28/2/2021',pname:'abc'},
  {name: 'abc', daterange: '26/6/2021-28/2/2021',pname:'abc'},
  {name: 'abc', daterange: '26/6/2021-28/2/2021',pname:'abc'},
  {name: 'abc', daterange: '26/6/2021-28/2/2021',pname:'abc'},
  {name: 'uabc', daterange: '26/6/2021-28/2/2021',pname:'abc'},
   
];

 
@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.scss']
})

export class ListCategoryComponent implements OnInit {

  displayedColumns: string[] = ['name', 'daterange', 'pname'];
  dataSource = new MatTableDataSource<Categorytable>(Tax_DATA);

  
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
 