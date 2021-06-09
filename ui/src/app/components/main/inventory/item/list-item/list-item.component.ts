import { Component, OnInit } from '@angular/core';
import {Sort} from '@angular/material/sort';
import { ItemService } from '@services/inventory/item.service';
import { Item } from '@shared/entity/inventory/item';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: [ './list-item.component.scss' ]
})
export class ListItemComponent implements OnInit {

  displayedColumns:Array<string> = null;

  items:Array<Item> = null;

  constructor(private itemService:ItemService) {

    this.displayedColumns = [ 'name', 'pPrice', 'sPrice', 'status' ];

  }

  ngOnInit(): void {

    this.itemService.list(0, 10).subscribe((items) => (this.items = items));

  }

  sortData = (sort: Sort) => {
    console.log(sort);
    
  }

}
