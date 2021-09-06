import { Unit } from '@shared/entity/inventory/unit';


export const mgUnit:Unit = {id: '01231',
  name: 'Millie gram',
  code: 'mg',
  decimalPlaces: 3};

export const noUnit:Unit = {id: '01230',
  name: 'Number',
  code: 'No',
  baseUnit: mgUnit,
  decimalPlaces: 0};

export const mlUnit:Unit = {id: '01221',
  name: 'Millie liter',
  code: 'ml',
  decimalPlaces: 3};

export const kgUnit:Unit = {id: '01232',
  name: 'Kilogram',
  code: 'kg',

  times: 1000,
  decimalPlaces: 3};

export const literUnit:Unit = {id: '01222',
  name: 'Liter',
  code: 'ml',
  baseUnit: mlUnit,
  times: 1000,
  decimalPlaces: 3};
