import { Component, OnInit } from '@angular/core';
import { LedgerService } from '@fboservices/accounting/ledger.service';
import { LedgergroupService } from '@fboservices/accounting/ledgergroup.service';
import { Ledger } from '@shared/entity/accounting/ledger';
import { TransactionType } from '@shared/entity/accounting/transaction';
import { VoucherType } from '@shared/entity/accounting/voucher';
import { defalutLedgerGroupCodes as dlgn} from '@shared/util/ledger-group-codes';
import { findLedgerIdsIncludingChilds } from '../../voucher.util';
@Component({
  selector: 'app-create-credit-note',
  templateUrl: './create-credit-note.component.html',
  styleUrls: [ './create-credit-note.component.scss' ]
})
export class CreateCreditNoteComponent implements OnInit {

  primaryTransactionType = TransactionType.CREDIT;

  voucherType = VoucherType.CREDIT_NOTE;

  ledgersFiltered: Array<Ledger> = [];

  ledgersCompoundFiltered: Array<Ledger> = [];

  pLedgerGroupIds: Array<string> = [];

  cLedgerGroupIds: Array<string> = [];

  constructor(private ledgerService: LedgerService,
    private ledgergroupService: LedgergroupService) { }

  ngOnInit(): void {

    const pLGNames = [ dlgn.SUNDRY_CREDITORS, dlgn.SUNDRY_DEBTORS ];
    const where = {code: {
      inq: [ ...pLGNames ]
    }};
    this.ledgergroupService.childs(where).subscribe((ledgerGroups) => {

      this.pLedgerGroupIds = findLedgerIdsIncludingChilds(pLGNames, ledgerGroups);

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
        options: 'i'}
    } })
      .subscribe((ledgers) => (this.ledgersCompoundFiltered = ledgers));

  };

}
