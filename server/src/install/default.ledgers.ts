import { Ledger } from '@shared/entity/accounting/ledger';
import { defalutLedgerGroupCodes as dlgc } from '@shared/util/ledger-group-codes';
import { defalutLedgerCodes as dlc} from '@shared/util/ledger-codes';

export const defaultLedgers:Array<Ledger> = [
  {name: 'Profit and Loss Account',
    code: dlc.PROFIT_AND_LOSS_ACCOUNT,
    ledgerGroup: {code: dlgc.LIABILITIES}},
  {name: 'Petty Cash',
    code: dlc.PETTY_CASH,
    ledgerGroup: {code: dlgc.CACH_IN_HAND}}
];
