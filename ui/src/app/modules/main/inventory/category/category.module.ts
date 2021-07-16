import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateCategoryComponent } from './create-category/create-category.component';
import { ListCategoryComponent } from './list-category/list-category.component';
import { CategoryRoutingModule } from './category.routing.module';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatNativeDateModule } from '@angular/material/core';
import {MatRadioModule} from '@angular/material/radio';
import { ToolBarModule } from '../../tool-bar/tool-bar.module';
import { DataTableModule } from '../../data-table/data-table.module';

@NgModule({
  declarations: [ CreateCategoryComponent, ListCategoryComponent ],
  imports: [
    CommonModule,
    ToolBarModule,
    DataTableModule,
    CategoryRoutingModule, MatSelectModule, MatFormFieldModule, ReactiveFormsModule,
    FormsModule, MatAutocompleteModule, MatInputModule, MatIconModule, MatButtonModule,
    MatDatepickerModule, MatButtonToggleModule, MatNativeDateModule, MatRadioModule,

  ]
})
export class CategoryModule { }
