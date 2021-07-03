import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

interface Gname {
  name: string;  
}

@Component({
  selector: 'app-create-bill',
  templateUrl: './create-bill.component.html',
  styleUrls: ['./create-bill.component.scss']
})
export class CreateBillComponent implements OnInit {

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
