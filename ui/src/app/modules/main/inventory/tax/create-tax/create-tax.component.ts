import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
 
interface Gname {
  name: string;
   
}
@Component({
  selector: 'app-create-tax',
  templateUrl: './create-tax.component.html',
  styleUrls: ['./create-tax.component.scss']
})
export class CreateTaxComponent implements OnInit {

  groupname = new FormControl('', Validators.required);
  name=new FormControl('', Validators.required);
  rate=new FormControl('', Validators.required);
  appliedTo=new FormControl('', Validators.required);

  Gnames: Gname[] = [
    {name: 'G1'},
    {name: 'G2'},
    {name: 'G3'},
    {name: 'G4'},
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
