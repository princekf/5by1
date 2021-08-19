import { Product } from '@shared/entity/inventory/product';
import { computer } from '../mock-data/category.data';

export const lnvDesktop1:Product = {
  _id: 'PRD-001',
  name: 'IdeaCentre AIO 330 19.5" All-in-One Desktop',
  code: 'LNV-IC-AIO',
  barcode: '11001100',
  brand: 'Lenovo',
  location: 'Rack-1',
  status: 'Active',
  hasBatch: false,
  colors: [ 'Black', 'Silver' ],
  category: computer,
  description: 'Processor: Intel Pentium Silver J5040 | Speed: 2.0 GHz (Base) - 3.2 GHz (Max) | 4 Cores | 4MB Cache ,OS: Pre-Loaded Windows 10 Home with Lifetime Validity'
};
export const hpDesktop1:Product = {
  _id: 'PRD-002',
  name: 'All in One PC 20.7-inch',
  code: 'HP-21-b0707in',
  barcode: '11001101',
  brand: 'HP',
  location: 'Rack-2',
  status: 'Active',
  hasBatch: false,
  colors: [ 'Black', 'Silver' ],
  category: computer,
  description: 'Processor: Intel Celeron J4025 (2.0 GHz base frequency, up to 2.9 GHz, 2 MB L2 cache, 2 cores)'
};
