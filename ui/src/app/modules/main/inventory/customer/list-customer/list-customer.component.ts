import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
export interface Customertable{
  name: string;
  email: string;
  state: string;
  phone: number;
  address: string;
}

const Customer_DATA: Customertable[] = [
  {name: 'adfs', email: 'abc4444@gmail.com', state: 'kerala', phone: 9966558877,address:'Lorem ipsum dolor sit amet,'},
  {name: 'adfs', email: 'jabc4444@gmail.com', state: 'kerala', phone: 9966558877,address:'Lorem ipsum dolor sit amet,'},
  {name: 'padfs', email: 'abc4444@gmail.com', state: 'gkerala', phone: 9966558877,address:'Lorem ipsum dolor sit amet,'},
  {name: 'adfs', email: 'abc4444@gmail.com', state: 'kerala', phone: 9966558877,address:'Lorem ipsum dolor sit amet,'},
  {name: 'adfs', email: 'jabc4444@gmail.com', state: 'kerala', phone: 8966558877,address:'tLorem ipsum dolor sit amet,'},
  {name: 'jadfs', email: 'abc4444@gmail.com', state: 'kerala', phone: 9966558877,address:'Lorem ipsum dolor sit amet,'},
  {name: 'adfs', email: 'abc4444@gmail.com', state: 'gkerala', phone: 9966558877,address:'Lorem ipsum dolor sit amet,'},
  {name: 'adfs', email: 'abc4444@gmail.com', state: 'kerala', phone: 9966558877,address:'Lorem ipsum dolor sit amet,'},
  {name: 'tmadfs', email: 'abc4444@gmail.com', state: 'kerala', phone: 8966558877,address:'gLorem ipsum dolor sit amet,'},
  {name: 'gadfs', email: 'abc4444@gmail.com', state: 'kerala', phone: 9966558877,address:' fLorem ipsum dolor sit amet,'},
  {name: 'adfs', email: 'jabc4444@gmail.com', state: 'gkerala', phone: 9966558877,address:'Lorem ipsum dolor sit amet,'},
  {name: 'fadfs', email: 'abc4444@gmail.com', state: 'gkerala', phone: 9966558877,address:'Lorem ipsum dolor sit amet,'},
  {name: 'adfs', email: 'abc4444@gmail.com', state: 'kerala', phone: 9966558877,address:'rLorem ipsum dolor sit amet,'},
   

   
];

@Component({
  selector: 'app-list-customer',
  templateUrl: './list-customer.component.html',
  styleUrls: ['./list-customer.component.scss']
})
export class ListCustomerComponent implements OnInit {

  displayedColumns: string[] = ['name', 'email', 'state', 'phone', 'address'];
  dataSource = new MatTableDataSource<Customertable>(Customer_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor() { }

  ngOnInit(): void {
  }

}
