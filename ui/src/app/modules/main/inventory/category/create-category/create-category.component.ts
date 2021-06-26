import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

interface Parent { 
  viewValue: string;
}
@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss']
})
export class CreateCategoryComponent implements OnInit {

  name=new FormControl('', Validators.required);
  sdate=new FormControl('', Validators.required);
  edate=new FormControl('', Validators.required);
  parent=new FormControl('', Validators.required);


  parents: Parent[] = [
    {viewValue: 'p1'},
    {viewValue: 'P2'},
    {viewValue: 'p3'}
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
