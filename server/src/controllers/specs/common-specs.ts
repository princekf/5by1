
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
