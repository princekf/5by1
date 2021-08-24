import { Unit } from '@shared/entity/inventory/unit';

export const noUnit:Unit = {_id: '01230',
  name: 'Number',
  code: 'No',
  decimalPlaces: 0};

export const mgUnit:Unit = {_id: '01231',
  name: 'Millie gram',
  code: 'mg',
  decimalPlaces: 3};

export const mlUnit:Unit = {_id: '01221',
  name: 'Millie liter',
  code: 'ml',
  decimalPlaces: 3};

export const kgUnit:Unit = {_id: '01232',
  name: 'Kilogram',
  code: 'kg',
  baseUnit: mgUnit,
  times: 1000,
  decimalPlaces: 3};

export const literUnit:Unit = {_id: '01222',
  name: 'Liter',
  code: 'ml',
  baseUnit: mlUnit,
  times: 1000,
  decimalPlaces: 3};
