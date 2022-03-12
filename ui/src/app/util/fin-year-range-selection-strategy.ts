import { Injectable } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import {
  MatDateRangeSelectionStrategy,
  DateRange,
} from '@angular/material/datepicker';

@Injectable()
export class FinYearRangeSelectionStrategy<D> implements MatDateRangeSelectionStrategy<D> {

    startDate:{month: number, date: number} = {month: 3,
      date: 1}

    constructor(private _dateAdapter: DateAdapter<D>) {}

    selectionFinished(date: D | null): DateRange<D> {

      return this._createFinYearRange(date);

    }

    createPreview(activeDate: D | null): DateRange<D> {

      return this._createFinYearRange(activeDate);

    }

    private _createFinYearRange(date: D | null): DateRange<D> {

      if (date) {

        const month = this._dateAdapter.getMonth(date);
        let startYear = this._dateAdapter.getYear(date);
        let endYear = startYear;
        month < this.startDate.month ? startYear -= 1 : endYear += 1;
        const start = this._dateAdapter.createDate(startYear, this.startDate.month, this.startDate.date);
        const end2 = this._dateAdapter.createDate(endYear, this.startDate.month, this.startDate.date);
        const end = this._dateAdapter.addCalendarDays(end2, -1);

        return new DateRange<D>(start, end);

      }

      return new DateRange<D>(null, null);

    }

}
