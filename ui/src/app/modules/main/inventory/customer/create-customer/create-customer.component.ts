import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
interface State { 
  viewValue: string;
}
@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.scss']
})
export class CreateCustomerComponent implements OnInit {

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  name=new FormControl('', Validators.required);
  state=new FormControl('', Validators.required);
  phone=new FormControl('', Validators.required);
  customer=new FormControl('', Validators.required);
  states: State[] = [
    {viewValue: 'state1'},
    {viewValue: 'state2'},
    {viewValue: 'state3'}
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
