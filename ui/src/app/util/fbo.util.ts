import { animate, state, style, transition, trigger } from '@angular/animations';

export const findColumnValue = (element:unknown, column:string,
  parsingFn?:(elm:unknown, clm:string)=>string):string => {

  if (parsingFn) {

    const pVal = parsingFn(element, column);
    if (pVal) {

      return pVal;

    }

  }
  return <string> column.split('.').reduce((acc, cur) => acc[cur] ?? '', element);

};

export const fboTableRowExpandAnimation = [
  trigger('detailExpand', [
    state('collapsed', style({height: '0px',
      minHeight: '0'})),
    state('expanded', style({height: '*'})),
    transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
  ]),
];
