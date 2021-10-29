const createResourceObj = (name: string, key: string, operation: string) => ({name,
  key,
  operation});
const resourcePs:Record<string, {name: string, key: string, operation: string}> = {

  commonResources: createResourceObj('common-resource', '', ''),

  branchView: createResourceObj('branch-view', 'branch', 'view'),
  branchCreate: createResourceObj('branch-create', 'branch', 'create'),
  branchUpdate: createResourceObj('branch-update', 'branch', 'update'),
  branchDelete: createResourceObj('branch-delete', 'branch', 'delete'),

  finyearView: createResourceObj('finyear-view', 'finyear', 'view'),
  finyearCreate: createResourceObj('finyear-create', 'finyear', 'create'),
  finyearUpdate: createResourceObj('finyear-update', 'finyear', 'update'),
  finyearDelete: createResourceObj('finyear-delete', 'finyear', 'delete'),

  userView: createResourceObj('user-view', 'user', 'view'),
  userCreate: createResourceObj('user-create', 'user', 'create'),
  userUpdate: createResourceObj('user-update', 'user', 'update'),
  userDelete: createResourceObj('user-delete', 'user', 'delete'),

  unitView: createResourceObj('unit-view', 'unit', 'view'),
  unitCreate: createResourceObj('unit-create', 'unit', 'create'),
  unitUpdate: createResourceObj('unit-update', 'unit', 'update'),
  unitDelete: createResourceObj('unit-delete', 'unit', 'delete'),

  taxView: createResourceObj('tax-view', 'tax', 'view'),
  taxCreate: createResourceObj('tax-create', 'tax', 'create'),
  taxUpdate: createResourceObj('tax-update', 'tax', 'update'),
  taxDelete: createResourceObj('tax-delete', 'tax', 'delete'),

  categoryView: createResourceObj('category-view', 'category', 'view'),
  categoryCreate: createResourceObj('category-create', 'category', 'create'),
  categoryUpdate: createResourceObj('category-update', 'category', 'update'),
  categoryDelete: createResourceObj('category-delete', 'category', 'delete'),

  productView: createResourceObj('product-view', 'product', 'view'),
  productCreate: createResourceObj('product-create', 'product', 'create'),
  productUpdate: createResourceObj('product-update', 'product', 'update'),
  productDelete: createResourceObj('product-delete', 'product', 'delete'),

  invoiceView: createResourceObj('invoice-view', 'invoice', 'view'),
  invoiceCreate: createResourceObj('invoice-create', 'invoice', 'create'),
  invoiceUpdate: createResourceObj('invoice-update', 'invoice', 'update'),
  invoiceDelete: createResourceObj('invoice-delete', 'invoice', 'delete'),

  revenueView: createResourceObj('revenue-view', 'revenue', 'view'),
  revenueCreate: createResourceObj('revenue-create', 'revenue', 'create'),
  revenueUpdate: createResourceObj('revenue-update', 'revenue', 'update'),
  revenueDelete: createResourceObj('revenue-delete', 'revenue', 'delete'),

  customerView: createResourceObj('customer-view', 'customer', 'view'),
  customerCreate: createResourceObj('customer-create', 'customer', 'create'),
  customerUpdate: createResourceObj('customer-update', 'customer', 'update'),
  customerDelete: createResourceObj('customer-delete', 'customer', 'delete'),

  billView: createResourceObj('bill-view', 'bill', 'view'),
  billCreate: createResourceObj('bill-create', 'bill', 'create'),
  billUpdate: createResourceObj('bill-update', 'bill', 'update'),
  billDelete: createResourceObj('bill-delete', 'bill', 'delete'),

  paymentView: createResourceObj('payment-view', 'payment', 'view'),
  paymentCreate: createResourceObj('payment-create', 'payment', 'create'),
  paymentUpdate: createResourceObj('payment-update', 'payment', 'update'),
  paymentDelete: createResourceObj('payment-delete', 'payment', 'delete'),

  vendorView: createResourceObj('vendor-view', 'vendor', 'view'),
  vendorCreate: createResourceObj('vendor-create', 'vendor', 'create'),
  vendorUpdate: createResourceObj('vendor-update', 'vendor', 'update'),
  vendorDelete: createResourceObj('vendor-delete', 'vendor', 'delete'),

  bankView: createResourceObj('bank-view', 'bank', 'view'),
  bankCreate: createResourceObj('bank-create', 'bank', 'create'),
  bankUpdate: createResourceObj('bank-update', 'bank', 'update'),
  bankDelete: createResourceObj('bank-delete', 'bank', 'delete'),

  transferView: createResourceObj('transfer-view', 'transfer', 'view'),
  transferCreate: createResourceObj('transfer-create', 'transfer', 'create'),
  transferUpdate: createResourceObj('transfer-update', 'transfer', 'update'),
  transferDelete: createResourceObj('transfer-delete', 'transfer', 'delete'),

  ledgergroupView: createResourceObj('ledgergroup-view', 'ledgergroup', 'view'),
  ledgergroupCreate: createResourceObj('ledgergroup-create', 'ledgergroup', 'create'),
  ledgergroupUpdate: createResourceObj('ledgergroup-update', 'ledgergroup', 'update'),
  ledgergroupDelete: createResourceObj('ledgergroup-delete', 'ledgergroup', 'delete'),

  ledgerView: createResourceObj('ledger-view', 'ledger', 'view'),
  ledgerCreate: createResourceObj('ledger-create', 'ledger', 'create'),
  ledgerUpdate: createResourceObj('ledger-update', 'ledger', 'update'),
  ledgerDelete: createResourceObj('ledger-delete', 'ledger', 'delete'),

  voucherView: createResourceObj('voucher-view', 'voucher', 'view'),
  voucherCreate: createResourceObj('voucher-create', 'voucher', 'create'),
  voucherUpdate: createResourceObj('voucher-update', 'voucher', 'update'),
  voucherDelete: createResourceObj('voucher-delete', 'voucher', 'delete'),

  costcentreView: createResourceObj('costcentre-view', 'costcentre', 'view'),
  costcentreCreate: createResourceObj('costcentre-create', 'costcentre', 'create'),
  costcentreUpdate: createResourceObj('costcentre-update', 'costcentre', 'update'),
  costcentreDelete: createResourceObj('costcentre-delete', 'costcentre', 'delete'),

  saleView: createResourceObj('sale-view', 'sale', 'view'),
  saleCreate: createResourceObj('sale-create', 'sale', 'create'),
  saleUpdate: createResourceObj('sale-update', 'sale', 'update'),
  saleDelete: createResourceObj('sale-delete', 'sale', 'delete'),

  stockView: createResourceObj('stock-view', 'stock', 'view'),
  stockCreate: createResourceObj('stock-create', 'stock', 'create'),
  stockUpdate: createResourceObj('stock-update', 'stock', 'update'),
  stockDelete: createResourceObj('stock-delete', 'stock', 'delete'),

};
export const resourcePermissions = resourcePs;
