import { FormGroup } from '@angular/forms';

export interface SingleCondition {
    name: string;
    operator: string;
    value: string;
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
  for (const oper of [ 'eq', 'lt', 'gt' ]) {

    if (condition[oper]) {

      return {
        name,
        operator: oper,
        value: condition[oper] as string,

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
    filterForm.controls[condExtract.name]?.setValue(condExtract.value);
    filterForm.controls[`${condExtract.name}Type`]?.setValue(condExtract.operator);

  }

};

export const createQueryStringFromFilterForm =
(filterForm: FormGroup, filterFormFields:Array<FilterFormField>):string => {

  const where:Record<string, unknown> = {};
  for (const formField of filterFormFields) {

    const fieldName = formField.name;
    const typeName = `${fieldName}Type`;
    if (filterForm.controls[fieldName]?.value) {

      switch (formField.type) {

      case 'string':
        where[fieldName] = {like: `${filterForm.controls[typeName]?.value}${filterForm.controls[fieldName]?.value}`,
          options: 'i'};
        break;
      case 'number':
        const whereNumber = {};
        whereNumber[filterForm.controls[typeName]?.value] = filterForm.controls[fieldName]?.value;
        where[fieldName] = whereNumber;
        break;

      }

    }

  }
  return JSON.stringify(where);

};
