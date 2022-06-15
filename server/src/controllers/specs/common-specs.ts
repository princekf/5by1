
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
export const BalanceSheetRespSchema = {
  type: 'array',
  items: {properties: {
    lItem: {type: 'string'},
    lAmount: {type: 'string'},
    rItem: {type: 'string'},
    rAmount: {type: 'string'},
  }},
};

export const TrialBalanceRespSchema = {
  type: 'object',
  properties: {
    id: {type: 'string'},
    name: {type: 'string'},
    code: {type: 'string'},
    credit: {type: 'number'},
    debit: {type: 'number'},
    obCredit: {type: 'number'},
    obDebit: {type: 'number'},
    balance: {type: 'number'},
    children: {
      type: 'array',
      items: {properties: {
        id: {type: 'string'},
        name: {type: 'string'},
        code: {type: 'string'},
        credit: {type: 'number'},
        debit: {type: 'number'},
        obCredit: {type: 'number'},
        obDebit: {type: 'number'},
        balance: {type: 'number'},
      }},
    }
  }
};
