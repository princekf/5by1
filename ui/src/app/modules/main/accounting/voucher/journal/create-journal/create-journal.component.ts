import { Component } from '@angular/core';
import { LedgerService } from '@fboservices/accounting/ledger.service';
import { Ledger } from '@shared/entity/accounting/ledger';
import { TransactionType } from '@shared/entity/accounting/transaction';
import { VoucherType } from '@shared/entity/accounting/voucher';

@Component({
  selector: 'app-create-journal',
  templateUrl: './create-journal.component.html',
  styleUrls: [ './create-journal.component.scss' ]
})
export class CreateJournalComponent {

  primaryTransactionType = TransactionType.DEBIT;

  voucherType = VoucherType.JOURNAL;

  ledgersFiltered: Array<Ledger> = [];

  constructor(private ledgerService: LedgerService) { }

  public handleLedgerChangeEvent = (ledgerQ: string):void => {

    this.ledgerService.search({ where: {
      name: {like: ledgerQ,
        options: 'i'},
    } })
      .subscribe((ledgers) => (this.ledgersFiltered = ledgers));

  };

}
