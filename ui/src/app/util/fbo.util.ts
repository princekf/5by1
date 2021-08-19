import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

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


export const goToPreviousPage = (route: ActivatedRoute, router: Router): void => {

  const burl = route.snapshot.queryParamMap.get('burl');
  const uParams:Record<string, string> = {};
  let baseUri = burl;
  if (burl?.includes('?')) {

    baseUri = burl.substr(0, burl.indexOf('?'));
    const httpParams = new HttpParams({ fromString: burl.split('?')[1] });
    const keys = httpParams.keys();
    keys.forEach((key) => (uParams[key] = httpParams.get(key)));

  }
  router.navigate([ baseUri ], {queryParams: uParams});

};
