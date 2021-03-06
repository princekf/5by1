import { Component, OnInit } from '@angular/core';
import { LedgerService } from '@fboservices/accounting/ledger.service';
import { LedgerGroupService } from '@fboservices/accounting/ledger-group.service';
import { Ledger } from '@shared/entity/accounting/ledger';
import { TransactionType } from '@shared/entity/accounting/transaction';
import { VoucherType } from '@shared/entity/accounting/voucher';
import { findLedgerIdsIncludingChilds2 } from '../../voucher.util';
import { defalutLedgerGroupCodes as dlgn} from '@shared/util/ledger-group-codes';

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
    private ledgergroupService: LedgerGroupService) { }

  ngOnInit(): void {

    const pLGNames = [ dlgn.BANK_ACCOUNTS, dlgn.CACH_IN_HAND ];
    const cLGNames = [ dlgn.SUNDRY_CREDITORS, dlgn.SUNDRY_DEBTORS ];
    const where = {code: {
      inq: [ ...pLGNames, ...cLGNames ]
    }};
    this.ledgergroupService.childs(where).subscribe((ledgerGroups) => {

      [ this.pLedgerGroupIds, this.cLedgerGroupIds ] = findLedgerIdsIncludingChilds2(pLGNames, cLGNames, ledgerGroups);

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
