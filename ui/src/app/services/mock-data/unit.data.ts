import { Unit } from '@shared/entity/inventory/unit';


export const mgUnit:Unit = {id: '01231',
  name: 'Millie gram',
  code: 'mg',
  decimalPlaces: 3,
  times: 1000,
  description: 'mgUnit with decimal places 3'};

export const noUnit:Unit = {id: '01230',
  name: 'Number',
  code: 'No',
  parent: mgUnit,
  decimalPlaces: 0,

  times: 1000,
  description: 'noUnit with decimal places 0'};

export const mlUnit:Unit = {id: '01221',
  name: 'Millie liter',
  code: 'ml',
  decimalPlaces: 3,
  parent: noUnit,
  times: 1000,
  description: 'mlUnit with decimal places 3'};

export const kgUnit:Unit = {id: '01232',
  name: 'Kilogram',
  code: 'kg',
  decimalPlaces: 3,
  times: 1000,
  parent: mlUnit,

  description: 'kgUnit with decimal places 3'};

export const literUnit:Unit = {id: '01222',
  name: 'Liter',
  code: 'ml',
  parent: mlUnit,
  times: 1000,
  decimalPlaces: 3,
  description: 'litterUnit with decimal places 3'};
