import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { ListAccountComponent } from './list-account/list-account.component';


import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import { CreateAccountComponent } from './create-account/create-account.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { ToolBarModule } from '../../tool-bar/tool-bar.module';

@NgModule({
  declarations: [ ListAccountComponent, CreateAccountComponent, ],
  imports: [
    CommonModule,
    ToolBarModule,
    AccountRoutingModule,
    MatSelectModule, MatFormFieldModule, ReactiveFormsModule, FormsModule, MatAutocompleteModule,
    MatInputModule, MatIconModule, MatIconModule, MatButtonModule, MatDatepickerModule,
    MatTableModule, MatSortModule, MatPaginatorModule, MatExpansionModule
  ]
})
export class AccountModule { }
