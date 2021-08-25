
import { Category } from '@shared/entity/inventory/category';
import { noUnit} from '../mock-data/unit.data';

export const computer:Category = {
  _id: 'CAT-001',
  name: 'Computer',
  unit: noUnit,
  description: 'Desktop computers',
  hsnNumber: '234521',

};
export const laptop:Category = {
  _id: 'CAT-002',
  name: 'Laptops',
  description: 'Laptop computers',
  unit: noUnit,
  parent: computer,
  hsnNumber: '234521',
};
export const mobilePhones:Category = {
  _id: 'CAT-003',
  name: 'Mobile Phone',
  unit: noUnit,
  description: 'Mobile Phones',
  hsnNumber: '234521',
  parent: laptop,
};
export const television:Category = {
  _id: 'CAT-004',
  name: 'Television',
  unit: noUnit,
  description: 'Televisions',
  hsnNumber: '234521',
  parent: mobilePhones,
};