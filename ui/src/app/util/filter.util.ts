import { FormGroup } from '@angular/forms';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
dayjs.extend(utc);

export interface SingleCondition {
    name: string;
    operator: string;
    value: string | Array<number>;
}

export interface FilterFormField {
    name: string;
    type: string;
}

export const extractCondition = (name: string, condition: Record<string, unknown>):SingleCondition => {

  if (condition.like) {

    const like = <string>condition.like;
    const [ value, operator ] = like.startsWith('^') ? [ like.substring(1), '^' ] : [ like, '' ];
    return {
      name,
      value,
      operator
    };

  }
  for (const oper of [ 'eq', 'lt', 'gt', 'between', 'ne' ]) {

    if (condition[oper]) {

      return {
        name,
        operator: oper,
        value: condition[oper] as string | Array<number>,

      };

    }

  }
  return null;

};

export const fillFilterForm = (filterForm: FormGroup, whereS: string):void => {

  if (!whereS) {

    return;

  }
  const where:Record<string, Record<string, unknown>> = JSON.parse(whereS);
  for (const [ whereName, whereCond ] of Object.entries(where)) {

    const condExtract = extractCondition(whereName, whereCond);
    filterForm.controls[`${condExtract.name}Type`]?.setValue(condExtract.operator);
    if (condExtract.operator === 'between') {

      filterForm.controls[`${condExtract.name}Start`]?.setValue(condExtract.value[0]);
      filterForm.controls[`${condExtract.name}End`]?.setValue(condExtract.value[1]);

    } else {

      filterForm.controls[condExtract.name]?.setValue(condExtract.value);

    }

  }

};

const createStringCondition = (filterForm: FormGroup, fieldName: string, typeName: string):unknown => {

  const operator = filterForm.controls[typeName]?.value;
  if (operator === 'eq') {

    return {like: `^${filterForm.controls[fieldName]?.value}$`,
      options: 'i'};

  }
  return {like: `${operator}${filterForm.controls[fieldName]?.value}`,
    options: 'i'};

};

export const createQueryStringFromFilterForm =
(filterForm: FormGroup, filterFormFields:Array<FilterFormField>):string => {

  const where:Record<string, unknown> = {};
  for (const formField of filterFormFields) {

    const fieldName = formField.name;
    const typeName = `${fieldName}Type`;
    if (filterForm.controls[fieldName]?.value || filterForm.controls[fieldName]?.value === 0) {

      switch (formField.type) {

      case 'string':
        where[fieldName] = createStringCondition(filterForm, fieldName, typeName);
        break;
      case 'void':
        where[fieldName] = {ne: filterForm?.controls[fieldName]?.value};
        break;
      case 'number':
        const whereNumberN = {};
        whereNumberN[filterForm?.controls[typeName]?.value] = filterForm.controls[fieldName]?.value;
        where[fieldName] = whereNumberN;
        break;
      case 'date':
        const whereNumber = {};
        const dVal = filterForm?.controls[fieldName]?.value;
        whereNumber[filterForm?.controls[typeName]?.value] = dayjs(dVal).format('YYYY-MM-DD');
        where[fieldName] = whereNumber;
        break;

      }

    }
    // Hanlding between operators.
    const cType = filterForm.controls[typeName]?.value;
    if (cType === 'between') {

      if (formField.type === 'date') {

        const sdVal = filterForm.controls[`${fieldName}Start`]?.value;
        const edVal = filterForm.controls[`${fieldName}End`]?.value;
        const start = dayjs(sdVal).format('YYYY-MM-DD');
        const end = dayjs(edVal).format('YYYY-MM-DD');
        where[fieldName] = {between: [ start, end ]};

      } else {

        const start = filterForm.controls[`${fieldName}Start`]?.value;
        const end = filterForm.controls[`${fieldName}End`]?.value;
        where[fieldName] = {between: [ start, end ]};

      }

    }

  }
  if (Object.keys(where).length === 0) {

    return null;

  }
  return JSON.stringify(where);

};
