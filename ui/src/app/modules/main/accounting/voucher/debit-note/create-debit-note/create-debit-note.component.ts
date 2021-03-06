import { Component, OnInit } from '@angular/core';
import { LedgerService } from '@fboservices/accounting/ledger.service';
import { LedgerGroupService } from '@fboservices/accounting/ledger-group.service';
import { Ledger } from '@shared/entity/accounting/ledger';
import { TransactionType } from '@shared/entity/accounting/transaction';
import { VoucherType } from '@shared/entity/accounting/voucher';
import { defalutLedgerGroupCodes as dlgn} from '@shared/util/ledger-group-codes';
import { findLedgerIdsIncludingChilds } from '../../voucher.util';

@Component({
  selector: 'app-create-debit-note',
  templateUrl: './create-debit-note.component.html',
  styleUrls: [ './create-debit-note.component.scss' ]
})
export class CreateDebitNoteComponent implements OnInit {

  primaryTransactionType = TransactionType.DEBIT;

  voucherType = VoucherType.DEBIT_NOTE;

  ledgersFiltered: Array<Ledger> = [];

  ledgersCompoundFiltered: Array<Ledger> = [];

  pLedgerGroupIds: Array<string> = [];

  cLedgerGroupIds: Array<string> = [];

  constructor(private ledgerService: LedgerService,
    private ledgergroupService: LedgerGroupService) { }

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
