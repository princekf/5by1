
export const TrialBalanceLedgerSummaryRespSchema = {
  type: 'array',
  items: {properties: {
    ledgerId: {type: 'string'},
    ledger: {type: 'string'},
    ledgerGroupId: {type: 'string'},
    debit: {type: 'number'},
    credit: {type: 'number'},
  }},
};

export const LedgerGroupSummaryRespSchema = {
  type: 'array',
  items: {properties: {
    id: {type: 'string'},
    name: {type: 'string'},
    code: {type: 'string'},
    debit: {type: 'number'},
    credit: {type: 'number'},
    obDebit: {type: 'number'},
    obCredit: {type: 'number'},
  }},
};