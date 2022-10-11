
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
    parentId: {type: 'string'},
    name: {type: 'string'},
    code: {type: 'string'},
    credit: {type: 'number'},
    debit: {type: 'number'},
    obCredit: {type: 'number'},
    obDebit: {type: 'number'},
    opening: {type: 'string'},
    balance: {type: 'string'},
    children: {
      type: 'array',
      items: {properties: {
        id: {type: 'string'},
        parentId: {type: 'string'},
        name: {type: 'string'},
        code: {type: 'string'},
        credit: {type: 'number'},
        debit: {type: 'number'},
        obCredit: {type: 'number'},
        obDebit: {type: 'number'},
        opening: {type: 'string'},
        balance: {type: 'string'},
      }},
    }
  }
};

export const DayBookRespSchema = {
  type: 'object',
  properties: {
    voucherId: {type: 'string'},
    ledgerId: {type: 'string'},
    ledgerName: {type: 'string'},
    ledgerCode: {type: 'string'},
    type: {type: 'string'},
    date: {type: 'Date'},
    credit: {type: 'number'},
    debit: {type: 'number'},
    obDebit: {type: 'number'},
    children: {
      type: 'array',
      items: {properties: {
        voucherId: {type: 'string'},
        ledgerId: {type: 'string'},
        ledgerName: {type: 'string'},
        ledgerCode: {type: 'string'},
        type: {type: 'string'},
        date: {type: 'Date'},
        credit: {type: 'number'},
        debit: {type: 'number'},
        obDebit: {type: 'number'},
      }},
    }
  }
};

export const LedgerReportRespSchema = {
  type: 'object',
  properties: {
    id: {type: 'string'},
    voucherNo: {type: 'string'},
    date: {type: 'Date'},
    vType: {type: 'string'},
    cLedger: {type: 'string'},
    credit: {type: 'number'},
    debit: {type: 'number'},
    details: {type: 'string'},
  }
};

export const SignupInitiateResponseSchema = {
  type: 'object',
  properties: {
    status: {type: 'string'},
    message: {type: 'string'},
  },
};

export interface SignupInitiateResponse {
  status: string;
  message: string;
}
