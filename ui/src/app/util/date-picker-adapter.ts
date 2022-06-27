import { formatDate } from '@angular/common';
import { NativeDateAdapter } from '@angular/material/core';
import { environment } from '@fboenvironments/environment';

export const PICK_FORMATS = {
  parse: {dateInput: {month: 'short',
    year: 'numeric',
    day: 'numeric'}},
  display: {
    dateInput: 'input',
    monthYearLabel: {year: 'numeric',
      month: 'short'},
    dateA11yLabel: {year: 'numeric',
      month: 'long',
      day: 'numeric'},
    monthYearA11yLabel: {year: 'numeric',
      month: 'long'}
  }
};

export class DatePickerAdapter extends NativeDateAdapter {

  format(date: Date, displayFormat: unknown): string {

    if (displayFormat === 'input') {

      return formatDate(date, environment.datePickerFormat, this.locale);

    }
    return date.toDateString();

  }

}
