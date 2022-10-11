import { formatDate } from '@angular/common';
import { NativeDateAdapter } from '@angular/material/core';

export class MonthDatePickerAdapter extends NativeDateAdapter {

  format(date: Date, displayFormat: unknown): string {

    if (displayFormat === 'input') {

      return formatDate(date, 'MMM-dd', this.locale);

    }
    return date.toDateString();

  }

}
