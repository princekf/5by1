import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatIconModule} from '@angular/material/icon';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

import { DataTableModule } from '../../../data-table/data-table.module';

import { CreateJournalComponent } from './create-journal/create-journal.component';
import { ListJournalComponent } from './list-journal/list-journal.component';
import { JournalRoutingModule } from './journal-routing.module';
import { ToolBarModule } from '../../../tool-bar/tool-bar.module';
import { VoucherTemplateModule } from '../template/voucher-template.module';

@NgModule({
  declarations: [ CreateJournalComponent, ListJournalComponent ],
  imports: [
    CommonModule, JournalRoutingModule, ToolBarModule, VoucherTemplateModule,
    MatFormFieldModule, ReactiveFormsModule, FormsModule, NgxSkeletonLoaderModule, MatButtonModule,
    MatInputModule, MatNativeDateModule, MatAutocompleteModule, MatIconModule, MatDatepickerModule,
    MatSelectModule, MatSortModule, MatTableModule, MatButtonToggleModule, DataTableModule,
  ]
})
export class JournalModule { }
