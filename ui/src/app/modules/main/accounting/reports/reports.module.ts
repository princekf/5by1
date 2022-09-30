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
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS } from '@angular/material/core';
import { TrialBalanceReportComponent } from './trial-balance/trial-balance-report/trial-balance-report.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {MatIconModule} from '@angular/material/icon';
import { LedgerGroupReportComponent } from './ledger-group/ledger-group-report/ledger-group-report.component';
import { FilterLedgerGroupReportComponent } from './ledger-group/filter-ledger-group-report/filter-ledger-group-report.component';
import { ProfitLossReportComponent } from './profit-loss/profit-loss-report/profit-loss-report.component';
import { FilterProfitLossReportComponent } from './profit-loss/filter-profit-loss-report/filter-profit-loss-report.component';
import { FilterBalanceSheetReportComponent } from './balance-sheet/filter-balance-sheet-report/filter-balance-sheet-report.component';
import { BalanceSheetReportComponent } from './balance-sheet/balance-sheet-report/balance-sheet-report.component';
import { MatTreeModule } from '@angular/material/tree';
import { MatTableModule } from '@angular/material/table';
import { DatePickerAdapter, PICK_FORMATS } from '@fboutil/date-picker-adapter';
import { FilterDayBookReportComponent } from './day-book/filter-day-book-report/filter-day-book-report.component';
import { DayBookReportComponent } from './day-book/day-book-report/day-book-report.component';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [ LedgerReportComponent, FilterLedgerReportComponent, TrialBalanceReportComponent,
    LedgerGroupReportComponent, FilterLedgerGroupReportComponent, ProfitLossReportComponent,
    FilterProfitLossReportComponent, FilterBalanceSheetReportComponent, BalanceSheetReportComponent,
    FilterDayBookReportComponent, DayBookReportComponent ],
  imports: [
    CommonModule, ReportsRoutingModule, DataTableModule, MatDatepickerModule, MatNativeDateModule, MatButtonModule,
    ReactiveFormsModule, FormsModule, MatAutocompleteModule, MatSelectModule, MatFormFieldModule, MatInputModule,
    MatDayjsDateModule, NgxSkeletonLoaderModule, MatIconModule, MatRadioModule, MatTreeModule,
    MatTableModule, MatMenuModule,
  ],
  providers: [ {provide: DateAdapter,
    useClass: DatePickerAdapter},
  {provide: MAT_DATE_FORMATS,
    useValue: PICK_FORMATS} ]
})
export class ReportsModule { }
