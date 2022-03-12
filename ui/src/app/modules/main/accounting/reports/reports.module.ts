import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LedgerReportComponent } from './ledger/ledger-report/ledger-report.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { DataTableModule } from '../../data-table/data-table.module';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { FilterLedgerReportComponent } from './ledger/filter-ledger-report/filter-ledger-report.component';
import {MatButtonModule} from '@angular/material/button';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';

import { MatDayjsDateModule } from '@tabuckner/material-dayjs-adapter';
import { MatNativeDateModule } from '@angular/material/core';
import {dayJSProviders} from '@fboutil/day-js-providers';
import { TrialBalanceReportComponent } from './trial-balance/trial-balance-report/trial-balance-report.component';
import { TreetableModule } from '@vaseap/ng-material-treetable';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {MatIconModule} from '@angular/material/icon';
import { LedgerGroupReportComponent } from './ledger-group/ledger-group-report/ledger-group-report.component';
import { FilterLedgerGroupReportComponent } from './ledger-group/filter-ledger-group-report/filter-ledger-group-report.component';

@NgModule({
  declarations: [ LedgerReportComponent, FilterLedgerReportComponent, TrialBalanceReportComponent,
    LedgerGroupReportComponent, FilterLedgerGroupReportComponent ],
  imports: [
    CommonModule, ReportsRoutingModule, DataTableModule, MatDatepickerModule, MatNativeDateModule, MatButtonModule,
    ReactiveFormsModule, FormsModule, MatAutocompleteModule, MatSelectModule, MatFormFieldModule, MatInputModule,
    MatDayjsDateModule, TreetableModule, NgxSkeletonLoaderModule, MatIconModule, MatRadioModule
  ],
  providers: [ ...dayJSProviders ]
})
export class ReportsModule { }
