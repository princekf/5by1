import { Component, OnInit,AfterViewInit,ViewChild } from '@angular/core';
import {Sort} from '@angular/material/sort';
import { ItemService } from '@services/inventory/item.service';
import { Item } from '@shared/entity/inventory/item';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: [ './list-item.component.scss' ]
})
export class ListItemComponent implements OnInit {
  
  
  displayedColumns:Array<string> = null;

  items:Array<Item> = null;

  dataSource = new MatTableDataSource(this.items);

 
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
  }
  constructor(private itemService:ItemService) {
    this.displayedColumns = [ 'name', 'pPrice', 'sPrice', 'status', 'enable','actions' ];
    
  }
  

  ngOnInit(): void {

    this.itemService.list(0, 10).subscribe((items) => (this.items = items));
    

  }

  sortData = (sort: Sort) => {
    console.log(sort);
    
  }

}
