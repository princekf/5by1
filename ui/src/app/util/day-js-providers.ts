
import { MAT_DAYJS_DATE_ADAPTER_OPTIONS } from '@tabuckner/material-dayjs-adapter';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import {MAT_DAYJS_DATE_FORMATS} from './mat-dayjs-date-formats';

export const dayJSProviders = [ {provide: MAT_DATE_FORMATS,
  useValue: MAT_DAYJS_DATE_FORMATS},
{ provide: MAT_DAYJS_DATE_ADAPTER_OPTIONS,
  useValue: { useUtc: true } } ];
