import { Component, OnInit } from '@angular/core';
import { LedgerService } from '@fboservices/accounting/ledger.service';
import { LedgergroupService } from '@fboservices/accounting/ledgergroup.service';
import { Ledger } from '@shared/entity/accounting/ledger';
import { TransactionType } from '@shared/entity/accounting/transaction';
import { VoucherType } from '@shared/entity/accounting/voucher';
import { defalutLedgerGroupCodes as dlgn} from '@shared/util/ledger-group-codes';
import { QueryData } from '@shared/util/query-data';

@Component({
  selector: 'app-create-contra',
  templateUrl: './create-contra.component.html',
  styleUrls: [ './create-contra.component.scss' ]
})
export class CreateContraComponent implements OnInit {

  primaryTransactionType = TransactionType.DEBIT;

  voucherType = VoucherType.CONTRA;

  ledgersFiltered: Array<Ledger> = [];

  pLedgerGroupIds: Array<string> = [];

  constructor(private ledgerService: LedgerService,
    private ledgergroupService: LedgergroupService) { }

  ngOnInit(): void {

    const pLGNames = [ dlgn.BANK_ACCOUNTS, dlgn.CACH_IN_HAND ];
    const queryData:QueryData = {
      where: {
        code: {
          inq: pLGNames
        }
      }
    };
    this.ledgergroupService.search(queryData).subscribe((ledgerGroups) => {

      ledgerGroups.forEach((lgr) => this.pLedgerGroupIds.push(lgr.id));

    });

  }


  public handleLedgerChangeEvent = (ledgerQ: string):void => {

    this.ledgerService.search({ where: {
      name: {like: ledgerQ,
        options: 'i'},
      ledgerGroupId: {
        inq: this.pLedgerGroupIds
      }
    } })
      .subscribe((ledgers) => (this.ledgersFiltered = ledgers));

  };

}
