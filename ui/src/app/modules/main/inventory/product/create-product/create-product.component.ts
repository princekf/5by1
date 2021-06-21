import { Component, OnInit, } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
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
  constructor(private formBuilder: FormBuilder) { }
  productForm= this.formBuilder.group({
    name:['',Validators.required],
    picture:['',Validators.required],
    brand:['',Validators.required],
    location:['',Validators.required],
    code:['',Validators.required],
    colour:['',Validators.required],
     

  });

  

  saveForm(){
    console.log('Form data is ', this.productForm.value);
  }

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

