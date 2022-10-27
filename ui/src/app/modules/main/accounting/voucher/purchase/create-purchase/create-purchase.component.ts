import { Component, OnInit } from '@angular/core';
import { LedgerService } from '@fboservices/accounting/ledger.service';
import { LedgerGroupService } from '@fboservices/accounting/ledger-group.service';
import { Ledger } from '@shared/entity/accounting/ledger';
import { TransactionType } from '@shared/entity/accounting/transaction';
import { VoucherType } from '@shared/entity/accounting/voucher';
import { defalutLedgerGroupCodes as dlgn} from '@shared/util/ledger-group-codes';
import { findLedgerIdsIncludingChilds2 } from '../../voucher.util';

@Component({
  selector: 'app-create-purchase',
  templateUrl: './create-purchase.component.html',
  styleUrls: [ './create-purchase.component.scss' ]
})
export class CreatePurchaseComponent implements OnInit {

  primaryTransactionType = TransactionType.CREDIT;

  voucherType = VoucherType.PURCHASE;

  ledgersFiltered: Array<Ledger> = [];

  ledgersCompoundFiltered: Array<Ledger> = [];

  pLedgerGroupIds: Array<string> = [];

  cLedgerGroupIds: Array<string> = [];

  constructor(private ledgerService: LedgerService,
    private ledgergroupService: LedgerGroupService) { }

  ngOnInit(): void {

    const pLGNames = [ dlgn.SUNDRY_CREDITORS, dlgn.SUNDRY_DEBTORS ];
    const cLGNames = [ dlgn.PURCHASE_ACCOUNTS, dlgn.DUTIES_AND_TAXESR, dlgn.DIRECT_EXPENSES, dlgn.INDIRECT_EXPENSES,
      dlgn.FIXED_ASSETS, dlgn.CURRENT_ASSETS ];
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
