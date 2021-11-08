import { Component, OnInit } from '@angular/core';
import { LedgerService } from '@fboservices/accounting/ledger.service';
import { LedgergroupService } from '@fboservices/accounting/ledgergroup.service';
import { Ledger } from '@shared/entity/accounting/ledger';
import { TransactionType } from '@shared/entity/accounting/transaction';
import { VoucherType } from '@shared/entity/accounting/voucher';
import { QueryData } from '@shared/util/query-data';
import { defalutLedgerGroupNames as dlgn} from '@shared/util/ledger-group-names';

@Component({
  selector: 'app-create-receipt',
  templateUrl: './create-receipt.component.html',
  styleUrls: [ './create-receipt.component.scss' ]
})
export class CreateReceiptComponent implements OnInit {

  primaryTransactionType = TransactionType.DEBIT;

  voucherType = VoucherType.RECEIPT;

  ledgersFiltered: Array<Ledger> = [];

  ledgersCompoundFiltered: Array<Ledger> = [];

  pLedgerGroupIds: Array<string> = [];

  cLedgerGroupIds: Array<string> = [];

  constructor(private ledgerService: LedgerService,
    private ledgergroupService: LedgergroupService) { }

  ngOnInit(): void {

    const pLGNames = [ dlgn.SUNDRY_CREDITORS, dlgn.SUNDRY_DEBTORS ];
    const cLGNames = [ dlgn.BANK_ACCOUNTS, dlgn.CACH_IN_HAND ];
    const queryData:QueryData = {
      where: {
        name: {
          inq: [ ...pLGNames, ...cLGNames ]
        }
      }
    };
    this.ledgergroupService.search(queryData).subscribe((ledgerGroups) => {

      ledgerGroups.forEach((lgr) => {

        pLGNames.includes(lgr.name) ? this.pLedgerGroupIds.push(lgr.id) : this.cLedgerGroupIds.push(lgr.id);

      });

    });

  }

  public handlePrimaryLedgerChangeEvent = (ledgerQ: string):void => {

    this.ledgerService.search({ where: {
      name: {like: ledgerQ,
        options: 'i'},
      ledgerGroupId: {
        inq: this.pLedgerGroupIds
      }
    } })
      .subscribe((ledgers) => (this.ledgersFiltered = ledgers));

  };

  public handleCompoundLedgerChangeEvent = (ledgerQ: string):void => {

    this.ledgerService.search({ where: {
      name: {like: ledgerQ,
        options: 'i'},
      ledgerGroupId: {
        inq: this.cLedgerGroupIds
      }
    } })
      .subscribe((ledgers) => (this.ledgersCompoundFiltered = ledgers));

  };

}
