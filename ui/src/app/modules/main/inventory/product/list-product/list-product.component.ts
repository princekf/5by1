import { Component, OnInit, ViewChild } from '@angular/core';
import {MatSort, Sort} from '@angular/material/sort';
import { ProductService } from '@services/inventory/product.service';
import { Product } from '@shared/entity/inventory/product';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-product.component.html',
  styleUrls: [ './list-product.component.scss' ]
})
export class ListProductComponent implements OnInit {
  
  displayedColumns:Array<string> = null;

  items:Array<Product> = null;

  dataSource = new MatTableDataSource(this.items);


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }
   

  constructor(private productService:ProductService) {

    this.displayedColumns = [ 'name', 'code', 'location', 'unit.name', 'status', 'enable', 'actions' ];

  }


  ngOnInit(): void {

    this.productService.list(0, 10).subscribe((items) => (this.items = items));


  }

  sortData = (sort: Sort) => {

    console.log(sort);

  }

}
