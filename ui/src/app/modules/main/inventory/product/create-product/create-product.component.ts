import { Component, OnInit, } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Validators } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';


export interface Colour {
  name: string;
}
@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: [ './create-product.component.scss' ]
})

 
 
export class CreateProductComponent implements OnInit { 

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  colour: Colour[] = [
    {name: 'Red'},
    {name: 'Blue'},
    {name: 'Green'},
  ];

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our colour
    if (value) {
      this.colour.push({name: value});
    }

    // Clear the input value
    // event.chipInput!.clear();
  }

  remove(colour: Colour): void {
    const index = this.colour.indexOf(colour);

    if (index >= 0) {
      this.colour.splice(index, 1);
    }
  }

  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
   
  name=new FormControl('', Validators.required);
  picture=new FormControl('', Validators.required);
  brand=new FormControl('', Validators.required);
  location=new FormControl('', Validators.required);
  code=new FormControl('', Validators.required);
  color=new FormControl('', Validators.required);
  
    
     
  ngOnInit(): void{
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  
}

