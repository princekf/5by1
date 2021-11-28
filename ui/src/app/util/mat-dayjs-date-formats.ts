import { MatDateFormats } from '@angular/material/core';
import { environment as env} from '../../environments/environment';

/**
 * Custom Date-Formats and Adapter (using https://github.com/iamkun/dayjs)
 */
export const MAT_DAYJS_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: env.dateFormat,
  },
  display: {
    dateInput: env.dateFormat,
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};